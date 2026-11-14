/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check, Ruler, ShieldCheck, ShoppingBag, Truck, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";

interface ProductQuickModalProps {
  product: Product | null;
  allProducts?: Product[];
  onSelectProduct?: (p: Product) => void;
  onClose: () => void;
}

export function ProductQuickModal({
  product,
  allProducts = [],
  onSelectProduct,
  onClose,
}: ProductQuickModalProps) {
  useLockBodyScroll(Boolean(product));

  const { addItem } = useCart();
  const [colorIdx, setColorIdx] = React.useState(0);
  const [sizeIdx, setSizeIdx] = React.useState(1);
  const [viewFace, setViewFace] = React.useState<"front" | "back">("front");
  const [fitOpen, setFitOpen] = React.useState(false);
  const [heightCm, setHeightCm] = React.useState("126");
  const [weightKg, setWeightKg] = React.useState("72");
  const [addedFlash, setAddedFlash] = React.useState(false);

  const prodId = product?.id;
  const [trackedId, setTrackedId] = React.useState(prodId);
  if (prodId !== trackedId) {
    setTrackedId(prodId);
    setColorIdx(0);
    setSizeIdx(Math.min(1, (product?.sizes.length ?? 1) - 1));
    setViewFace("front");
    setFitOpen(false);
    const firstLabel = product?.sizes[0]?.label ?? "";
    setHeightCm(firstLabel === "2" ? "98" : product?.ageGroup === "kids" ? "128" : "174");
  }

  if (!product) return null;

  const isComingSoon = Boolean(product.comingSoon);
  const activeColor = product.colors[colorIdx] ?? product.colors[0];
  const activeSize = product.sizes[sizeIdx] ?? product.sizes[0];
  const displayImg =
    viewFace === "back" && activeColor?.backImage
      ? activeColor.backImage
      : activeColor?.frontImage;

  const recommendedSize = (() => {
    const h = Number(heightCm) || 0;
    const w = Number(weightKg) || 0;
    const labels = product.sizes.map((s) => s.label);
    if (product.ageGroup === "kids") {
      if (labels.includes("2")) {
        if (h <= 94) return "2";
        if (h <= 100) return "3";
        if (h <= 106) return "4";
        return "5";
      }
      if (labels.includes("6")) {
        if (h <= 120) return "6";
        if (h <= 132) return "8";
        if (h <= 144) return "10";
        return "12";
      }
      if (h <= 112) return labels[0] ?? "6";
      if (h <= 125) return labels[1] ?? "8";
      if (h <= 138) return labels[2] ?? "10";
      return labels[labels.length - 1] ?? "12";
    }
    if (w < 64 && h < 173) return "S";
    if (w < 78 && h < 181) return "M";
    if (w < 92 && h < 188) return "L";
    return "XL";
  })();

  const related = (product.completeLookIds ?? [])
    .map((id) => allProducts.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const handleAdd = () => {
    if (!activeColor || !activeSize || isComingSoon) return;
    addItem(
      {
        productId: product.id,
        code: product.code,
        subBrand: product.subBrand,
        nameAr: product.nameAr,
        nameEn: product.nameEn,
        colorId: activeColor.id,
        colorNameAr: activeColor.nameAr,
        colorHex: activeColor.hex,
        sizeLabel: activeSize.label,
        unitPrice: product.price,
        qty: 1,
        image: activeColor.frontImage,
      },
      true,
    );
    setAddedFlash(true);
    window.setTimeout(() => {
      setAddedFlash(false);
      onClose();
    }, 350);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={product.nameAr}
      className="fixed inset-0 z-[62] flex items-center justify-center p-3 sm:p-6"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />

      <div
        dir="rtl"
        data-modal-scroll
        className="no-scrollbar relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق التفاصيل"
          className="absolute left-4 top-4 z-20 inline-flex size-9 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Studio Image Column */}
          <div className="flex flex-col border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 md:border-b-0 md:border-l">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-[var(--bg-surface)]">
              <img
                src={displayImg}
                alt={product.nameAr}
                className={`size-full object-contain ${isComingSoon ? "opacity-80" : ""}`}
              />
              <span
                dir="ltr"
                className="absolute right-3 top-3 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 px-2 py-0.5 font-en text-[10px] font-semibold tracking-wider text-[var(--text-primary)]"
              >
                {product.code}
              </span>

              {isComingSoon && (
                <div className="pointer-events-none absolute inset-x-6 top-1/2 -translate-y-1/2">
                  <div className="mx-auto max-w-xs rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/94 px-4 py-3.5 text-center shadow-lg backdrop-blur-sm">
                    <p dir="ltr" className="font-en text-xs font-bold tracking-[0.22em] text-[var(--text-primary)]">
                      COMING SOON
                    </p>
                    <p className="mt-1 text-xs font-medium text-[var(--text-muted)]">
                      قطعة عرض مسبقة — غير متاحة للطلب حالياً
                    </p>
                  </div>
                </div>
              )}
            </div>

            {activeColor?.backImage && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewFace("front")}
                  className={`rounded-[4px] border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    viewFace === "front"
                      ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-[#F6F5F2]"
                      : "border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-muted)]"
                  }`}
                >
                  الوجه الأمامي
                </button>
                <button
                  type="button"
                  onClick={() => setViewFace("back")}
                  className={`rounded-[4px] border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    viewFace === "back"
                      ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-[#F6F5F2]"
                      : "border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-muted)]"
                  }`}
                >
                  الظهر / التفاصيل
                </button>
              </div>
            )}
          </div>

          {/* Product Details & Sizing Column */}
          <div className="flex flex-col justify-between p-5 sm:p-7">
            <div>
              <div className="flex items-center gap-2">
                <span dir="ltr" className="font-en text-[11px] font-semibold tracking-[0.22em] text-[var(--brand-accent)]">
                  {product.subBrand}
                </span>
                <span className="text-[var(--border-subtle)]">|</span>
                <span dir="ltr" className="font-en text-[11px] font-medium text-[var(--text-muted)]">
                  {product.fitType} Fit
                </span>
              </div>

              <h2 className="mt-1.5 text-lg font-semibold text-[var(--text-primary)] sm:text-xl">
                {product.nameAr}
              </h2>
              <p dir="ltr" className="font-editorial text-right text-base text-[var(--text-muted)]">
                {product.nameEn}
              </p>

              {!isComingSoon && (
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-xl font-bold text-[var(--text-primary)]">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="text-sm text-[var(--text-muted)] line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                </div>
              )}

              <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">
                {product.descriptionAr}
              </p>

              <div dir="ltr" className="mt-3 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-right font-en text-[11px] text-[var(--text-primary)]">
                {product.fabricSpec}
              </div>

              {/* Color Selector */}
              <div className="mt-4">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  اللون: <span className="font-normal text-[var(--text-muted)]">{activeColor?.nameAr}</span>
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.colors.map((c, idx) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setColorIdx(idx);
                        setViewFace("front");
                      }}
                      className={`inline-flex items-center gap-2 rounded-[4px] border px-2.5 py-1.5 text-xs transition-colors ${
                        colorIdx === idx
                          ? "border-[var(--brand-accent)] bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)]"
                          : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--text-primary)]"
                      }`}
                    >
                      <span
                        className="size-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.nameAr}</span>
                    </button>
                  ))}
                </div>
              </div>

              {isComingSoon ? (
                /* Floating Lock Board inside Modal for Youth Preview Items */
                <div className="mt-5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 text-center">
                  <p dir="ltr" className="font-en text-xs font-bold tracking-[0.22em] text-[var(--brand-accent)]">
                    OPENING SOON // {product.subBrand}
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-[var(--text-primary)]">
                    هذا القسم يُفتتح قريباً
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                    خطوط الشباب والأساسيات معروضة للمعاينة فقط حالياً وغير متاحة للشراء — يمكنك الطلب الفوري من قسم أزياء الأطفال المفتوح الآن.
                  </p>
                </div>
              ) : (
                /* Size Selector + Smart Fit Finder */
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      المقاس المطلوب
                    </span>
                    <button
                      type="button"
                      onClick={() => setFitOpen((v) => !v)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[var(--brand-accent)] hover:underline"
                    >
                      <Ruler className="size-3.5" strokeWidth={1.5} />
                      <span>اعرف مقاسك بالسم</span>
                    </button>
                  </div>

                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {product.sizes.map((s, idx) => {
                      const out = s.stock <= 0;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          disabled={out}
                          onClick={() => setSizeIdx(idx)}
                          className={`rounded-[4px] border py-2 font-en text-xs font-semibold transition-colors ${
                            out
                              ? "cursor-not-allowed border-[var(--border-subtle)] opacity-40 line-through"
                              : sizeIdx === idx
                                ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-[#F6F5F2]"
                                : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--text-primary)]"
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>

                  {activeSize && (activeSize.chestCm || activeSize.ageHint) && (
                    <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">
                      قياسات مقاس <span className="font-en font-semibold text-[var(--text-primary)]">{activeSize.label}</span>:{" "}
                      {activeSize.chestCm ? `عرض الصدر ${activeSize.chestCm} سم` : ""}{" "}
                      {activeSize.lengthCm ? `• الطول ${activeSize.lengthCm} سم` : ""}{" "}
                      {activeSize.ageHint ? `(${activeSize.ageHint})` : ""}
                    </p>
                  )}

                  {fitOpen && (
                    <div className="mt-3 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 text-xs">
                      <p className="font-semibold text-[var(--text-primary)]">
                        حاسبة المقاس السريعة ({product.ageGroup === "kids" ? "حسب طول الطفل" : "الطول والوزن"})
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <label className="flex flex-col gap-1">
                          <span className="text-[11px] text-[var(--text-muted)]">الطول (سم)</span>
                          <input
                            type="number"
                            value={heightCm}
                            onChange={(e) => setHeightCm(e.target.value)}
                            className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1.5 font-en text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-accent)]"
                          />
                        </label>
                        {product.ageGroup !== "kids" && (
                          <label className="flex flex-col gap-1">
                            <span className="text-[11px] text-[var(--text-muted)]">الوزن (كجم)</span>
                            <input
                              type="number"
                              value={weightKg}
                              onChange={(e) => setWeightKg(e.target.value)}
                              className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1.5 font-en text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-accent)]"
                            />
                          </label>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between pt-1">
                        <span className="text-[var(--text-muted)]">
                          المقاس المقترح:{" "}
                          <strong className="font-en text-[var(--brand-accent)]">{recommendedSize}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const found = product.sizes.findIndex((s) => s.label === recommendedSize);
                            if (found >= 0) setSizeIdx(found);
                          }}
                          className="rounded-[4px] border border-[var(--brand-accent)] px-2 py-1 text-[11px] font-semibold text-[var(--brand-accent)] hover:bg-[var(--brand-accent)] hover:text-[#F6F5F2]"
                        >
                          اختيار {recommendedSize}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {isComingSoon ? (
                <Link
                  href="/shop?sub=MO+%2F+KIDS"
                  onClick={onClose}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-5 py-3.5 text-xs font-semibold text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)]"
                >
                  <span>تصفح تشكيلة الأطفال المتاحة الآن</span>
                  <ArrowLeft className="size-4" strokeWidth={1.5} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-5 py-3.5 text-xs font-semibold text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)]"
                >
                  {addedFlash ? (
                    <>
                      <Check className="size-4" strokeWidth={1.5} />
                      <span>تمت الإضافة إلى الحقيبة</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="size-4" strokeWidth={1.5} />
                      <span>أضف إلى الحقيبة — {formatPrice(product.price)}</span>
                    </>
                  )}
                </button>
              )}

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--text-muted)]">
                <div className="flex items-center gap-1.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-2">
                  <Truck className="size-3.5 shrink-0 text-[var(--brand-accent)]" strokeWidth={1.5} />
                  <span>توصيل ٢–٤ أيام ومعاينة</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-2">
                  <ShieldCheck className="size-3.5 shrink-0 text-[var(--brand-accent)]" strokeWidth={1.5} />
                  <span>استبدال خلال ١٤ يوماً</span>
                </div>
              </div>

              {related.length > 0 && onSelectProduct && (
                <div className="border-t border-[var(--border-subtle)] pt-3">
                  <p className="text-[11px] font-semibold text-[var(--text-primary)]">
                    أطقم أطفال مقترحة
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {related.slice(0, 2).map((rel) => (
                      <button
                        key={rel.id}
                        type="button"
                        onClick={() => onSelectProduct(rel)}
                        className="flex items-center gap-2 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 text-right transition-colors hover:border-[var(--brand-accent)]"
                      >
                        <img
                          src={rel.colors[0]?.frontImage}
                          alt={rel.nameAr}
                          className="aspect-[4/5] w-10 shrink-0 rounded-[2px] object-contain"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-semibold text-[var(--text-primary)]">
                            {rel.nameAr}
                          </p>
                          <p className="text-[10px] text-[var(--brand-accent)]">
                            {rel.comingSoon ? "قريباً" : formatPrice(rel.price)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
