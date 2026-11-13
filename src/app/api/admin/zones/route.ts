import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { uid, updateDB } from "@/lib/db";
import type { ShippingZone } from "@/lib/types";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as Partial<ShippingZone>;
  const zone = await updateDB((db) => {
    const z: ShippingZone = {
      id: body.id || uid("zone_"),
      nameAr: body.nameAr?.trim() || "منطقة شحن",
      etaAr: body.etaAr?.trim() || "خلال ٢–٤ أيام عمل",
      fee: Math.max(0, Number(body.fee) || 0),
      isActive: body.isActive !== false,
    };
    const idx = db.shippingZones.findIndex((x) => x.id === z.id);
    if (idx >= 0) db.shippingZones[idx] = z;
    else db.shippingZones.push(z);
    return z;
  });
  return NextResponse.json({ zone });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  await updateDB((db) => {
    db.shippingZones = db.shippingZones.filter((z) => z.id !== id);
  });
  return NextResponse.json({ ok: true });
}
