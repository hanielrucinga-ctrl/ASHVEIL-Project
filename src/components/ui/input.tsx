import type { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full bg-surface px-3 text-sm text-fg outline-none shadow-[0_0_0_1px_#111111] placeholder:text-muted focus:shadow-[0_0_0_2px_#111111]",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full bg-surface px-3 py-2 text-sm text-fg outline-none shadow-[0_0_0_1px_#111111] placeholder:text-muted focus:shadow-[0_0_0_2px_#111111]",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1 block text-[11px] uppercase tracking-[0.16em] text-fg", className)}
      {...props}
    />
  );
}
