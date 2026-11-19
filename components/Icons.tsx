// Line icons traced from the design files (24×24 grid, 1.8 stroke).
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: IconProps) => (
  <Icon {...p}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></Icon>
);
export const CompassIcon = (p: IconProps) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></Icon>
);
export const BooksIcon = (p: IconProps) => (
  <Icon {...p}><path d="M5 4h3v16H5zM10 4h3v16h-3zM15.2 5.1l2.9-.8 4 15.4-2.9.8z" /></Icon>
);
export const SearchIcon = (p: IconProps) => (
  <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Icon>
);
export const ScanIcon = (p: IconProps) => (
  <Icon {...p}><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 8v8M10 8v8M13 8v8M16 8v8" /></Icon>
);
export const PeopleIcon = (p: IconProps) => (
  <Icon {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" /></Icon>
);
export const ListIcon = (p: IconProps) => (
  <Icon {...p}><path d="M8 6h12M8 12h12M8 18h12" /><circle cx="4" cy="6" r=".6" /><circle cx="4" cy="12" r=".6" /><circle cx="4" cy="18" r=".6" /></Icon>
);
export const FlagIcon = (p: IconProps) => (
  <Icon {...p}><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></Icon>
);
export const BadgeIcon = (p: IconProps) => (
  <Icon {...p}><path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 14L7 22l5-3 5 3-1.5-8" /></Icon>
);
export const SyncIcon = (p: IconProps) => (
  <Icon {...p}><path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3M18 3v4h-4M6 21v-4h4" /></Icon>
);
export const BackIcon = (p: IconProps) => (
  <Icon {...p}><path d="M15 5l-7 7 7 7" /></Icon>
);
export const ChevronRightIcon = (p: IconProps) => (
  <Icon {...p}><path d="M9 5l7 7-7 7" /></Icon>
);
export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}><path d="M6 9l6 6 6-6" /></Icon>
);
export const ShareIcon = (p: IconProps) => (
  <Icon {...p}><path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></Icon>
);
export const CoversIcon = (p: IconProps) => (
  <Icon {...p}><rect x="4" y="3" width="7" height="10" rx="1" /><rect x="13" y="3" width="7" height="10" rx="1" /><path d="M4 17h7M13 17h7M4 21h7M13 21h7" /></Icon>
);
export const PlusIcon = (p: IconProps) => (
  <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>
);
export const CheckIcon = (p: IconProps) => (
  <Icon {...p}><path d="M5 12l4 4 10-10" /></Icon>
);
export const CloseIcon = (p: IconProps) => (
  <Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>
);
export const SunIcon = (p: IconProps) => (
  <Icon {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Icon>
);
export const MoonIcon = (p: IconProps) => (
  <Icon {...p}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></Icon>
);

const STAR = "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z";

export function StarSmall({ size = 13, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d={STAR} fill="currentColor" />
    </svg>
  );
}

/** A star filled from the left by `fill` (0–1). Used for quarter-star ratings. */
export function StarFill({ fill, size = 52, id }: { fill: number; size?: number; id: string }) {
  const pct = Math.max(0, Math.min(1, fill)) * 100;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="overflow-visible">
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" height="24" width={(24 * pct) / 100} style={{ transition: "width 0.25s ease" }} />
        </clipPath>
      </defs>
      <path d={STAR} fill="none" stroke="var(--star-empty)" strokeWidth="1.4" strokeLinejoin="round" />
      <path d={STAR} fill="var(--accent)" stroke="var(--accent)" strokeWidth="1.4" strokeLinejoin="round" clipPath={`url(#${id})`} />
    </svg>
  );
}
