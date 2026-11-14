/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import type { DropBundle, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";

const KIDS_BUNDLE_SIZES = ["6", "8", "10", "12"];
const ADULT_BUNDLE_SIZES = ["S", "M", "L", "XL"];

export function DropCard({
  drop,
  products = [],
}: {
  drop: DropBundle;
  products?: Product[];
}) {
  const { addItem } = useCart();
  const isComingSoon = Boolean(drop.comingSoon);
  const isKids = drop.subBrand === "MO / KIDS";
  const sizes = isKids ? KIDS_BUNDLE_SIZES : ADULT_BUNDLE_SIZES;
  const [selectedSize, setSelectedSize] = React.useState(sizes[1] ?? sizes[0]);
  const [added, setAdded] = React.useState(false);

  const includedPieces = (drop.includedProductIds ?? [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const savings =
    drop.oldPrice && drop.oldPrice > drop.price ? drop.oldPrice - drop.price : 0;

  const handleAddBundle = () => {
    if (isComingSoon) return;
    addItem(
      {
        productId: drop.id,
        dropId: drop.id,
        code: drop.code,
        subBrand: drop.subBrand,
        nameAr: drop.titleAr,
        nameEn: drop.titleEn,
        colorId: "bundle",
        colorNameAr: "باكدج كاملة",
        colorHex: "#1F5668",
        sizeLabel: selectedSize,
        unitPrice: drop.price,
        qty: 1,
        image: drop.image,
      },
      true,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="flex flex-col justify-between overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div>
        <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]">
          <img
            src={drop.image}
            alt={drop.titleAr}
            loading="lazy"
            className={`size-full object-contain ${isComingSoon ? "opacity-60 blur-[1px]" : ""}`}
          />
          <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
            <span
              dir="ltr"
              className={`rounded-[4px] px-2.5 py-1 font-en text-[10px] font-semibold tracking-[0.18em] ${
                isComingSoon
                  ? "border border-[var(--border-subtle)] bg-[var(--bg-primary)]/92 text-[var(--text-primary)]"
                  : "bg-[var(--brand-accent)] text-[#F6F5F2]"
              }`}
            >
              {isComingSoon ? "OPENING SOON" : drop.badgeEn}
            </span>
            <span
              dir="ltr"
              className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 px-2 py-0.5 font-en text-[10px] font-medium tracking-wider text-[var(--text-primary)]"
            >
              {drop.code}
            </span>
          </div>

          {isComingSoon && (
            <div className="pointer-events-none absolute inset-x-5 top-1/2 -translate-y-1/2">
              <div className="mx-auto max-w-xs rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/94 px-4 py-4 text-center shadow-lg backdrop-blur-md">
                <p
                  dir="ltr"
                  className="font-en text-xs font-bold tracking-[0.22em] text-[var(--text-primary)]"
                >
                  COMING SOON
                </p>
                <p className="mt-1 text-xs font-semibold text-[var(--text-primary)]">
                  باكدج الشباب تُفتتح قريباً
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                  معروضة للمعاينة المسبقة فقط
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-5">
          <p
            dir="ltr"
            className="text-right font-en text-[10px] font-semibold tracking-[0.2em] text-[var(--brand-accent)]"
          >
            {drop.subBrand}
          </p>
          <h3 className="mt-1.5 text-base font-semibold text-[var(--text-primary)]">
            {drop.titleAr}
          </h3>
          <p dir="ltr" className="mt-0.5 text-right font-editorial text-sm text-[var(--text-muted)]">
            {drop.titleEn}
          </p>
          <p className="mt-2.5 text-xs leading-relaxed text-[var(--text-muted)]">
            {drop.descriptionAr}
          </p>

          {includedPieces.length > 0 && (
            <div className="mt-3.5 border-t border-[var(--border-subtle)] pt-3">
              <p className="text-[11px] font-semibold text-[var(--text-primary)]">
                القطع المشمولة في الباكدج:
              </p>
              <ul className="mt-1.5 space-y-1 text-[11px] text-[var(--text-muted)]">
                {includedPieces.map((piece) => (
                  <li key={piece.id} className="flex items-center justify-between gap-2">
                    <span className="truncate">{piece.nameAr}</span>
                    <span dir="ltr" className="shrink-0 font-en text-[10px] text-[var(--text-muted)]">
                      {piece.code}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-5">
        {isComingSoon ? (
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold text-[var(--text-muted)]">
              قسم الشباب قيد الافتتاح — غير متاح للطلب حالياً
            </p>
            <Link
              href="/shop?sub=MO+%2F+KIDS"
              className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
            >
              <span>تسوق باكدجات وأطقم الأطفال المتاحة</span>
              <ArrowLeft className="size-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-[var(--text-primary)]">
                  {formatPrice(drop.price)}
                </span>
                {drop.oldPrice && drop.oldPrice > drop.price && (
                  <span className="text-xs text-[var(--text-muted)] line-through">
                    {formatPrice(drop.oldPrice)}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <span className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-0.5 text-[11px] font-medium text-[var(--brand-accent)]">
                  وفّر {formatPrice(savings)}
                </span>
              )}
            </div>

            <div className="mt-3">
              <span className="text-[11px] font-medium text-[var(--text-muted)]">
                اختر المقاس الموحد للباكدج:
              </span>
              <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`rounded-[4px] border py-1.5 font-en text-xs font-semibold transition-colors ${
                      selectedSize === sz
                        ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-[#F6F5F2]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--text-primary)]"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddBundle}
              className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-4 py-3 text-xs font-semibold text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)]"
            >
              {added ? (
                <>
                  <Check className="size-4" strokeWidth={1.5} />
                  <span>تمت إضافة الباكدج إلى الحقيبة</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="size-4" strokeWidth={1.5} />
                  <span>أضف الباكدج — مقاس {selectedSize}</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </article>
  );
}
