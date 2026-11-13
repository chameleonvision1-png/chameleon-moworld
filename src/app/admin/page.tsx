import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AdminDashboard } from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "لوحة تحكم المتجر | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAdmin();
  if (!authed) {
    return (
      <ThemeProvider>
        <AdminDashboard initialAuthed={false} initialData={null} />
      </ThemeProvider>
    );
  }

  const db = await readDB(true);
  const safeDb = {
    ...db,
    settings: {
      ...db.settings,
      adminPassword: "",
    },
  };

  return (
    <ThemeProvider>
      <AdminDashboard initialAuthed={true} initialData={safeDb} />
    </ThemeProvider>
  );
}
