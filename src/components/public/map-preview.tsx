import { cn } from "@/lib/utils";

export function MapPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-deep-navy shadow-soft",
        className,
      )}
      role="img"
      aria-label="Map preview placeholder showing a sample route"
    >
      <svg viewBox="0 0 640 360" className="h-full w-full min-h-[12rem]">
        <rect width="640" height="360" fill="#0f2744" />
        <path
          d="M0 80 H640 M0 160 H640 M0 240 H640 M0 300 H640 M80 0 V360 M200 0 V360 M360 0 V360 M480 0 V360 M560 0 V360"
          stroke="rgba(232,220,200,0.12)"
          strokeWidth="2"
        />
        <circle cx="160" cy="240" r="12" fill="#5c6b3a" />
        <circle cx="480" cy="120" r="12" fill="#e0783a" />
        <path
          d="M160 240 C260 200 360 200 480 120"
          stroke="#e0783a"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <text
          x="24"
          y="336"
          fill="rgba(247,243,235,0.65)"
          fontSize="14"
          fontFamily="system-ui, sans-serif"
        >
          Map preview · demo visual
        </text>
      </svg>
    </div>
  );
}
