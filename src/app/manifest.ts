import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MO WORLD — Frontier Fashion Hub",
    short_name: "MO WORLD",
    description: "تشكيلات أزياء عصرية مختارة بعناية — MO / KIDS • ESSENTIALS • STUDIO • ARCHIVE",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F5F2",
    theme_color: "#0E1012",
    dir: "rtl",
    lang: "ar",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
