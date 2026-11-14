/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { Check, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";

interface ProductCardProps {
  product: Product;
  onInspect: (product: Product) => void;
  compact?: boolean;
}

export function ProductCard({ product, onInspect, compact = false }: ProductCardProps) {
  const { addItem } = useCart();
  const [colorIdx, setColorIdx] = React.useState(0);
  const [quickSizesOpen, setQuickSizesOpen] = React.useState(false);
  const [justAdded, setJustAdded] = React.useState<string | null>(null);

  const isComingSoon = Boolean(product.comingSoon);
  const color = product.colors[colorIdx] ?? product.colors[0];

  const handleQuickSize = (e: React.MouseEvent, sizeLabel: string) => {
    e.stopPropagation();
    if (!color || isComingSoon) return;
    addItem(
      {
        productId: product.id,
        code: product.code,
        subBrand: product.subBrand,
        nameAr: product.nameAr,
        nameEn: product.nameEn,
        colorId: color.id,
        colorNameAr: color.nameAr,
        colorHex: color.hex,
        sizeLabel,
        unitPrice: product.price,
        qty: 1,
        image: color.frontImage,
      },
      true,
    );
    setJustAdded(sizeLabel);
    setQuickSizesOpen(false);
    window.setTimeout(() => setJustAdded(null), 1200);
  };

  return (
    <article className="group flex flex-col">
      {/* 4:5 Studio Garment Container */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onInspect(product)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onInspect(product);
          }
        }}
        className="relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
      >
        <img
          src={color?.frontImage}
          alt={product.nameAr}
          loading="lazy"
          className={`size-full object-contain transition-opacity duration-300 ${
            isComingSoon ? "opacity-75" : ""
          } ${color?.backImage ? "group-hover:opacity-0" : ""}`}
        />
        {color?.backImage && (
          <img
            src={color.backImage}
            alt={`${product.nameAr} — الظهر`}
            loading="lazy"
            className={`pointer-events-none absolute inset-0 size-full object-contain opacity-0 transition-opacity duration-300 ${
              isComingSoon ? "group-hover:opacity-75" : "group-hover:opacity-100"
            }`}
          />
        )}

        {/* Top badges */}
        <div className="pointer-events-none absolute inset-x-2 top-2 flex items-start justify-between gap-1.5">
          {isComingSoon ? (
            <span
              dir="ltr"
              className="rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/92 px-2 py-0.5 font-en text-[9px] font-bold tracking-[0.16em] text-[var(--text-primary)] whitespace-nowrap"
            >
              COMING SOON
            </span>
          ) : product.isNewDrop ? (
            <span
              dir="ltr"
              className="rounded-[3px] bg-[var(--brand-accent)] px-1.5 py-0.5 font-en text-[9px] font-semibold tracking-[0.14em] text-[#F6F5F2] whitespace-nowrap"
            >
              NEW
            </span>
          ) : (
            <span />
          )}
          {!compact && (
            <span
              dir="ltr"
              className="hidden rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/88 px-1.5 py-0.5 font-en text-[9px] font-medium tracking-wider text-[var(--text-muted)] whitespace-nowrap sm:inline-block"
            >
              {product.code}
            </span>
          )}
        </div>

        {/* Floating Coming Soon Plaque on Youth Preview Garments */}
        {isComingSoon && (
          <div className="pointer-events-none absolute inset-x-3 top-1/2 z-10 -translate-y-1/2">
            <div className="mx-auto max-w-[190px] rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/92 px-3 py-2.5 text-center shadow-md backdrop-blur-xs">
              <p
                dir="ltr"
                className="font-en text-[10px] font-bold tracking-[0.2em] text-[var(--text-primary)] sm:text-[11px]"
              >
                COMING SOON
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                يُفتتح قريباً — للمعاينة فقط
              </p>
            </div>
          </div>
        )}

        {/* Zara-style Quick-Add (+) Size Bar — Active ONLY on purchasable Kids items */}
        {!compact && !isComingSoon && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-2 bottom-2 z-10"
          >
            {quickSizesOpen ? (
              <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/96 p-1.5 backdrop-blur-md">
                <div className="mb-1 flex items-center justify-between px-1">
                  <span className="text-[10px] font-medium text-[var(--text-muted)]">اختر المقاس</span>
                  <button
                    type="button"
                    onClick={() => setQuickSizesOpen(false)}
                    className="font-en text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {product.sizes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      disabled={s.stock <= 0}
                      onClick={(e) => handleQuickSize(e, s.label)}
                      className="rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-1.5 font-en text-[11px] font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent)] hover:text-[#F6F5F2] disabled:opacity-35"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => setQuickSizesOpen(true)}
                  aria-label={`إضافة سريعة لـ ${product.nameAr}`}
                  className="inline-flex size-8 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/92 text-[var(--text-primary)] transition-colors hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent)] hover:text-[#F6F5F2]"
                >
                  {justAdded ? (
                    <Check className="size-3.5" strokeWidth={1.75} />
                  ) : (
                    <Plus className="size-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Clean Minimal Editorial Metadata Below Card */}
      <div className="mt-2.5 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={() => onInspect(product)}
            className="min-w-0 text-right text-xs font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--brand-accent)] sm:text-[13px]"
          >
            <span className="line-clamp-1">{product.nameAr}</span>
          </button>
          <div className="shrink-0 text-left">
            {isComingSoon ? (
              <span className="rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--text-muted)]">
                قريباً
              </span>
            ) : (
              <span className="text-xs font-semibold text-[var(--text-primary)] sm:text-[13px]">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {!compact && (
          <div className="flex items-center justify-between gap-2">
            <span dir="ltr" className="truncate font-en text-[10px] tracking-[0.14em] text-[var(--text-muted)]">
              {product.subBrand}
            </span>

            {product.colors.length > 1 && (
              <div className="flex items-center gap-1.5">
                {product.colors.map((c, idx) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-label={c.nameAr}
                    onClick={() => setColorIdx(idx)}
                    className={`size-3 rounded-full border transition-transform ${
                      colorIdx === idx
                        ? "scale-110 border-[var(--text-primary)] ring-1 ring-[var(--brand-accent)]"
                        : "border-black/25 opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
