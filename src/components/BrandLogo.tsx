/* eslint-disable @next/next/no-img-element */
import * as React from "react";

export type LogoVariant = "horizontal" | "stacked" | "wordmark" | "icon" | "monogram";

interface BrandLogoProps {
  variant?: LogoVariant;
  /** Force light (#F6F5F2) or dark (#0E1012) ink regardless of UI theme (e.g. on solid #0E1012 or #1F5668 banners). */
  tone?: "auto" | "light-ink" | "dark-ink";
  className?: string;
  alt?: string;
}

const SOURCES: Record<LogoVariant, { darkInk: string; lightInk: string; aspect: string }> = {
  horizontal: {
    darkInk: "/logo-horizontal.svg",
    lightInk: "/logo-horizontal-light.svg",
    aspect: "aspect-[480/96]",
  },
  stacked: {
    darkInk: "/logo-stacked.svg",
    lightInk: "/logo-stacked-light.svg",
    aspect: "aspect-[380/280]",
  },
  wordmark: {
    darkInk: "/logo-wordmark.svg",
    lightInk: "/logo-wordmark-light.svg",
    aspect: "aspect-[480/92]",
  },
  icon: {
    darkInk: "/logo-icon.svg",
    lightInk: "/logo-icon-light.svg",
    aspect: "aspect-square",
  },
  monogram: {
    darkInk: "/logo-monogram.svg",
    lightInk: "/logo-monogram-light.svg",
    aspect: "aspect-[260/150]",
  },
};

export function BrandLogo({
  variant = "horizontal",
  tone = "auto",
  className = "h-8 w-auto",
  alt = "MO WORLD",
}: BrandLogoProps) {
  const spec = SOURCES[variant];

  if (tone === "light-ink") {
    return (
      <img
        src={spec.lightInk}
        alt={alt}
        draggable={false}
        className={`min-w-[48px] select-none object-contain ${className}`}
      />
    );
  }

  if (tone === "dark-ink") {
    return (
      <img
        src={spec.darkInk}
        alt={alt}
        draggable={false}
        className={`min-w-[48px] select-none object-contain ${className}`}
      />
    );
  }

  return (
    <span className="inline-flex items-center">
      <img
        src={spec.darkInk}
        alt={alt}
        draggable={false}
        className={`show-in-light min-w-[48px] select-none object-contain ${className}`}
      />
      <img
        src={spec.lightInk}
        alt={alt}
        draggable={false}
        className={`show-in-dark min-w-[48px] select-none object-contain ${className}`}
      />
    </span>
  );
}
