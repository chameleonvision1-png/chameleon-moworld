import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const editorialFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-editorial",
  display: "swap",
});

const enFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-en",
  display: "swap",
});

const arFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ar",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://moworld.chameleon.vision"),
  title: {
    default: "MO WORLD | Frontier Fashion Hub — أزياء عصرية للأطفال والشباب",
    template: "%s | MO WORLD",
  },
  description:
    "MO WORLD — Frontier Fashion Hub. تشكيلات أزياء عصرية مختارة بعناية تشمل MO / KIDS و MO / ESSENTIALS و MO / STUDIO و MO / ARCHIVE مع شحن سريع ومعاينة عند الاستلام.",
  openGraph: {
    title: "MO WORLD | Frontier Fashion Hub",
    description:
      "Curated Contemporary Streetwear & Everyday Heavyweight Fits — من ملابس الأطفال إلى الخطوط الشبابية واليومية.",
    url: "https://moworld.chameleon.vision",
    siteName: "MO WORLD",
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MO WORLD — Frontier Fashion Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MO WORLD | Frontier Fashion Hub",
    description: "تشكيلات أزياء عصرية مختارة بعناية | شحن سريع ومعاينة عند الاستلام.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F5F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0C0E" },
  ],
};

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('moworld_theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.removeAttribute('data-theme');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${editorialFont.variable} ${enFont.variable} ${arFont.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-svh bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
