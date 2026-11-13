import { publicDB } from "@/lib/db";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BagDrawer } from "@/components/BagDrawer";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await publicDB();

  return (
    <ThemeProvider>
      <CartProvider>
        <div className="flex min-h-svh flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
          <Header settings={data.settings} />
          <main className="flex-1">{children}</main>
          <Footer settings={data.settings} />
          <BagDrawer freeShippingThreshold={data.settings.freeShippingThreshold} />
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}
