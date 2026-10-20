
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function AdminAccountPage() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !data.user) {
        setErrorMessage(
          "Tidak dapat mengambil akun admin. Silakan login kembali."
        );
      } else {
        setCurrentEmail(data.user.email ?? "");
        setNewEmail(data.user.email ?? "");
      }

      setLoading(false);
    }

    loadAccount();

    return () => {
      active = false;
    };
  }, []);


  async function saveEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
  
    const email = newEmail.trim().toLowerCase();
  
    if (!email) {
      setErrorMessage("Email baru wajib diisi.");
      return;
    }
  
    if (email === currentEmail.toLowerCase()) {
      setErrorMessage("Email baru sama dengan email saat ini.");
      return;
    }
  
    setSavingEmail(true);
  
    try {
      const response = await fetch("/api/admin/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        setErrorMessage(result.error || "Gagal mengganti email.");
        return;
      }
  
      setCurrentEmail(result.email || email);
      setNewEmail(result.email || email);
      setMessage("Email berhasil diganti.");
    } catch {
      setErrorMessage("Tidak dapat terhubung ke server.");
    } finally {
      setSavingEmail(false);
    }
  }
  


  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
  
    if (newPassword.length < 8) {
      setErrorMessage("Password minimal 8 karakter.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setErrorMessage("Konfirmasi password tidak cocok.");
      return;
    }
  
    setSavingPassword(true);
  
    try {
      const response = await fetch("/api/admin/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        setErrorMessage(result.error || "Gagal mengganti password.");
        return;
      }
  
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password berhasil diganti.");
    } catch {
      setErrorMessage("Tidak dapat terhubung ke server.");
    } finally {
      setSavingPassword(false);
    }
  }
  

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-600 shadow-sm transition hover:bg-green-50 hover:text-green-700"
        >
          <span aria-hidden="true">←</span>
          Kembali ke Dashboard Admin
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-sm font-semibold text-emerald-600">
            Panel Pengelolaan Website
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Pengaturan Akun Admin
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Kelola email dan password yang digunakan untuk login ke panel
            admin Magangku.
          </p>
        </header>

        {errorMessage && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
            Memuat informasi akun...
          </div>
        ) : (
          <div className="space-y-6">
            <form
              onSubmit={saveEmail}
              className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
            >
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Ganti Email Login
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Email ini digunakan untuk masuk ke panel admin.
                </p>
              </div>

              <div>
                <label
                  htmlFor="currentEmail"
                  className="text-sm font-bold text-slate-800"
                >
                  Email saat ini
                </label>
                <input
                  id="currentEmail"
                  className={inputClass}
                  value={currentEmail}
                  readOnly
                />
              </div>

              <div>
                <label
                  htmlFor="newEmail"
                  className="text-sm font-bold text-slate-800"
                >
                  Email baru
                </label>
                <input
                  id="newEmail"
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  value={newEmail}
                  onChange={(event) => setNewEmail(event.target.value)}
                  placeholder="admin@email.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={savingEmail || loading}
                className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {savingEmail ? "Menyimpan..." : "Simpan Email"}
              </button>
            </form>

            <form
              onSubmit={savePassword}
              className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
            >
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Ganti Password
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Gunakan password baru minimal 8 karakter.
                </p>
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="text-sm font-bold text-slate-800"
                >
                  Password baru
                </label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  className={inputClass}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Masukkan password baru"
                  minLength={8}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-bold text-slate-800"
                >
                  Konfirmasi password baru
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className={inputClass}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Ulangi password baru"
                  minLength={8}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword || loading}
                className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {savingPassword ? "Menyimpan..." : "Simpan Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
