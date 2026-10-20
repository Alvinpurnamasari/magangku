
import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Pastikan permintaan berasal dari sesi yang sudah login.
    const supabase = await createClient();
    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Sesi login tidak valid. Silakan login kembali." },
        { status: 401 }
      );
    }

    const adminUserId = process.env.ADMIN_USER_ID;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!adminUserId || !supabaseUrl || !secretKey) {
      return NextResponse.json(
        { error: "Konfigurasi server belum lengkap." },
        { status: 500 }
      );
    }

    // Hanya akun admin yang UID-nya cocok yang boleh mengubah akun.
    if (authData.user.id !== adminUserId) {
      return NextResponse.json(
        { error: "Akses ditolak. Hanya admin yang boleh mengubah akun." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!email && !password) {
      return NextResponse.json(
        { error: "Masukkan email baru atau password baru." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    if (password && password.length < 8) {
      return NextResponse.json(
        { error: "Password minimal 8 karakter." },
        { status: 400 }
      );
    }

    // Client khusus server. Jangan pernah gunakan secret key di browser.
    const adminSupabase = createSupabaseClient(supabaseUrl, secretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const updates: {
      email?: string;
      email_confirm?: boolean;
      password?: string;
    } = {};

    if (email) {
      updates.email = email;
      updates.email_confirm = true;
    }

    if (password) {
      updates.password = password;
    }

    const { data, error } = await adminSupabase.auth.admin.updateUserById(
      adminUserId,
      updates
    );

    if (error) {
      return NextResponse.json(
        { error: `Gagal memperbarui akun: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      email: data.user.email,
      message: "Pengaturan akun berhasil diperbarui.",
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
