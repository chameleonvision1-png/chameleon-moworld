"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Lock, ShoppingBag } from "lucide-react";
import ClothingRailHero, { type RailGarment } from "@/components/ui/product-rail-gallery";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";

const RAIL_IMAGE_MAP: Record<string, { front: string; back: string; side: string }> = {
  // 8 Real Kids' 2-Piece Outfits (Open & Purchasable Now)
  "p-kids-set-01": {
    front: "/images/rail/mo-kids-01-front.webp",
    back: "/images/rail/mo-kids-01-back.webp",
    side: "/images/rail/mo-kids-01-side.webp",
  },
  "p-kids-set-4302": {
    front: "/images/rail/mo-kids-02-front.webp",
    back: "/images/rail/mo-kids-02-back.webp",
    side: "/images/rail/mo-kids-02-side.webp",
  },
  "p-kids-set-03": {
    front: "/images/rail/mo-kids-03-front.webp",
    back: "/images/rail/mo-kids-03-back.webp",
    side: "/images/rail/mo-kids-03-side.webp",
  },
  "p-kids-set-04": {
    front: "/images/rail/mo-kids-04-front.webp",
    back: "/images/rail/mo-kids-04-back.webp",
    side: "/images/rail/mo-kids-04-side.webp",
  },
  "p-kids-set-05": {
    front: "/images/rail/mo-kids-05-front.webp",
    back: "/images/rail/mo-kids-05-back.webp",
    side: "/images/rail/mo-kids-05-side.webp",
  },
  "p-kids-set-4303": {
    front: "/images/rail/mo-kids-06-front.webp",
    back: "/images/rail/mo-kids-06-back.webp",
    side: "/images/rail/mo-kids-06-side.webp",
  },
  "p-kids-set-4307": {
    front: "/images/rail/mo-kids-07-front.webp",
    back: "/images/rail/mo-kids-07-back.webp",
    side: "/images/rail/mo-kids-07-side.webp",
  },
  "p-kids-set-2306": {
    front: "/images/rail/mo-kids-08-front.webp",
    back: "/images/rail/mo-kids-08-back.webp",
    side: "/images/rail/mo-kids-08-side.webp",
  },
  // MO-Branded Youth Pieces (Preview Only — Coming Soon)
  "p-ess-bone-tee": {
    front: "/images/rail/mo-bone-tee-front.webp",
    back: "/images/rail/mo-bone-tee-back.webp",
    side: "/images/rail/mo-bone-tee-side.webp",
  },
  "p-ess-obsidian-tee": {
    front: "/images/rail/mo-obsidian-tee-front.webp",
    back: "/images/rail/mo-obsidian-tee-back.webp",
    side: "/images/rail/mo-obsidian-tee-side.webp",
  },
  "p-studio-oxford-slate": {
    front: "/images/rail/mo-oxford-slate-front.webp",
    back: "/images/rail/mo-oxford-slate-back.webp",
    side: "/images/rail/mo-oxford-slate-side.webp",
  },
  "p-studio-cardigan-olive": {
    front: "/images/rail/mo-cardigan-olive-front.webp",
    back: "/images/rail/mo-cardigan-olive-back.webp",
    side: "/images/rail/mo-cardigan-olive-side.webp",
  },
  "p-ess-heather-hoodie": {
    front: "/images/rail/mo-heather-hoodie-front.webp",
    back: "/images/rail/mo-heather-hoodie-back.webp",
    side: "/images/rail/mo-heather-hoodie-side.webp",
  },
  "p-ess-petrol-crew": {
    front: "/images/rail/mo-petrol-crew-front.webp",
    back: "/images/rail/mo-petrol-crew-back.webp",
    side: "/images/rail/mo-petrol-crew-side.webp",
  },
  "p-ess-stone-crew": {
    front: "/images/rail/mo-stone-crew-front.webp",
    back: "/images/rail/mo-stone-crew-back.webp",
    side: "/images/rail/mo-stone-crew-side.webp",
  },
  "p-ess-polo-petrol": {
    front: "/images/rail/mo-polo-petrol-front.webp",
    back: "/images/rail/mo-polo-petrol-back.webp",
    side: "/images/rail/mo-polo-petrol-side.webp",
  },
  "p-ess-henley-clay": {
    front: "/images/rail/mo-henley-clay-front.webp",
    back: "/images/rail/mo-henley-clay-back.webp",
    side: "/images/rail/mo-henley-clay-side.webp",
  },
  "p-arch-breton-knit": {
    front: "/images/rail/mo-breton-front.webp",
    back: "/images/rail/mo-breton-back.webp",
    side: "/images/rail/mo-breton-side.webp",
  },
  "p-arch-stone-tee": {
    front: "/images/rail/mo-archive-tee-front.webp",
    back: "/images/rail/mo-archive-tee-back.webp",
    side: "/images/rail/mo-archive-tee-side.webp",
  },
};

