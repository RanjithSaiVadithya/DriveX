import { cn } from "@/lib/utils";

export function MapPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-[#e9eee9] shadow-soft",
        className,
      )}
      role="img"
      aria-label="Map preview placeholder showing a sample route"
    >
      <svg viewBox="0 0 640 360" className="h-full w-full min-h-[12rem]">
        <rect width="640" height="360" fill="#e9eee9" />
        <path
          d="M0 80 H640 M0 160 H640 M0 240 H640 M0 300 H640 M80 0 V360 M200 0 V360 M360 0 V360 M480 0 V360 M560 0 V360"
          stroke="rgba(18,26,31,0.08)"
          strokeWidth="2"
        />
        <path
          d="M40 280 C140 240 220 200 300 180 S460 140 600 100"
          stroke="#2d5a27"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="160" cy="250" r="12" fill="#2d5a27" />
        <circle cx="160" cy="250" r="5" fill="#ffffff" />
        <circle cx="480" cy="130" r="12" fill="#121a1f" />
        <circle cx="480" cy="130" r="5" fill="#ffffff" />
        <text
          x="24"
          y="336"
          fill="rgba(18,26,31,0.45)"
          fontSize="14"
          fontFamily="system-ui, sans-serif"
        >
          Map preview · demo visual
        </text>
      </svg>
    </div>
  );
}
