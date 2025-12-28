import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schema for lead data
const leadSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string()
    .trim()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .transform(val => val.toLowerCase()),
  ebook_downloaded: z.boolean().optional().default(false),
  source: z.string().max(100).optional().nullable(),
  utm_campaign: z.string().max(100).optional().nullable(),
  utm_source: z.string().max(100).optional().nullable(),
  utm_medium: z.string().max(100).optional().nullable(),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    
    // Validate input using zod schema
    const validationResult = leadSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(', ');
      console.log('Validation failed:', errors);
      return new Response(
        JSON.stringify({ error: `Validation failed: ${errors}` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { 
      name, 
      email, 
      ebook_downloaded,
      source,
      utm_campaign,
      utm_source,
      utm_medium 
    } = validationResult.data;

    // Check if lead already exists
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .single();

    if (existingLead) {
      // Update existing lead
      const { data, error } = await supabase
        .from('leads')
        .update({
          name,
          ebook_downloaded,
          source: source || undefined,
          utm_campaign: utm_campaign || undefined,
          utm_source: utm_source || undefined,
          utm_medium: utm_medium || undefined,
        })
        .eq('id', existingLead.id)
        .select()
        .single();

      if (error) throw error;

      console.log(`Updated existing lead: ${email}`);

      return new Response(
        JSON.stringify({ id: data.id, message: 'Lead updated' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get IP address from headers
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip_address = forwardedFor ? forwardedFor.split(',')[0].trim() : null;

    // Create new lead
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name,
        email,
        ip_address,
        ebook_downloaded,
        portal_accessed: false,
        reports_downloaded: false,
        analysis_completed: false,
        violations_found: 0,
        call_booked: false,
        source,
        utm_campaign,
        utm_source,
        utm_medium,
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`Created new lead: ${email}`);

    return new Response(
      JSON.stringify({ id: data.id, message: 'Lead created' }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: unknown) {
    console.error('Error in create-lead function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
