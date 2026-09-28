import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

type DevPilotIconProps = SVGProps<SVGSVGElement> & {
  variant?: "color" | "mono";
};

export function DevPilotIcon({
  className,
  variant = "color",
  ...props
}: DevPilotIconProps) {
  const mono = variant === "mono";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      {...props}
    >
      <rect
        width="64"
        height="64"
        rx="16"
        fill={mono ? "currentColor" : "url(#devpilot-gradient)"}
      />
      <path
        d="M20 22L34 32L20 42"
        stroke={mono ? "#000" : "#ffffff"}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 42H44"
        stroke={mono ? "#000" : "#ffffff"}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {!mono && (
        <defs>
          <linearGradient
            id="devpilot-gradient"
            x1="0"
            y1="0"
            x2="64"
            y2="64"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
}