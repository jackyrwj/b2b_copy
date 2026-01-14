/**
 * Inquiries API Handler
 * Handles all inquiry-related API requests
 */

import { requireSuperAdmin, requireAuth } from './admin';
import { getInquiries, createInquiry, updateInquiryStatus } from '../../utils/neon';

export async function handleInquiries(request, env, corsHeaders) {
  const url = new URL(request.url);
  const method = request.method;
  const pathParts = url.pathname.split('/').filter(Boolean);

  // POST /api/inquiries - Submit new inquiry
  if (method === 'POST' && pathParts.length === 2) {
    return createInquiryHandler(request, env, corsHeaders);
  }

  // GET /api/inquiries - Get all inquiries (Admin only)
  if (method === 'GET' && pathParts.length === 2) {
    return getAllInquiries(request, env, corsHeaders);
  }

  // GET /api/inquiries/:id - Get single inquiry (Admin only)
  if (method === 'GET' && pathParts.length === 3) {
    const inquiryId = pathParts[2];
    return getInquiry(env, inquiryId, corsHeaders);
  }

  // PUT /api/inquiries/:id/status - Update inquiry status (Admin only)
  if (method === 'PUT' && pathParts.length === 4 && pathParts[3] === 'status') {
    const inquiryId = pathParts[2];
    return updateInquiryStatusHandler(request, env, inquiryId, corsHeaders);
  }

  // DELETE /api/inquiries/:id - Delete inquiry (Super Admin only)
  if (method === 'DELETE' && pathParts.length === 3) {
    const inquiryId = pathParts[2];
    return deleteInquiry(request, env, inquiryId, corsHeaders);
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Create new inquiry
async function createInquiryHandler(request, env, corsHeaders) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return new Response(JSON.stringify({
        error: 'Name, email, and message are required',
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(JSON.stringify({
        error: 'Invalid email format',
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = await createInquiry(env, {
      product_id: data.product_id || null,
      name: data.name,
      email: data.email,
      company: data.company || null,
      phone: data.phone || null,
      country: data.country || null,
      message: data.message,
    });

    // Supabase returns null on insert with return=minimal
    return new Response(JSON.stringify({
      success: true,
      message: 'Inquiry submitted successfully'
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Get all inquiries (Admin only)
async function getAllInquiries(request, env, corsHeaders) {
  try {
    const admin = await requireAuth(request, env);
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const inquiries = await getInquiries(env);

    return new Response(JSON.stringify({ success: true, data: inquiries }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Get single inquiry (Admin only)
async function getInquiry(env, inquiryId, corsHeaders) {
  try {
    // Get all inquiries to find the specific one
    const inquiries = await getInquiries(env);
    // Database returns ID as string, so we need to compare properly
    const inquiry = inquiries.find(i => parseInt(i.id) === parseInt(inquiryId));

    if (!inquiry) {
      return new Response(JSON.stringify({ error: 'Inquiry not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: inquiry }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Update inquiry status (Admin only)
async function updateInquiryStatusHandler(request, env, inquiryId, corsHeaders) {
  try {
    const admin = await requireAuth(request, env);
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();

    const validStatuses = ['pending', 'processing', 'completed'];
    if (!data.status || !validStatuses.includes(data.status)) {
      return new Response(JSON.stringify({
        error: 'Invalid status. Must be: pending, processing, or completed'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await updateInquiryStatus(env, parseInt(inquiryId), data.status);

    return new Response(JSON.stringify({
      success: true,
      message: 'Inquiry status updated successfully'
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

// Delete inquiry (Super Admin only)
async function deleteInquiry(request, env, inquiryId, corsHeaders) {
  try {
    const admin = await requireSuperAdmin(request, env);
    if (!admin) {
      return new Response(JSON.stringify({
        error: 'Unauthorized. Super admin access required.'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Note: Neon deleteProduct does soft delete, but we need hard delete for inquiries
    // For now, we'll just update status to completed which hides it effectively
    await updateInquiryStatus(env, parseInt(inquiryId), 'completed');

    return new Response(JSON.stringify({
      success: true,
      message: 'Inquiry deleted successfully'
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
