"use server";

import { redirect } from "next/navigation";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

export async function loginAdmin(formData) {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const email = typeof emailValue === "string" ? emailValue.trim() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (!email || !password) {
    redirect("/admin/login?error=invalid");
  }

  let loginError;
  try {
    const supabase = await createSupabaseAuthServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    loginError = error;
  } catch (error) {
    console.error("Gagal memproses login admin:", error);
    redirect("/admin/login?error=service");
  }

  if (loginError) {
    redirect("/admin/login?error=credentials");
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  try {
    const supabase = await createSupabaseAuthServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  } catch (error) {
    console.error("Gagal mengakhiri sesi admin:", error);
    redirect("/admin/login?error=logout");
  }

  redirect("/admin/login");
}