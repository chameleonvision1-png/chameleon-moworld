"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowUpLeft, Link2, Menu, Moon, QrCode, Search, ShoppingBag, Sun, X } from "lucide-react";
import { buildOfficialHubChannels, type PublicSettings } from "@/lib/link-hub";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";
import { BrandLogo } from "./BrandLogo";
import { useCart } from "./CartProvider";
import { useTheme } from "./ThemeProvider";
import { QrModal } from "./QrModal";

interface HeaderProps {
  settings: PublicSettings;
}

const SLASH_NAV = [
  { href: "/shop?filter=new", labelEn: "NEW DROPS", shortEn: "NEW" },
  { href: "/shop?sub=MO+%2F+KIDS", labelEn: "MO / KIDS", shortEn: "KIDS" },
  { href: "/shop?sub=MO+%2F+ESSENTIALS", labelEn: "MO / ESSENTIALS", shortEn: "ESSENTIALS" },
  { href: "/shop?sub=MO+%2F+STUDIO", labelEn: "MO / STUDIO", shortEn: "STUDIO" },
  { href: "/shop?sub=MO+%2F+ARCHIVE", labelEn: "MO / ARCHIVE", shortEn: "ARCHIVE" },
];

const SITE_LINKS = [
  { href: "/", labelAr: "الرئيسية" },
  { href: "/shop", labelAr: "جميع التشكيلات" },
  { href: "/drops", labelAr: "الكبسولات والباكدجات" },
  { href: "/size-guide", labelAr: "دليل وحاسبة المقاسات" },
  { href: "/brand", labelAr: "الهوية البصرية والتغليف" },
  { href: "/about", labelAr: "قصة الدار" },
  { href: "/contact", labelAr: "الشحن وسياسة الاستبدال" },
];

