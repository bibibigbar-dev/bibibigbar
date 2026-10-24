"use server";

import { timingSafeEqual } from "crypto";
import { redirect } from "next/navigation";
import { OWNER_EMAIL, clearSession, createSession } from "@/lib/auth";
import { safeNextPath } from "@/lib/utils";

function secretsMatch(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export async function loginAction(_previous: { error?: string }, formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const configured = process.env.ADMIN_PASSWORD?.trim() || "";

  if (!configured) return { error: "The owner password is not set on this server." };
  if (email !== OWNER_EMAIL || !secretsMatch(password, configured)) {
    return { error: "Invalid email or password." };
  }

  await createSession({
    id: "user-admin",
    email: OWNER_EMAIL,
    name: "bibibigbar",
    role: "admin",
  });
  const nextPath = safeNextPath(String(formData.get("next") || ""));
  redirect(nextPath || "/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
