import { NextResponse } from "next/server";
import { uid, updateDB } from "@/lib/db";
import { normalizeDigits } from "@/lib/utils";
import type { Order, OrderItem } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const customerName = String(body.customerName || "").trim();
    const customerPhone = normalizeDigits(String(body.customerPhone || "")).replace(/[^\d+]/g, "");
    const governorateId = String(body.governorateId || "").trim();
    const address = String(body.address || "").trim();
    const notes = String(body.notes || "").trim();
    const rawItems = Array.isArray(body.items) ? body.items : [];

    if (!customerName || customerPhone.length < 10 || !governorateId || !address || rawItems.length === 0) {
      return NextResponse.json({ error: "برجاء استكمال بيانات التوصيل والقطع المطلوبة" }, { status: 400 });
    }

    const created = await updateDB<Order | { error: string }>((db) => {
      if (!db.settings.acceptingOrders) {
        return { error: "استقبال الطلبات متوقف مؤقتاً، يرجى المحاولة لاحقاً" };
      }
      const zone = db.shippingZones.find((z) => z.id === governorateId && z.isActive) ?? db.shippingZones[0];
      const validatedItems: OrderItem[] = [];

      for (const raw of rawItems) {
        const product = db.products.find((p) => p.id === raw.productId);
        const qty = Math.max(1, Math.min(20, Number(raw.qty) || 1));
        if (product) {
          const color = product.colors.find((c) => c.id === raw.colorId) ?? product.colors[0];
          const sizeLabel = String(raw.sizeLabel || product.sizes[0]?.label || "M");
          validatedItems.push({
            productId: product.id,
            code: product.code,
            nameAr: product.nameAr,
            nameEn: product.nameEn,
            colorId: color?.id || "default",
            colorNameAr: color?.nameAr || "أساسي",
            colorHex: color?.hex || "#0E1012",
            sizeLabel,
            unitPrice: product.price,
            qty,
            image: color?.frontImage || "/images/products/bone-tee-front.webp",
          });
        } else if (raw.dropId) {
          const drop = db.drops.find((d) => d.id === raw.dropId);
          if (drop) {
            validatedItems.push({
              productId: drop.id,
              code: drop.code,
              nameAr: drop.titleAr,
              nameEn: drop.titleEn,
              colorId: "bundle",
              colorNameAr: "باكدج كاملة",
              colorHex: "#1F5668",
              sizeLabel: String(raw.sizeLabel || "M"),
              unitPrice: drop.price,
              qty,
              image: drop.image,
            });
          }
        }
      }

      if (validatedItems.length === 0) {
        return { error: "لم يتم العثور على القطع المحددة" };
      }

      const subtotal = validatedItems.reduce((sum, it) => sum + it.unitPrice * it.qty, 0);
      const shippingFee =
        subtotal >= db.settings.freeShippingThreshold ? 0 : (zone?.fee ?? 75);
      const order: Order = {
        id: uid("mw_"),
        customerName,
        customerPhone,
        governorateId: zone?.id || governorateId,
        governorateName: zone?.nameAr || "القاهرة والجيزة",
        address,
        notes: notes || undefined,
        items: validatedItems,
        subtotal,
        shippingFee,
        total: subtotal + shippingFee,
        status: "new",
        createdAt: new Date().toISOString(),
      };
      db.orders.unshift(order);
      return order;
    });

    if ("error" in created) {
      return NextResponse.json({ error: created.error }, { status: 400 });
    }

    return NextResponse.json({ order: created });
  } catch {
    return NextResponse.json({ error: "تعذر تسجيل الطلب، حاول مرة أخرى" }, { status: 500 });
  }
}
