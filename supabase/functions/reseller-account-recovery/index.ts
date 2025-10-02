import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RecoveryRequest {
  email: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: RecoveryRequest = await req.json();
    console.log(`🔍 Account recovery request for: ${email}`);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Check if reseller application exists
    const { data: resellerApp, error: appError } = await supabaseAdmin
      .from("reseller_applications")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (appError) {
      console.error("Error checking reseller application:", appError);
      throw appError;
    }

    if (!resellerApp) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No reseller application found",
          action: "apply",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    console.log(`📋 Application status: ${resellerApp.status}`);

    // Check application status
    if (resellerApp.status === "pending") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Your application is pending admin approval",
          action: "wait",
          status: "pending",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (resellerApp.status === "rejected") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Your application was not approved. Please contact support.",
          action: "contact_support",
          status: "rejected",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // If approved, check if auth user exists
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error listing auth users:", authError);
      throw authError;
    }

    const userExists = authUsers.users.some(u => u.email === email);
    console.log(`👤 Auth user exists: ${userExists}`);

    if (!userExists && resellerApp.user_id) {
      // User exists in reseller_applications but not in auth
      return new Response(
        JSON.stringify({
          success: false,
          message: "Account found but login credentials need to be set up. Please contact admin.",
          action: "contact_admin",
          status: "approved_no_auth",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (!userExists) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Your application is approved but your account hasn't been created yet. Please contact admin.",
          action: "contact_admin",
          status: "approved_no_account",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // User exists and is approved - send password reset
    console.log(`📧 Sending password reset email to: ${email}`);
    
    const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${req.headers.get("origin") || "https://flhqvkohslfxxfjzyzxy.supabase.co"}/reset-password/confirm`,
    });

    if (resetError) {
      console.error("Error sending password reset:", resetError);
      throw resetError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Password reset email sent! Check your inbox.",
        action: "check_email",
        status: "approved",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("❌ Recovery request failed:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "An error occurred",
        action: "retry",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
