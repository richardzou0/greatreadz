import { StarSmall } from "./Icons";

/** Small uppercase section label, e.g. "CURRENTLY READING". */
export function Eyebrow({ children, className = "", as: Tag = "h2" }: { children: React.ReactNode; className?: string; as?: "h2" | "h3" | "p" }) {
  return <Tag className={`text-[12px] font-semibold uppercase tracking-[0.08em] text-muted ${className}`}>{children}</Tag>;
}

export function Rating({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <StarSmall className="text-accent" />
      {value}
    </span>
  );
}

/** Mobile-only page header row with the theme switch on the right. */
export function PageTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="font-serif text-[32px] font-medium tracking-[-0.01em] lg:text-[44px]">{children}</h1>
      {right}
    </div>
  );
}
