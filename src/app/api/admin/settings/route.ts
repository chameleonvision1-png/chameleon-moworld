import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAdmin, makeToken } from "@/lib/auth";
import { updateDB } from "@/lib/db";
import type { Settings } from "@/lib/types";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const patch = (await req.json()) as Partial<Settings>;
  const settings = await updateDB((db) => {
    db.settings = {
      ...db.settings,
      ...patch,
      adminPassword: patch.adminPassword?.trim() ? patch.adminPassword.trim() : db.settings.adminPassword,
      adminUsername: patch.adminUsername?.trim() ? patch.adminUsername.trim() : db.settings.adminUsername,
      freeShippingThreshold: Number(patch.freeShippingThreshold ?? db.settings.freeShippingThreshold) || 0,
    };
    return db.settings;
  });

  const store = await cookies();
  store.set(ADMIN_COOKIE, makeToken(settings.adminUsername, settings.adminPassword), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  const { adminPassword: _pw, ...safe } = settings;
  void _pw;
  return NextResponse.json({ settings: safe });
}
