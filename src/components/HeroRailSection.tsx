"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import ClothingRailHero, { type RailGarment } from "@/components/ui/product-rail-gallery";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartProvider";

const RAIL_IMAGE_MAP: Record<string, { front: string; back: string; side: string }> = {
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
    product.sizes[1]?.label ?? product.sizes[0]?.label ?? "M",
  );
  const primaryColor = product.colors[0];

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
        <span>أضف إلى الحقيبة — {selectedSize}</span>
      </button>
    </div>
  );
}

export function HeroRailSection({ products }: { products: Product[] }) {
  const railProducts = React.useMemo(() => {
    const flagged = products.filter((p) => p.onHeroRail && p.isAvailable);
    return (flagged.length > 0 ? flagged : products.slice(0, 10)).slice(0, 10);
  }, [products]);

  const railItems: RailGarment[] = React.useMemo(
    () =>
      railProducts.map((p) => {
        const mapped = RAIL_IMAGE_MAP[p.id];
        const c = p.colors[0];
        return {
          id: p.id,
          name: p.nameAr,
          nameEn: p.nameEn,
          subBrand: p.subBrand,
          code: p.code,
          kind: p.railKind ?? "tee",
          color: c?.hex ?? "#DDD8CE",
          tag: `${p.price.toLocaleString("en-US")} EGP`,
          description: p.descriptionAr,
          details: [
            `${p.fitType} Fit`,
            p.fabricSpec.split("•")[0]?.trim() || "Egyptian Cotton",
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
      eyebrow="MO WORLD // WINTER EDIT"
      heading="تشكيلة الشتاء التفاعلية"
      caption="١٠ قطع معلّقة للمعاينة المباشرة — اسحب أو اضغط للتفاصيل"
      autoplay
      interval={2900}
      action={
        <div className="grid w-full max-w-[320px] grid-cols-2 gap-2.5 sm:max-w-sm">
          <Link
            href="/shop"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[4px] bg-[var(--brand-accent)] px-3 text-xs font-semibold text-[#F6F5F2] whitespace-nowrap transition-colors hover:bg-[var(--brand-accent-hover)]"
          >
            <span>تصفح الكتالوج</span>
            <ArrowLeft className="size-3.5 shrink-0" strokeWidth={1.5} />
          </Link>
          <Link
            href="/shop?sub=MO+%2F+KIDS"
            className="inline-flex h-10 items-center justify-center rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 text-xs font-semibold text-[var(--text-primary)] whitespace-nowrap transition-colors hover:border-[var(--text-primary)]"
          >
            <span>قسم الأطفال</span>
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
