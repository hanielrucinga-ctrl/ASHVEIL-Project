import { Link, useRouterState } from "@tanstack/react-router";
import { Instagram, MapPin, Menu, Music2, ShoppingBag, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cartCount, useCart } from "@/lib/store/cart";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/care", label: "Care" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = useCart((s) => cartCount(s.lines));
  useEffect(() => setReady(true), []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/35 bg-[rgba(245,245,220,0.38)] backdrop-blur-2xl shadow-[0_10px_30px_rgba(17,17,17,0.08)]">
      <div className="relative flex items-center justify-between gap-4 border-b border-white/30 px-4 py-3 md:px-8">
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full border border-white/40 bg-[rgba(255,255,255,0.16)] text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[rgba(17,17,17,0.78)]",
                pathname === item.to
                  ? "border border-white/40 bg-[rgba(255,255,255,0.16)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
                  : "hover:bg-[rgba(255,255,255,0.08)]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link to="/" className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center">
          <img
            src="/logo.png"
            alt="Ashveil"
            className="h-10 w-auto max-w-[130px] object-contain bg-transparent p-0 shadow-none ring-0 outline-none md:h-12"
          />
        </Link>

        <Link
          to="/cart"
          className="relative ml-auto flex size-11 items-center justify-center rounded-full border border-white/40 bg-[rgba(255,255,255,0.16)] text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl"
          aria-label={`Cart, ${ready ? count : 0} items`}
        >
          <ShoppingBag className="size-5" />
          {ready && count > 0 ? (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] tabular-nums text-bg">
              {count}
            </span>
          ) : null}
        </Link>
      </div>

      {open ? (
        <nav className="flex flex-col border-b border-white/30 bg-white/10 backdrop-blur-xl md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="px-4 py-4 text-sm uppercase tracking-[0.18em] text-[rgba(17,17,17,0.8)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/35 bg-[rgba(255,255,255,0.12)] backdrop-blur-xl">
      <div className="grid gap-8 px-4 py-10 md:grid-cols-3 md:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[rgba(17,17,17,0.8)]">Ashveil</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[rgba(17,17,17,0.72)]">
            Worn by the ones who stay.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm uppercase tracking-[0.16em] text-[rgba(17,17,17,0.8)]">
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/care">Care</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/admin">Studio</Link>
        </div>
        <div className="text-sm leading-relaxed text-[rgba(17,17,17,0.72)]">
          <p>Orders & questions</p>
          <a className="text-fg underline-offset-4 hover:underline" href="mailto:ashveil.vg@gmail.com">
            ashveil.vg@gmail.com
          </a>
          <p className="mt-4 text-xs uppercase tracking-[0.16em]">Follow / find us</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <a
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/40 bg-[rgba(255,255,255,0.16)] px-3 text-[10px] uppercase tracking-[0.12em] text-[rgba(17,17,17,0.8)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] hover:bg-[rgba(255,255,255,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              href="https://www.instagram.com/ashveil.vg?utm_source=ig_web_button_share_sheet&rpxt=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noreferrer"
            >
              <Instagram className="size-4" aria-hidden="true" />
              Instagram
            </a>
            <a
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/40 bg-[rgba(255,255,255,0.16)] px-3 text-[10px] uppercase tracking-[0.12em] text-[rgba(17,17,17,0.8)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] hover:bg-[rgba(255,255,255,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              href="https://www.tiktok.com/@ashveil876?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noreferrer"
            >
              <Music2 className="size-4" aria-hidden="true" />
              TikTok
            </a>
            <a
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/40 bg-[rgba(255,255,255,0.16)] px-3 text-[10px] uppercase tracking-[0.12em] text-[rgba(17,17,17,0.8)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] hover:bg-[rgba(255,255,255,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              href="https://ashveilvg.baag.cc"
              target="_blank"
              rel="noreferrer"
            >
              <ShoppingBag className="size-4" aria-hidden="true" />
              BAAG
            </a>
            <a
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/40 bg-[rgba(255,255,255,0.16)] px-3 text-[10px] uppercase tracking-[0.12em] text-[rgba(17,17,17,0.8)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] hover:bg-[rgba(255,255,255,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              href="https://maps.app.goo.gl/K1xGbxzjgYtqqAvJ9"
              target="_blank"
              rel="noreferrer"
            >
              <MapPin className="size-4" aria-hidden="true" />
              Location
            </a>
          </div>
        </div>
      </div>
      <p className="border-t border-white/30 px-4 py-3 text-center text-[10px] uppercase tracking-[0.18em] text-[rgba(17,17,17,0.7)]">
        © {new Date().getFullYear()} Ashveil
      </p>
    </footer>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-transparent text-fg">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
