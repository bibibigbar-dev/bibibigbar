"use server";

import { redirect } from "next/navigation";
import {
  OWNER_EMAIL,
  clearSession,
  createSession,
  syncOwnerPassword,
  toSessionUser,
  verifyPassword,
} from "@/lib/auth";
import { readStore } from "@/lib/store";
import { safeNextPath } from "@/lib/utils";

export async function loginAction(_previous: { error?: string }, formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  await syncOwnerPassword();
  const store = await readStore();
  const user = store.users.find((item) => item.email === OWNER_EMAIL && item.role === "admin");
  if (email !== OWNER_EMAIL || !user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Invalid email or password." };
  }

  await createSession(toSessionUser(user));
  const nextPath = safeNextPath(String(formData.get("next") || ""));
  redirect(nextPath || (user.role === "admin" ? "/admin" : "/my"));
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
