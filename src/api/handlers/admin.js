/**
 * Admin API Handler
 * Handles admin authentication and admin-specific operations
 */

import { hashPassword, verifyPassword, generateToken, verifyToken } from '../../utils/auth';
import { loginAdmin } from '../../utils/neon';

// Helper function to get JWT secret
function getJWTSecret(env) {
  return env.JWT_SECRET || 'dev-secret-key-change-in-production';
}

export async function handleAdmin(request, env, corsHeaders) {
  const url = new URL(request.url);
  const method = request.method;
  const pathParts = url.pathname.split('/').filter(Boolean);

  // POST /api/admin/login - Admin login
  if (method === 'POST' && pathParts[2] === 'login') {
    return adminLogin(request, env, corsHeaders);
  }

  // POST /api/admin/verify - Verify token
  if (method === 'POST' && pathParts[2] === 'verify') {
    return verifyAdminToken(request, env, corsHeaders);
  }

  // POST /api/admin/logout - Admin logout
  if (method === 'POST' && pathParts[2] === 'logout') {
    return adminLogout(request, env, corsHeaders);
  }

  // GET /api/admin/stats - Get dashboard statistics (Admin only)
  if (method === 'GET' && pathParts[2] === 'stats') {
    return getDashboardStats(request, env, corsHeaders);
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Admin login
async function adminLogin(request, env, corsHeaders) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(JSON.stringify({
        error: 'Username and password are required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Login using Neon database
    const admin = await loginAdmin(env, username, password);

    if (!admin) {
      return new Response(JSON.stringify({
        error: 'Invalid username or password'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate JWT token
    const token = await generateToken({
      id: admin.id,
      username: admin.username,
      role: admin.role,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    }, getJWTSecret(env));

    return new Response(JSON.stringify({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: admin.id,
          username: admin.username,
          role: admin.role,
        },
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Verify admin token
async function verifyAdminToken(request, env, corsHeaders) {
  try {
    const { token } = await request.json();

    if (!token) {
      return new Response(JSON.stringify({
        error: 'Token is required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload = await verifyToken(token, getJWTSecret(env));

    if (!payload) {
      return new Response(JSON.stringify({
        error: 'Invalid or expired token'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: { user: payload },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Admin logout
async function adminLogout(request, env, corsHeaders) {
  return new Response(JSON.stringify({
    success: true,
    message: 'Logged out successfully',
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Get dashboard statistics
async function getDashboardStats(request, env, corsHeaders) {
  try {
    const admin = await requireAuth(request, env);
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { getDashboardStats, getInquiries } = await import('../../utils/neon');
    const stats = await getDashboardStats(env);

    // Get recent inquiries
    const inquiries = await getInquiries(env, { limit: 5 });

    return new Response(JSON.stringify({
      success: true,
      data: {
        ...stats,
        recent_inquiries: inquiries,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Helper function to check authentication
export async function requireAuth(request, env) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = await verifyToken(token, getJWTSecret(env));

  if (!payload) {
    return null;
  }

  return payload;
}

// Helper function to check if user is super admin
export async function requireSuperAdmin(request, env) {
  const admin = await requireAuth(request, env);

  if (!admin || admin.role !== 'super_admin') {
    return null;
  }

  return admin;
}
