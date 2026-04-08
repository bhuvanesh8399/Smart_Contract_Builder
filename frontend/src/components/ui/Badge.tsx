import clsx from "clsx";

export function Badge({
  text,
  tone = "default",
}: {
  text: string;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  return (
    <span
      className={clsx("rounded-full px-3 py-1 text-xs font-medium", {
        "bg-slate-800 text-slate-300": tone === "default",
        "bg-emerald-500/15 text-emerald-300": tone === "success",
        "bg-amber-500/15 text-amber-300": tone === "warning",
        "bg-red-500/15 text-red-300": tone === "danger",
      })}
    >
      {text}
    </span>
  );
}
