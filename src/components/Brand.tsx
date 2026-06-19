import { ARROW_POINTS } from "@/lib/tools";

const arrowD =
  "M" + ARROW_POINTS.map(([x, y]) => `${x} ${y}`).join("L") + "Z";

export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={arrowD}
        stroke="currentColor"
        strokeWidth={7}
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Wordmark({ size = 26 }: { size?: number }) {
  return (
    <span className="brand" style={{ pointerEvents: "none" }}>
      <Logo size={size} />
      <span>
        Wayfinder <span className="os">OS</span>
      </span>
    </span>
  );
}

export function ToolIcon({ svg, size = 22 }: { svg: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
