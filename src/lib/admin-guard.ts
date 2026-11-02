import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getAdminToken } from "@/lib/admin-client";

export const adminMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    return next({ sendContext: { adminToken: getAdminToken() ?? undefined } });
  })
  .server(async ({ next, context }) => {
    const { assertAdminToken } = await import("./admin-session.server");
    assertAdminToken(context.adminToken);
    return next({ context: { admin: true as const } });
  });

export const adminLogin = createServerFn({ method: "POST" })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const { adminSessionConfigured, credentialsMatch, issueAdminToken } = await import("./admin-session.server");
    if (!adminSessionConfigured()) {
      throw new Error(
        "Studio access is disabled until ASHVEIL_ADMIN_PASSWORD and a 32-character ASHVEIL_ADMIN_SESSION_SECRET are configured.",
      );
    }
    if (!credentialsMatch(data.email, data.password)) {
      throw new Error("Invalid email or password");
    }
    return { token: issueAdminToken() };
  });

export const adminMe = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async () => {
    const { ADMIN_EMAIL } = await import("./admin-session.server");
    return { email: ADMIN_EMAIL };
  });
