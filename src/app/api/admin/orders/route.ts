import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updateDB } from "@/lib/db";
import type { OrderStatus } from "@/lib/types";

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id, status } = (await req.json()) as { id: string; status: OrderStatus };
  const updated = await updateDB((db) => {
    const order = db.orders.find((o) => o.id === id);
    if (!order) return null;
    order.status = status;
    return order;
  });
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ order: updated });
}
