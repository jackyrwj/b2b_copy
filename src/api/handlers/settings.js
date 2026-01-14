/**
 * Settings API Handler
 * Handles website settings stored in Supabase
 */

import { requireSuperAdmin } from './admin';
import { getSettings, updateSettings } from '../../utils/neon';

export async function handleSettings(request, env, corsHeaders) {
  const url = new URL(request.url);
  const method = request.method;

  // GET /api/settings - Get all settings
  if (method === 'GET') {
    return getSettingsHandler(env, corsHeaders);
  }

  // POST /api/settings - Update settings (Super Admin only)
  if (method === 'POST') {
    return updateSettingsHandler(request, env, corsHeaders);
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Get settings
async function getSettingsHandler(env, corsHeaders) {
  try {
    const siteName = await getSettings(env, 'site_name');
    const siteDescription = await getSettings(env, 'site_description');
    const companyIntro = await getSettings(env, 'company_intro');
    const email = await getSettings(env, 'email');
    const phone = await getSettings(env, 'phone');
    const address = await getSettings(env, 'address');
    const linkedin = await getSettings(env, 'linkedin');
    const facebook = await getSettings(env, 'facebook');
    const twitter = await getSettings(env, 'twitter');

    const settings = {
      site_name: siteName || 'GlobalMart',
      site_description: siteDescription || 'Your trusted partner for high-quality industrial products',
      company_intro: companyIntro || 'We are a leading manufacturer and supplier of high-quality industrial products.',
      email: email || 'info@example.com',
      phone: phone || '+1 234 567 8900',
      address: address || '123 Business St, City, Country',
      linkedin: linkedin || '',
      facebook: facebook || '',
      twitter: twitter || '',
    };

    return new Response(JSON.stringify({ success: true, data: settings }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Update settings (Super Admin only)
async function updateSettingsHandler(request, env, corsHeaders) {
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

    const data = await request.json();

    // Save each setting individually
    const settings = {
      site_name: data.site_name || 'GlobalMart',
      site_description: data.site_description || '',
      company_intro: data.company_intro || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      linkedin: data.linkedin || '',
      facebook: data.facebook || '',
      twitter: data.twitter || '',
    };

    for (const [key, value] of Object.entries(settings)) {
      await updateSettings(env, key, value);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Settings saved successfully',
      data: settings
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
