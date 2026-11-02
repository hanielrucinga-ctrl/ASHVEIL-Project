import { createFileRoute, Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminMe } from "@/lib/admin-guard";
import { setAdminToken } from "@/lib/admin-client";
import { getShopCapabilities } from "@/lib/shop-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const TABS = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/story", label: "About story" },
  { to: "/admin/stock", label: "Stock" },
  { to: "/admin/ledger", label: "Money" },
];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const me = useQuery({
    queryKey: ["admin-me"],
    queryFn: async () => {
      try {
        return await adminMe();
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 0,
  });
  const capabilities = useQuery({
    queryKey: ["shop-capabilities"],
    queryFn: () => getShopCapabilities(),
    retry: false,
  });

  if (me.isPending) {
    return (
      <main className="grid min-h-dvh place-items-center bg-bg text-fg">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Loading studio</p>
      </main>
    );
  }
  if (me.isError || !me.data) return <Navigate to="/login" />;

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="border-b border-fg px-4 py-3 md:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link to="/admin" className="text-xs uppercase tracking-[0.22em]">
            Ashveil Studio
          </Link>
          <div className="flex items-center gap-4">
            <p className="hidden text-[11px] text-muted md:block">{me.data.email}</p>
            <Link to="/" className="text-[11px] uppercase tracking-[0.16em] underline underline-offset-4">
              Store
            </Link>
            <button
              type="button"
              className="text-[11px] uppercase tracking-[0.16em] underline underline-offset-4"
              onClick={() => {
                setAdminToken(null);
                window.location.href = "/login";
              }}
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="mt-3 flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const on = tab.exact ? pathname === tab.to : pathname.startsWith(tab.to);
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={cn(
                  "min-h-11 px-3 py-2 text-[11px] uppercase tracking-[0.16em]",
                  on ? "bg-ink text-bg" : "shadow-[0_0_0_1px_#111111]",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <div className="flex-1 px-4 py-8 md:px-8">
        {capabilities.data?.databaseConfigured === false ? (
          <p className="mx-auto mb-6 max-w-5xl border border-fg/20 bg-white/50 px-4 py-3 text-sm text-muted">
            No database is connected. The built-in catalog is available, but product edits, stock changes, and ledger entries need a database to persist.
          </p>
        ) : null}
        <Outlet />
      </div>
    </div>
  );
}
