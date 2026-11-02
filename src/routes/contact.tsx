import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { BRAND_EMAIL, BRAND_SITE } from "@/lib/brand";

export const Route = createFileRoute("/contact")({ component: Contact });

function Contact() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const topic = String(fd.get("topic") ?? "Ashveil");
    const message = String(fd.get("message") ?? "");
    const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
    window.location.href = `mailto:${BRAND_EMAIL}?subject=${encodeURIComponent(topic)}&body=${body}`;
    setSent(true);
    toast("Opening email");
  }

  return (
    <Shell>
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-14 md:grid-cols-2 md:px-8">
        <div className="rounded-[2rem] border border-white/40 bg-[rgba(255,255,255,0.12)] p-5 shadow-[0_20px_60px_rgba(17,17,17,0.08)] backdrop-blur-2xl md:p-8">
          <h1 className="text-2xl uppercase tracking-[0.24em]">Contact</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Orders, sizing, wholesale, custom prints, anything else. We read every message.
          </p>
          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Email</dt>
              <dd>
                <a className="underline underline-offset-4" href={`mailto:${BRAND_EMAIL}`}>
                  {BRAND_EMAIL}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">Site</dt>
              <dd>{BRAND_SITE}</dd>
            </div>
          </dl>
        </div>

        {sent ? (
          <div className="rounded-[2rem] border border-white/40 bg-[rgba(255,255,255,0.12)] p-5 text-sm uppercase tracking-[0.16em] shadow-[0_20px_60px_rgba(17,17,17,0.08)] backdrop-blur-2xl md:p-8">
            <p className="self-center">Message drafted to {BRAND_EMAIL}.</p>
          </div>
        ) : (
          <form
            className="space-y-4 rounded-[2rem] border border-white/40 bg-[rgba(255,255,255,0.12)] p-5 shadow-[0_20px_60px_rgba(17,17,17,0.08)] backdrop-blur-2xl md:p-8"
            onSubmit={onSubmit}
          >
            <div>
              <Label htmlFor="c-name">Name</Label>
              <Input id="c-name" required name="name" className="mt-2 rounded-full border-white/35 bg-[rgba(255,255,255,0.08)]" />
            </div>
            <div>
              <Label htmlFor="c-email">Email</Label>
              <Input id="c-email" type="email" required name="email" className="mt-2 rounded-full border-white/35 bg-[rgba(255,255,255,0.08)]" />
            </div>
            <div>
              <Label htmlFor="c-topic">Topic</Label>
              <Input id="c-topic" name="topic" placeholder="Order, sizing, wholesale…" className="mt-2 rounded-full border-white/35 bg-[rgba(255,255,255,0.08)]" />
            </div>
            <div>
              <Label htmlFor="c-msg">Message</Label>
              <Textarea id="c-msg" required name="message" className="mt-2 min-h-[120px] rounded-[1.25rem] border-white/35 bg-[rgba(255,255,255,0.08)]" />
            </div>
            <Button type="submit" className="w-full rounded-full">
              Send
            </Button>
          </form>
        )}
      </div>
    </Shell>
  );
}
