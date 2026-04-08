import { HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
