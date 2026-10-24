import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { compare, hash } from "bcryptjs";
import { readStore, updateStore } from "./store";
import type { SessionUser, User } from "./types";

export const OWNER_EMAIL = "bibibigbar@gmail.com";

const SESSION_COOKIE = "dallas_session";
const SESSION_DAYS = 7;

function getSecret() {
  const secret = process.env.AUTH_SECRET || "dallas-living-dev-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export async function syncOwnerPassword() {
  const configured = process.env.ADMIN_PASSWORD?.trim();
  if (!configured) return;

  const store = await readStore();
  const owner = store.users.find((item) => item.email === OWNER_EMAIL && item.role === "admin");
  if (!owner || (await verifyPassword(configured, owner.passwordHash))) return;

  const passwordHash = await hashPassword(configured);
  await updateStore((current) => ({
    ...current,
    users: current.users.map((item) =>
      item.email === OWNER_EMAIL && item.role === "admin" ? { ...item, passwordHash } : item
    ),
  }));
}

export function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.id !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      (payload.role !== "user" && payload.role !== "admin")
    ) {
      return null;
    }

    if (payload.email !== OWNER_EMAIL || payload.role !== "admin") return null;

    const store = await readStore();
    const user = store.users.find(
      (item) => item.id === payload.id && item.email === OWNER_EMAIL && item.role === "admin"
    );
    return user ? toSessionUser(user) : null;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") throw new Error("Forbidden");
  return user;
}