export function Header({ settings }: HeaderProps) {
  const pathname = usePathname();
  const { totalCount, setBagOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [drawerState, setDrawerState] = React.useState<{
    open: boolean;
    forPath: string;
    view: "menu" | "hub";
  }>({
    open: false,
    forPath: pathname,
    view: "menu",
  });
  const [qrUrl, setQrUrl] = React.useState<string | null>(null);

  const drawerOpen = drawerState.open && drawerState.forPath === pathname;
  useLockBodyScroll(drawerOpen);

  const channels = React.useMemo(() => buildOfficialHubChannels(settings), [settings]);

  const openDrawer = (view: "menu" | "hub" = "menu") =>
    setDrawerState({ open: true, forPath: pathname, view });
  const closeDrawer = () =>
    setDrawerState((prev) => ({ ...prev, open: false, forPath: pathname }));

  return (
    <>
      {settings.announcementAr && (
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-center">
          <p className="mx-auto max-w-2xl truncate text-[11px] font-medium text-[var(--text-primary)] sm:text-xs">
            {settings.announcementAr}
          </p>
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
        {/* Main Header Bar */}
        <div
          dir="ltr"
          className="mx-auto flex h-15 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6 lg:px-8"
        >
          <Link
            href="/"
            aria-label="MO WORLD — الصفحة الرئيسية"
            className="inline-flex shrink-0 items-center py-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
          >
            <BrandLogo variant="full" className="h-7 w-auto sm:h-8.5" />
          </Link>

          <nav aria-label="خطوط MO WORLD" className="hidden items-center gap-6 lg:flex">
            {SLASH_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-en text-[11px] font-semibold tracking-[0.2em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              >
                {item.labelEn}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/shop"
              aria-label="البحث وتصفح المتجر"
              className="inline-flex size-9 items-center justify-center rounded-[4px] border border-transparent text-[var(--text-primary)] transition-colors hover:border-[var(--border-subtle)] hover:bg-[var(--bg-surface)]"
            >
              <Search className="size-[17px]" strokeWidth={1.5} />
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
              className="inline-flex size-9 items-center justify-center rounded-[4px] border border-transparent text-[var(--text-primary)] transition-colors hover:border-[var(--border-subtle)] hover:bg-[var(--bg-surface)]"
            >
              {theme === "dark" ? (
                <Sun className="size-[17px]" strokeWidth={1.5} />
              ) : (
                <Moon className="size-[17px]" strokeWidth={1.5} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setBagOpen(true)}
              aria-label={`حقيبة التسوق (${totalCount})`}
              className="relative inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)]"
            >
              <ShoppingBag className="size-4" strokeWidth={1.5} />
              <span className="font-en text-xs font-semibold">{totalCount}</span>
            </button>

            <button
              type="button"
              onClick={() => openDrawer("menu")}
              aria-label="فتح القائمة الجانبية"
              aria-expanded={drawerOpen}
              className="inline-flex size-9 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)]"
            >
              <Menu className="size-[18px]" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Symmetric Mobile/Tablet Collection Strip (Fits 100% cleanly on 1 line with zero clipping) */}
        <div
          dir="ltr"
          className="flex items-center justify-center gap-4 border-t border-[var(--border-subtle)] px-3 py-2 sm:gap-6 lg:hidden"
        >
          {SLASH_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-en text-[10px] font-semibold tracking-[0.16em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              <span className="sm:hidden">{item.shortEn}</span>
              <span className="hidden sm:inline">{item.labelEn}</span>
            </Link>
          ))}
        </div>
      </header>

      {/* Ultra-Minimal RTL Slide-Over Sidebar + Integrated Linktree Hub */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="القائمة الرئيسية"
          className="fixed inset-0 z-[60]"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={closeDrawer}
          />
          <aside
            dir="rtl"
            data-modal-scroll
            className="no-scrollbar animate-drawer-right fixed inset-y-0 right-0 z-10 flex w-[min(84vw,330px)] flex-col justify-between overflow-y-auto border-l border-[var(--border-subtle)] bg-[var(--bg-primary)] px-5 py-5"
          >
            <div>
              {/* Minimal Top Bar */}
              <div className="flex items-center justify-between pb-4">
                <Link href="/" onClick={closeDrawer} className="inline-flex items-center">
                  <BrandLogo variant="monogram" className="h-5 w-auto" />
                </Link>
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="إغلاق القائمة"
                  className="inline-flex size-8 items-center justify-center rounded-[4px] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                >
                  <X className="size-4" strokeWidth={1.5} />
                </button>
              </div>

              {/* Clean 2-Segment Toggle: القائمة | Link Hub */}
              <div className="grid grid-cols-2 gap-1 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1">
                <button
                  type="button"
                  onClick={() => setDrawerState((s) => ({ ...s, view: "menu" }))}
                  className={`h-8 rounded-[3px] text-xs font-semibold transition-colors ${
                    drawerState.view === "menu"
                      ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-2xs"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  تصفح المتجر
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerState((s) => ({ ...s, view: "hub" }))}
                  className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-[3px] text-xs font-semibold transition-colors ${
                    drawerState.view === "hub"
                      ? "bg-[var(--bg-primary)] text-[var(--brand-accent)] shadow-2xs"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Link2 className="size-3.5" strokeWidth={1.5} />
                  <span dir="ltr" className="font-en text-[11px] tracking-wider">
                    Link Hub
                  </span>
                </button>
              </div>

              {drawerState.view === "menu" ? (
                <>
                  {/* Symmetric 2x2 Minimal Sub-Brand Pills */}
                  <div className="mt-4 grid grid-cols-2 gap-1.5">
                    {SLASH_NAV.slice(1).map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={closeDrawer}
                        dir="ltr"
                        className="flex h-9 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]/70 px-2 font-en text-[10px] font-semibold tracking-[0.14em] text-[var(--text-primary)] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                      >
                        {sub.labelEn}
                      </Link>
                    ))}
                  </div>

                  {/* Clean Single-Language Minimal Navigation */}
                  <nav aria-label="روابط الموقع" className="mt-5 flex flex-col divide-y divide-[var(--border-subtle)]/70 border-t border-[var(--border-subtle)]/70">
                    {SITE_LINKS.map((link) => {
                      const active = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeDrawer}
                          className={`flex items-center justify-between py-2.5 text-[13px] transition-colors ${
                            active
                              ? "font-semibold text-[var(--brand-accent)]"
                              : "font-medium text-[var(--text-primary)] hover:text-[var(--brand-accent)]"
                          }`}
                        >
                          <span>{link.labelAr}</span>
                          <ArrowLeft
                            className={`size-3.5 transition-opacity ${
                              active ? "opacity-100" : "opacity-35"
                            }`}
                            strokeWidth={1.5}
                          />
                        </Link>
                      );
                    })}
                  </nav>
                </>
              ) : (
                /* Integrated Linktree-style MO Hub View */
                <div className="mt-5">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex size-13 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2">
                      <BrandLogo variant="icon" className="size-full" />
                    </div>
                    <p className="mt-2 text-xs font-bold text-[var(--text-primary)]">
                      القنوات والمجتمعات الرسمية
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                      تُفعّل الروابط تلقائياً فور إضافتها من الإدارة
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
                    {channels.map((ch) =>
                      ch.href ? (
                        <a
                          key={ch.id}
                          href={ch.href}
                          target={ch.external ? "_blank" : undefined}
                          rel={ch.external ? "noopener noreferrer" : undefined}
                          className="flex items-center justify-between gap-2 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2.5 transition-colors hover:border-[var(--brand-accent)]"
                        >
                          <div className="min-w-0 text-right">
                            <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
                              {ch.labelAr}
                            </p>
                            <p className="truncate text-[10px] text-[var(--text-muted)]">
                              {ch.subtitleAr}
                            </p>
                          </div>
                          <ArrowUpLeft className="size-3.5 shrink-0 text-[var(--brand-accent)]" strokeWidth={1.5} />
                        </a>
                      ) : (
                        <div
                          key={ch.id}
                          className="flex items-center justify-between gap-2 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 px-3 py-2.5"
                        >
                          <div className="min-w-0 text-right">
                            <p className="truncate text-xs font-medium text-[var(--text-primary)]">
                              {ch.labelAr}
                            </p>
                            <p className="truncate text-[10px] text-[var(--text-muted)]">
                              {ch.subtitleAr}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]">
                            قريباً
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Minimal Symmetric Bottom Action Row */}
            <div className="mt-6 border-t border-[var(--border-subtle)] pt-3.5">
              <div className="grid grid-cols-2 gap-2">
                {drawerState.view === "menu" ? (
                  <button
                    type="button"
                    onClick={() => setDrawerState((s) => ({ ...s, view: "hub" }))}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[4px] bg-[var(--brand-accent)] px-3 text-xs font-semibold text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)]"
                  >
                    <Link2 className="size-3.5" strokeWidth={1.5} />
                    <span>مركز الروابط</span>
                  </button>
                ) : (
                  <Link
                    href="/links"
                    onClick={closeDrawer}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[4px] bg-[var(--brand-accent)] px-3 text-xs font-semibold text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)]"
                  >
                    <Link2 className="size-3.5" strokeWidth={1.5} />
                    <span>صفحة Hub</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const target =
                      drawerState.view === "hub"
                        ? "https://moworld.chameleon.vision/links"
                        : "https://moworld.chameleon.vision";
                    closeDrawer();
                    setQrUrl(target);
                  }}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)]"
                >
                  <QrCode className="size-3.5" strokeWidth={1.5} />
                  <span>كود QR</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      <QrModal
        open={Boolean(qrUrl)}
        onClose={() => setQrUrl(null)}
        url={qrUrl || "https://moworld.chameleon.vision"}
      />
    </>
  );
}
