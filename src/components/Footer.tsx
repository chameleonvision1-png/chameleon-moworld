/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpLeft, ChevronDown, Link2 } from "lucide-react";
import { buildOfficialHubChannels, type PublicSettings } from "@/lib/link-hub";
import { BrandLogo } from "./BrandLogo";

type MenuKey = "collections" | "guide" | "hub";

const COLLECTION_ITEMS = [
  { href: "/shop?sub=MO+%2F+KIDS", labelAr: "أزياء الأطفال", badgeEn: "KIDS" },
  { href: "/shop?sub=MO+%2F+ESSENTIALS", labelAr: "الأساسيات الثقيلة", badgeEn: "ESSENTIALS" },
  { href: "/shop?sub=MO+%2F+STUDIO", labelAr: "إصدارات الاستوديو", badgeEn: "STUDIO" },
  { href: "/shop?sub=MO+%2F+ARCHIVE", labelAr: "إصدارات الأرشيف", badgeEn: "ARCHIVE" },
];

const GUIDE_ITEMS = [
  { href: "/drops", labelAr: "الكبسولات والباكدجات" },
  { href: "/size-guide", labelAr: "حاسبة وجدول المقاسات" },
  { href: "/brand", labelAr: "الهوية البصرية والتغليف" },
  { href: "/contact", labelAr: "الشحن وسياسة ١٤ يوماً" },
];

const MENUS: Array<{ key: MenuKey; titleAr: string }> = [
  { key: "collections", titleAr: "أقسام وتشكيلات الدار" },
  { key: "guide", titleAr: "دليل المتجر والسياسات" },
  { key: "hub", titleAr: "القنوات والروابط الرسمية" },
];

export function Footer({ settings }: { settings: PublicSettings }) {
  const [openKey, setOpenKey] = React.useState<MenuKey | null>(null);
  const channels = React.useMemo(() => buildOfficialHubChannels(settings), [settings]);

  const toggle = (key: MenuKey) => setOpenKey((prev) => (prev === key ? null : key));

  const renderMenuContent = (key: MenuKey) => {
    if (key === "collections") {
      return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {COLLECTION_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpenKey(null)}
              className="flex flex-col items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2.5 text-center transition-colors hover:border-[var(--brand-accent)]"
            >
              <span dir="ltr" className="font-en text-[10px] font-bold tracking-[0.16em] text-[var(--brand-accent)]">
                {item.badgeEn}
              </span>
              <span className="mt-0.5 text-xs font-medium text-[var(--text-primary)]">
                {item.labelAr}
              </span>
            </Link>
          ))}
        </div>
      );
    }

    if (key === "guide") {
      return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {GUIDE_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpenKey(null)}
              className="flex items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2.5 text-center text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
            >
              {item.labelAr}
            </Link>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {channels.slice(0, 4).map((ch) =>
            ch.href ? (
              <a
                key={ch.id}
                href={ch.href}
                target={ch.external ? "_blank" : undefined}
                rel={ch.external ? "noopener noreferrer" : undefined}
                className="flex items-center justify-between gap-1.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--brand-accent)]"
              >
                <span className="truncate">{ch.labelAr}</span>
                <ArrowUpLeft className="size-3.5 shrink-0 text-[var(--brand-accent)]" strokeWidth={1.5} />
              </a>
            ) : (
              <div
                key={ch.id}
                className="flex items-center justify-between gap-1.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]/55 px-3 py-2 text-xs text-[var(--text-muted)]"
              >
                <span className="truncate">{ch.labelAr}</span>
                <span className="shrink-0 text-[10px] opacity-80">قريباً</span>
              </div>
            ),
          )}
        </div>
        <div className="flex justify-center">
          <Link
            href="/links"
            onClick={() => setOpenKey(null)}
            className="inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-semibold text-[var(--brand-accent)] transition-colors hover:border-[var(--brand-accent)]"
          >
            <Link2 className="size-3.5" strokeWidth={1.5} />
            <span>فتح مركز الروابط الكامل (Link Hub)</span>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)]">
      <div className="mx-auto max-w-5xl px-4 py-9 sm:px-6 sm:py-11">
        {/* 1. Centered Symmetric Brand Block */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" aria-label="MO WORLD">
            <BrandLogo variant="full" className="h-8 w-auto sm:h-9" />
          </Link>
          <p className="mt-2.5 max-w-md text-xs leading-relaxed text-[var(--text-muted)]">
            دار أزياء عصرية للأطفال والشباب — قطن مصري ثقيل بتصميم معماري هادئ.
          </p>
        </div>

        {/* 2. Minimal Symmetric Dropdown Menus (Mobile Accordion / Desktop 3-Pill Bar) */}
        <div className="mx-auto mt-6 max-w-2xl">
          {/* Mobile Symmetric Stacked Dropdowns */}
          <div className="divide-y divide-[var(--border-subtle)] overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] sm:hidden">
            {MENUS.map((m) => {
              const isOpen = openKey === m.key;
              return (
                <div key={m.key}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggle(m.key)}
                    className="grid w-full grid-cols-[16px_1fr_16px] items-center px-4 py-3 text-center text-xs font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--brand-accent)]"
                  >
                    <span aria-hidden="true" />
                    <span>{m.titleAr}</span>
                    <ChevronDown
                      className={`size-4 text-[var(--text-muted)] transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[var(--brand-accent)]" : ""
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-[var(--border-subtle)] px-3 py-3">
                      {renderMenuContent(m.key)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Symmetric 3-Button Dropdown Row */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-3 gap-2">
              {MENUS.map((m) => {
                const isOpen = openKey === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggle(m.key)}
                    className={`inline-flex h-10 items-center justify-center gap-2 rounded-[4px] border px-3 text-xs font-semibold transition-colors ${
                      isOpen
                        ? "border-[var(--brand-accent)] bg-[var(--bg-primary)] text-[var(--brand-accent)]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--text-primary)]"
                    }`}
                  >
                    <span>{m.titleAr}</span>
                    <ChevronDown
                      className={`size-3.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : "text-[var(--text-muted)]"
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>
                );
              })}
            </div>
            {openKey && (
              <div className="mt-2 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3.5">
                {renderMenuContent(openKey)}
              </div>
            )}
          </div>
        </div>

        {/* 3. Symmetric Bottom Bar + Official Full Powered by Chameleon Badge */}
        <div className="mt-7 flex flex-col items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-5 text-center text-xs text-[var(--text-muted)] sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span>جميع الحقوق محفوظة</span>
            <span dir="ltr" className="font-en font-medium text-[var(--text-primary)]">
              © {new Date().getFullYear()} MO WORLD
            </span>
            <span className="opacity-40">•</span>
            <Link
              href="/admin"
              className="font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--brand-accent)]"
            >
              لوحة الإدارة
            </Link>
          </div>

          <a
            href="https://chameleon.vision/"
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 py-1.5 whitespace-nowrap transition-colors hover:border-[var(--brand-accent)]"
          >
            <span className="font-en text-[11px] font-semibold tracking-wide text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-primary)]">
              Powered by
            </span>
            <img
              src="/chameleon-logo.webp"
              alt="Chameleon"
              className="h-4 w-auto shrink-0 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-en text-xs font-black tracking-wider text-[var(--brand-accent)]">
              Chameleon
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
