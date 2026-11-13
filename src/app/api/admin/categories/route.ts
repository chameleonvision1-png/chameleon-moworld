import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { uid, updateDB } from "@/lib/db";
import type { Category } from "@/lib/types";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as Partial<Category>;
  const category = await updateDB((db) => {
    const c: Category = {
      id: body.id || uid("cat_"),
      slug: body.slug?.trim() || uid("col-"),
      subBrand: body.subBrand || "MO / ESSENTIALS",
      nameAr: body.nameAr?.trim() || "تشكيلة جديدة",
      nameEn: body.nameEn?.trim() || "MO / COLLECTION",
      descriptionAr: body.descriptionAr?.trim() || "",
      sortOrder: Number(body.sortOrder) || db.categories.length + 1,
    };
    const idx = db.categories.findIndex((x) => x.id === c.id);
    if (idx >= 0) db.categories[idx] = c;
    else db.categories.push(c);
    return c;
  });
  return NextResponse.json({ category });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  await updateDB((db) => {
    db.categories = db.categories.filter((c) => c.id !== id);
  });
  return NextResponse.json({ ok: true });
}
