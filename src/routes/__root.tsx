import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "Ashveil";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "description", content: "Ashveil — Worn by the ones who stay." },
      { name: "theme-color", content: "#F5F5DC" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/logo.png" },
      { rel: "apple-touch-icon", href: "/logo.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
    ],
  }),
  component: Root,
});

function Root() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 8_000, retry: 1 } },
      }),
  );
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg font-sans">
        <PreviewHostBridge />
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Outlet />
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "!bg-fg !text-bg !rounded-none !font-sans !text-xs !uppercase !tracking-widest",
              }}
            />
          </QueryClientProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
