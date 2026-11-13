import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { uid, updateDB } from "@/lib/db";
import type { DropBundle } from "@/lib/types";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as Partial<DropBundle>;
  const drop = await updateDB((db) => {
    const d: DropBundle = {
      id: body.id || uid("drop_"),
      code: body.code?.trim() || "DROP-MW",
      subBrand: body.subBrand || "MO / STUDIO",
      titleAr: body.titleAr?.trim() || "باكدج موسمية",
      titleEn: body.titleEn?.trim() || "SEASONAL CAPSULE",
      descriptionAr: body.descriptionAr?.trim() || "",
      image: body.image || "/images/products/studio-zip-jacket-stone.webp",
      price: Math.max(0, Number(body.price) || 0),
      oldPrice: body.oldPrice ? Number(body.oldPrice) : undefined,
      badgeEn: body.badgeEn?.trim() || "CAPSULE DROP",
      startsAt: body.startsAt || new Date(Date.now() - 86400_000).toISOString(),
      endsAt: body.endsAt || new Date(Date.now() + 90 * 86400_000).toISOString(),
      isActive: body.isActive !== false,
      includedProductIds: Array.isArray(body.includedProductIds) ? body.includedProductIds : [],
    };
    const idx = db.drops.findIndex((x) => x.id === d.id);
    if (idx >= 0) db.drops[idx] = d;
    else db.drops.unshift(d);
    return d;
  });
  return NextResponse.json({ drop });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  await updateDB((db) => {
    db.drops = db.drops.filter((d) => d.id !== id);
  });
  return NextResponse.json({ ok: true });
}
