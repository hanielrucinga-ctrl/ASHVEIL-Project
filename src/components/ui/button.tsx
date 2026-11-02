import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 min-h-11 px-5 text-xs uppercase tracking-[0.18em] rounded-full border transition-all duration-200 ease-out active:not-disabled:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        solid:
          "border-white/40 bg-[rgba(255,255,255,0.2)] text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_12px_30px_rgba(17,17,17,0.08)] backdrop-blur-xl hover:bg-[rgba(255,255,255,0.28)]",
        outline:
          "border-white/40 bg-[rgba(255,255,255,0.08)] text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_12px_28px_rgba(17,17,17,0.06)] backdrop-blur-xl hover:bg-[rgba(255,255,255,0.18)]",
        ghost: "border-transparent bg-transparent text-fg hover:underline underline-offset-4",
      },
    },
    defaultVariants: { variant: "solid" },
  },
);

export function Button({
  className,
  variant,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