function RailCommerceControls({
  product,
  onDone,
}: {
  product: Product;
  onDone: () => void;
}) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = React.useState(
    product.sizes[1]?.label ?? product.sizes[0]?.label ?? "8",
  );
  const primaryColor = product.colors[0];

  if (product.comingSoon) {
    return (
      <div className="mt-3 space-y-3 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-right">
        <div className="flex items-center justify-between gap-2">
          <span
            dir="ltr"
            className="inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--brand-accent)]/40 bg-[var(--brand-accent)]/10 px-2.5 py-1 font-en text-[10px] font-semibold tracking-[0.2em] text-[var(--brand-accent)]"
          >
            <Lock className="size-3" strokeWidth={1.75} />
            COMING SOON
          </span>
          <span className="text-xs font-semibold text-[var(--text-muted)]">معاينة مسبقة فقط</span>
        </div>
        <p className="text-xs leading-relaxed text-[var(--text-muted)]">
          هذه القطعة ضمن تشكيلة الشباب وتُعرض للمعاينة المسبقة قبل الافتتاح الرسمي — لا يمكن إضافتها للحقيبة حالياً، بينما تشكيلة الأطفال متاحة بالكامل للشراء.
        </p>
        <Link
          href="/shop?sub=MO+%2F+KIDS"
          onClick={onDone}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-4 py-3 text-xs font-semibold text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)]"
        >
          <span>تسوق تشكيلة الأطفال المتاحة الآن</span>
          <ArrowLeft className="size-4" strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    if (!primaryColor) return;
    addItem(
      {
        productId: product.id,
        code: product.code,
        subBrand: product.subBrand,
        nameAr: product.nameAr,
        nameEn: product.nameEn,
        colorId: primaryColor.id,
        colorNameAr: primaryColor.nameAr,
        colorHex: primaryColor.hex,
        sizeLabel: selectedSize,
        unitPrice: product.price,
        qty: 1,
        image: primaryColor.frontImage,
      },
      true,
    );
    onDone();
  };

  return (
    <div className="mt-3 space-y-3 border-t border-[var(--border-subtle)] pt-3.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--text-muted)]">المقاس المتاح</span>
        <span className="text-base font-bold text-[var(--text-primary)]">
          {formatPrice(product.price)}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {product.sizes.map((s) => (
          <button
            key={s.id}
            type="button"
            disabled={s.stock <= 0}
            onClick={() => setSelectedSize(s.label)}
            className={`rounded-[4px] border py-2 font-en text-xs font-semibold transition-colors ${
              selectedSize === s.label
                ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-[#F6F5F2]"
                : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--text-primary)]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[var(--brand-accent)] px-4 py-3 text-xs font-semibold text-[#F6F5F2] transition-colors hover:bg-[var(--brand-accent-hover)]"
      >
        <ShoppingBag className="size-4" strokeWidth={1.5} />
        <span>أضف إلى الحقيبة — مقاس {selectedSize}</span>
      </button>
    </div>
  );
}

export function HeroRailSection({ products }: { products: Product[] }) {
  const railProducts = React.useMemo(() => {
    const flagged = products.filter((p) => p.onHeroRail && p.isAvailable);
    const ordered = [...flagged].sort((a, b) => Number(Boolean(a.comingSoon)) - Number(Boolean(b.comingSoon)));
    return (ordered.length > 0 ? ordered : products.slice(0, 11)).slice(0, 11);
  }, [products]);

  const railItems: RailGarment[] = React.useMemo(
    () =>
      railProducts.map((p) => {
        const mapped = RAIL_IMAGE_MAP[p.id];
        const c = p.colors[0];
        const isLocked = Boolean(p.comingSoon);
        return {
          id: p.id,
          name: p.nameAr,
          nameEn: p.nameEn,
          subBrand: p.subBrand,
          code: p.code,
          kind: p.railKind ?? "hoodie",
          color: c?.hex ?? "#DDD8CE",
          comingSoon: isLocked,
          tag: isLocked ? "COMING SOON" : `${p.price.toLocaleString("en-US")} EGP`,
          description: p.descriptionAr,
          details: isLocked
            ? [`${p.fitType} Fit`, "قسم الشباب — قريباً", "غير متاح للشراء حالياً"]
            : [
                `${p.fitType} Fit`,
                `مقاسات ${p.sizes[0]?.label ?? ""}–${p.sizes[p.sizes.length - 1]?.label ?? ""}`,
                "معاينة عند الاستلام",
              ],
          image: mapped?.front ?? c?.frontImage,
          backImage: mapped?.back ?? c?.backImage ?? c?.frontImage,
          sideImage: mapped?.side ?? c?.sideImage,
        };
      }),
    [railProducts],
  );

  return (
    <ClothingRailHero
      items={railItems}
      hanger="none"
      eyebrow="MO / KIDS • WINTER COLLECTION"
      heading="تشكيلة أزياء الأطفال متاحة الآن"
      caption="٨ أطقم أطفال جاهزة للطلب + معاينة للشباب"
      autoplay
      interval={2900}
      action={
        <div className="grid w-full max-w-[330px] grid-cols-2 gap-2.5 sm:max-w-sm">
          <Link
            href="/shop?sub=MO+%2F+KIDS"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[4px] bg-[var(--brand-accent)] px-3 text-xs font-semibold text-[#F6F5F2] whitespace-nowrap transition-colors hover:bg-[var(--brand-accent-hover)]"
          >
            <span>تسوق قسم الأطفال</span>
            <ArrowLeft className="size-3.5 shrink-0" strokeWidth={1.5} />
          </Link>
          <Link
            href="/shop"
            className="inline-flex h-10 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-xs font-semibold text-[var(--text-primary)] whitespace-nowrap transition-colors hover:border-[var(--text-primary)]"
          >
            <span>تصفح كل الأقسام</span>
          </Link>
        </div>
      }
      renderDetailExtra={(item, close) => {
        const matched = railProducts.find((p) => p.id === item.id);
        if (!matched) return null;
        return <RailCommerceControls product={matched} onDone={close} />;
      }}
    />
  );
}
