import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env.server";

export const ADMIN_EMAIL = (env("ASHVEIL_ADMIN_EMAIL") ?? "ashveil.vg@gmail.com").toLowerCase();
const ADMIN_PASSWORD = env("ASHVEIL_ADMIN_PASSWORD");
const SECRET = env("ASHVEIL_ADMIN_SESSION_SECRET");

export function adminSessionConfigured() {
  return Boolean(ADMIN_PASSWORD && SECRET && SECRET.length >= 32);
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest();
}

function hmac(value: string) {
  if (!SECRET) throw new Error("Studio session signing is not configured");
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

function equalBuf(a: Buffer, b: Buffer) {
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function credentialsMatch(email: string, password: string) {
  if (!adminSessionConfigured() || !ADMIN_PASSWORD) return false;
  const wantEmail = Buffer.from(ADMIN_EMAIL);
  const gotEmail = Buffer.from(email.trim().toLowerCase());
  const emailOk = equalBuf(sha256(gotEmail.toString()), sha256(wantEmail.toString())) && email.trim().toLowerCase() === ADMIN_EMAIL;
  const passOk = equalBuf(sha256(password), sha256(ADMIN_PASSWORD));
  return emailOk && passOk;
}

export function issueAdminToken() {
  if (!adminSessionConfigured()) {
    throw new Error(
      "Studio access is not configured. Set ASHVEIL_ADMIN_PASSWORD and a 32-character ASHVEIL_ADMIN_SESSION_SECRET.",
    );
  }
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7;
  const payload = Buffer.from(JSON.stringify({ e: ADMIN_EMAIL, exp })).toString("base64url");
  return `${payload}.${hmac(payload)}`;
}

export function assertAdminToken(token: string | undefined) {
  const err = () => {
    const e = new Error("Unauthorized");
    (e as Error & { status: number }).status = 401;
    return e;
  };
  if (!token || !adminSessionConfigured()) throw err();
  const cut = token.lastIndexOf(".");
  if (cut <= 0) throw err();
  const payload = token.slice(0, cut);
  const sig = token.slice(cut + 1);
  const expected = hmac(payload);
  if (!equalBuf(Buffer.from(sig), Buffer.from(expected))) throw err();
  let data: { e?: string; exp?: number };
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { e?: string; exp?: number };
  } catch {
    throw err();
  }
  if (data.e !== ADMIN_EMAIL || !data.exp || data.exp < Date.now()) throw err();
}
