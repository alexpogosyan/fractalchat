"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";

export async function signin(formData: FormData) {
  const supabase = await getServerClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await getServerClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function getUser() {
  const supabase = await getServerClient();
  const { data } = await supabase.auth.getUser();
  return data;
}

export async function signout() {
  const supabase = await getServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function signInAnonymously() {
  console.log("🚀 Starting anonymous sign-in...");

  const supabase = await getServerClient();
  console.log("✅ Supabase client created");

  console.log("📡 Calling supabase.auth.signInAnonymously()...");
  const { data, error } = await supabase.auth.signInAnonymously();

  console.log("📊 Response:", {
    user: data?.user?.id,
    session: data?.session?.access_token ? "present" : "missing",
    error: error ? { message: error.message, status: error.status } : null,
  });

  if (error) {
    console.error("❌ Anonymous sign-in failed:", error);
    const errorParams = new URLSearchParams({
      message: error.message,
      code: error.status?.toString() || "unknown",
      context: "anonymous_signin",
    });
    redirect(`/error?${errorParams.toString()}`);
  }

  console.log("✅ Anonymous sign-in successful! Redirecting...");
  revalidatePath("/", "layout");
  redirect("/");
}
