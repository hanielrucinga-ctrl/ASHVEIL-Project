const KEY = "ashveil-studio";

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(KEY);
}

export function setAdminToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) sessionStorage.setItem(KEY, token);
  else sessionStorage.removeItem(KEY);
}
