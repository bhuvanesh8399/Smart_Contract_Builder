import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition",
        {
          "bg-amber-400 text-slate-950 hover:bg-amber-300": variant === "primary",
          "bg-slate-800 text-white hover:bg-slate-700": variant === "secondary",
          "bg-transparent text-slate-300 hover:bg-white/5": variant === "ghost",
          "bg-red-500 text-white hover:bg-red-400": variant === "danger",
        },
        className
      )}
      {...props}
    />
  );
}
