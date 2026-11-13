import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, checkCredentials, currentToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username = "", password = "" } = await req.json();
    const ok = await checkCredentials(String(username), String(password));
    if (!ok) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }
    const token = await currentToken();
    const store = await cookies();
    store.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذر تسجيل الدخول" }, { status: 400 });
  }
}
