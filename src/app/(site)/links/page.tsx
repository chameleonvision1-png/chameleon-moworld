import type { Metadata } from "next";
import { publicDB } from "@/lib/db";
import { LinkHubClient } from "@/components/LinkHubClient";

export const metadata: Metadata = {
  title: "مركز الروابط والقنوات الرسمية | Link Hub",
  description:
    "الروابط الرسمية لمتجر MO WORLD، التشكيلات، حاسبة المقاسات، وحسابات ومجتمعات التواصل الاجتماعي.",
};

export default async function LinksHubPage() {
  const data = await publicDB();
  return <LinkHubClient settings={data.settings} />;
}
