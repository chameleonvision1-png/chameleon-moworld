"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpLeft, Check, Copy, QrCode, Ruler, ShoppingBag, Sparkles } from "lucide-react";
import { buildOfficialHubChannels, type PublicSettings } from "@/lib/link-hub";
import { BrandLogo } from "./BrandLogo";
import { QrModal } from "./QrModal";

const STORE_SHORTCUTS = [
  {
    href: "/shop",
    labelAr: "تسوق التشكيلة الكاملة",
    subtitleAr: "أزياء الأطفال • الأساسيات • الاستوديو",
    icon: ShoppingBag,
  },
  {
    href: "/drops",
    labelAr: "الكبسولات والأطقم المجمعة",
    subtitleAr: "إطلالات كاملة منسقة بسعر باكدج",
    icon: Sparkles,
  },
  {
    href: "/size-guide",
    labelAr: "حاسبة المقاسات بالسم",
    subtitleAr: "اعرف مقاسك الدقيق قبل الطلب",
    icon: Ruler,
  },
];

export function LinkHubClient({ settings }: { settings: PublicSettings }) {
  const [qrOpen, setQrOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const hubUrl = "https://moworld.chameleon.vision/links";
  const channels = React.useMemo(() => buildOfficialHubChannels(settings), [settings]);

  const copyHubLink = async () => {
    try {
      await navigator.clipboard.writeText(hubUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
      {/* Profile Header (Linktree-style Architectural Seal) */}
      <div className="flex flex-col items-center text-center">
        <div className="flex size-20 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
          <BrandLogo variant="icon" className="size-full" />
        </div>

        <p dir="ltr" className="mt-4 font-en text-[11px] font-semibold tracking-[0.26em] text-[var(--brand-accent)]">
          @MOWORLD // LINK HUB
        </p>
        <h1 className="mt-1 text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
          الروابط والقنوات الرسمية
        </h1>
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-[var(--text-muted)]">
          تصفح المتجر الرسمي وتابع قنوات ومجتمعات الدار فور تفعيلها.
        </p>

        {/* Side-by-side Share & QR Actions */}
        <div className="mt-4 grid w-full max-w-[280px] grid-cols-2 gap-2">
          <button
            type="button"
            onClick={copyHubLink}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)]"
          >
            {copied ? <Check className="size-3.5 text-[var(--brand-accent)]" strokeWidth={1.75} /> : <Copy className="size-3.5" strokeWidth={1.5} />}
            <span>{copied ? "تم النسخ" : "نسخ الرابط"}</span>
          </button>
          <button
            type="button"
            onClick={() => setQrOpen(true)}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)]"
          >
            <QrCode className="size-3.5" strokeWidth={1.5} />
            <span>كود QR</span>
          </button>
        </div>
      </div>

      {/* Primary Storefront Links */}
      <div className="mt-8 space-y-2.5">
        <p className="text-center text-[11px] font-semibold text-[var(--text-muted)]">
          المتجر الإلكتروني المباشر
        </p>
        {STORE_SHORTCUTS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between gap-3 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3.5 transition-colors hover:border-[var(--brand-accent)]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--brand-accent)]">
                  <Icon className="size-4" strokeWidth={1.5} />
                </span>
                <div className="min-w-0 text-right">
                  <p className="truncate text-xs font-bold text-[var(--text-primary)]">
                    {item.labelAr}
                  </p>
                  <p className="truncate text-[11px] text-[var(--text-muted)]">
                    {item.subtitleAr}
                  </p>
                </div>
              </div>
              <ArrowUpLeft
                className="size-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--brand-accent)]"
                strokeWidth={1.5}
              />
            </Link>
          );
        })}
      </div>

      {/* Official Socials, Groups & Direct Channels */}
      <div className="mt-7 space-y-2.5">
        <p className="text-center text-[11px] font-semibold text-[var(--text-muted)]">
          السوشيال ميديا والمجتمعات الرسمية
        </p>
        {channels.map((ch) =>
          ch.href ? (
            <a
              key={ch.id}
              href={ch.href}
              target={ch.external ? "_blank" : undefined}
              rel={ch.external ? "noopener noreferrer" : undefined}
              className="group flex items-center justify-between gap-3 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 transition-colors hover:border-[var(--brand-accent)]"
            >
              <div className="min-w-0 text-right">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--text-primary)]">{ch.labelAr}</span>
                  <span dir="ltr" className="font-en text-[10px] font-semibold tracking-[0.14em] text-[var(--brand-accent)]">
                    {ch.labelEn}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-[var(--text-muted)]">
                  {ch.subtitleAr}
                </p>
              </div>
              <ArrowUpLeft
                className="size-4 shrink-0 text-[var(--text-muted)] transition-colors group-hover:text-[var(--brand-accent)]"
                strokeWidth={1.5}
              />
            </a>
          ) : (
            <div
              key={ch.id}
              className="flex items-center justify-between gap-3 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]/55 px-4 py-3 opacity-80"
            >
              <div className="min-w-0 text-right">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">{ch.labelAr}</span>
                  <span dir="ltr" className="font-en text-[10px] tracking-[0.14em] text-[var(--text-muted)]">
                    {ch.labelEn}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-[var(--text-muted)]">
                  {ch.subtitleAr}
                </p>
              </div>
              <span className="shrink-0 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                قريباً
              </span>
            </div>
          ),
        )}
      </div>

      <QrModal open={qrOpen} onClose={() => setQrOpen(false)} url={hubUrl} />
    </div>
  );
}
