import type { Metadata } from "next";
import { publicDB } from "@/lib/db";
import { CartCheckoutClient } from "@/components/CartCheckoutClient";

export const metadata: Metadata = {
  title: "حقيبة التسوق وإتمام الطلب",
  description: "مراجعة حقيبة التسوق وإتمام الطلب مع الدفع عند الاستلام ومعاينة الأوردر.",
};

export default async function CartPage() {
  const data = await publicDB();
  return (
    <CartCheckoutClient
      shippingZones={data.shippingZones}
      settings={data.settings}
    />
  );
}
