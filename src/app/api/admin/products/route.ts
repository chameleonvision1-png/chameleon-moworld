import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { uid, updateDB } from "@/lib/db";
import type { Product } from "@/lib/types";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as Partial<Product>;
  const product = await updateDB((db) => {
    const p: Product = {
      id: body.id || uid("p_"),
      code: body.code?.trim() || `MW-${Math.floor(100 + Math.random() * 900)}`,
      subBrand: body.subBrand || "MO / ESSENTIALS",
      categoryId: body.categoryId || db.categories[0]?.id || "cat-essentials",
      nameAr: body.nameAr?.trim() || "قطعة جديدة",
      nameEn: body.nameEn?.trim() || "New Garment",
      descriptionAr: body.descriptionAr?.trim() || "",
      fabricSpec: body.fabricSpec?.trim() || "100% Egyptian Cotton",
      fitType: body.fitType || "Relaxed",
      ageGroup: body.ageGroup || "unisex",
      price: Math.max(0, Number(body.price) || 0),
      oldPrice: body.oldPrice ? Number(body.oldPrice) : undefined,
      colors: Array.isArray(body.colors) && body.colors.length > 0
        ? body.colors
        : [{ id: "default", nameAr: "أساسي", nameEn: "Primary", hex: "#0E1012", frontImage: "/images/products/bone-tee-front.webp" }],
      sizes: Array.isArray(body.sizes) && body.sizes.length > 0
        ? body.sizes
        : [
            { id: "s", label: "S", stock: 10 },
            { id: "m", label: "M", stock: 15 },
            { id: "l", label: "L", stock: 15 },
            { id: "xl", label: "XL", stock: 10 },
          ],
      careNotes: Array.isArray(body.careNotes) && body.careNotes.length > 0
        ? body.careNotes
        : ["غسيل بماء بارد ٣٠ درجة على الوجه الداخلي", "معاينة الأوردر عند الاستلام"],
      isAvailable: body.isAvailable !== false,
      comingSoon: Boolean(body.comingSoon),
      isFeatured: Boolean(body.isFeatured),
      isNewDrop: Boolean(body.isNewDrop),
      onHeroRail: Boolean(body.onHeroRail),
      railKind: body.railKind || "tee",
      completeLookIds: Array.isArray(body.completeLookIds) ? body.completeLookIds : [],
    };
    const idx = db.products.findIndex((x) => x.id === p.id);
    if (idx >= 0) db.products[idx] = p;
    else db.products.unshift(p);
    return p;
  });
  return NextResponse.json({ product });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  await updateDB((db) => {
    db.products = db.products.filter((p) => p.id !== id);
  });
  return NextResponse.json({ ok: true });
}
