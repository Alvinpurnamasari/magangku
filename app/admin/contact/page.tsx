
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type ContactSettings = {
  whatsapp_number: string;
  whatsapp_url: string;
  registration_url: string;
  powered_by: string;
};

const defaults: ContactSettings = {
  whatsapp_number: "0818 1818 1013",
  whatsapp_url: "https://wa.link/y23pe4",
  registration_url: "https://bit.ly/form_magangku",
  powered_by: "www.Republikweb.net",
};

function makeWhatsAppUrl(number: string) {
  const digits = number.replace(/\D/g, "");

  const internationalNumber = digits.startsWith("0")
    ? `62${digits.slice(1)}`
    : digits;

  return `https://wa.me/${internationalNumber}`;
}

export default function ContactAdminPage() {
  const [form, setForm] = useState<ContactSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function loadSettings() {
      const { data, error } = await supabase
        .from("contact_content")
        .select(
          "whatsapp_number, whatsapp_url, registration_url, powered_by"
        )
        .eq("id", 1)
        .maybeSingle();

      if (!active) return;

      if (error) {
        setErrorMessage(
          `Gagal memuat pengaturan: ${error.message}`
        );
      } else if (data) {
        setForm({
          whatsapp_number:
            data.whatsapp_number ?? defaults.whatsapp_number,
          whatsapp_url:
            data.whatsapp_url ?? defaults.whatsapp_url,
          registration_url:
            data.registration_url ?? defaults.registration_url,
          powered_by: data.powered_by ?? defaults.powered_by,
        });
      }

      setLoading(false);
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  function updateField(
    field: "whatsapp_number" | "powered_by",
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveSettings(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setErrorMessage("");

    const number = form.whatsapp_number.trim();
    const digits = number.replace(/\D/g, "");

    const normalizedNumber = digits.startsWith("0")
      ? `62${digits.slice(1)}`
      : digits;

    if (
      !normalizedNumber.startsWith("62") ||
      normalizedNumber.length < 10 ||
      normalizedNumber.length > 15
    ) {
      setErrorMessage(
        "Nomor WhatsApp tidak valid. Gunakan nomor Indonesia, misalnya 0818 1818 1013."
      );
      setSaving(false);
      return;
    }

    const registrationUrl = form.registration_url.trim();

    if (!registrationUrl) {
      setErrorMessage(
        "Tautan formulir pendaftaran wajib diisi."
      );
      setSaving(false);
      return;
    }

    try {
      new URL(registrationUrl);
    } catch {
      setErrorMessage(
        "Tautan pendaftaran tidak valid. Masukkan URL lengkap, misalnya https://bit.ly/form_magangku."
      );
      setSaving(false);
      return;
    }

    const whatsappUrl = makeWhatsAppUrl(number);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("contact_content")
      .update({
        whatsapp_number: number,
        whatsapp_url: whatsappUrl,
        registration_url: registrationUrl,
        powered_by: form.powered_by.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)
      .select("id")
      .maybeSingle();

    if (error) {
      setErrorMessage(
        `Gagal menyimpan perubahan: ${error.message}`
      );
    } else if (!data) {
      setErrorMessage(
        "Data tidak berhasil diperbarui. Pastikan baris contact_content dengan id 1 tersedia dan akun admin memiliki izin UPDATE."
      );
    } else {
      setForm((current) => ({
        ...current,
        whatsapp_url: whatsappUrl,
        registration_url: registrationUrl,
      }));

      setMessage(
        "Berhasil! Nomor WhatsApp dan tautan pendaftaran telah diperbarui."
      );
    }

    setSaving(false);
  }

  const previewUrl = makeWhatsAppUrl(form.whatsapp_number);

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
            Kontak &amp; Pendaftaran
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Kelola nomor WhatsApp, tautan kontak, tautan formulir
            pendaftaran, dan teks kredit pada footer website.
          </p>
        </header>

        {errorMessage && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            {message}
          </div>
        )}

        <form
          onSubmit={saveSettings}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Memuat pengaturan...
            </p>
          ) : (
            <>
              <div>
                <label
                  htmlFor="whatsapp_number"
                  className="text-sm font-bold text-slate-800"
                >
                  Nomor WhatsApp yang ditampilkan
                </label>

                <input
                  id="whatsapp_number"
                  type="tel"
                  className={inputClass}
                  value={form.whatsapp_number}
                  onChange={(event) =>
                    updateField(
                      "whatsapp_number",
                      event.target.value
                    )
                  }
                  placeholder="0818 1818 1013"
                  required
                />

                <div className="mt-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
                  <p className="font-semibold">
                    Tautan WhatsApp otomatis
                  </p>

                  <p className="mt-1 break-all">
                    {previewUrl}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-emerald-700">
                    Tautan kontak WhatsApp akan mengikuti nomor
                    yang kamu masukkan.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="registration_url"
                  className="text-sm font-bold text-slate-800"
                >
                  Tautan Form Pendaftaran
                </label>

                <input
                  id="registration_url"
                  type="url"
                  className={inputClass}
                  value={form.registration_url}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      registration_url: event.target.value,
                    }))
                  }
                  placeholder="https://bit.ly/form_magangku"
                  required
                />

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Tombol Form Pendaftaran menggunakan tautan ini,
                  terpisah dari nomor WhatsApp.
                </p>

                <a
                  href={
                    form.registration_url.trim() ||
                    defaults.registration_url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Tes Form Pendaftaran ↗
                </a>

              </div>

              <div>
                <label
                  htmlFor="powered_by"
                  className="text-sm font-bold text-slate-800"
                >
                  Teks powered by
                </label>

                <input
                  id="powered_by"
                  type="text"
                  className={inputClass}
                  value={form.powered_by}
                  onChange={(event) =>
                    updateField(
                      "powered_by",
                      event.target.value
                    )
                  }
                  placeholder="www.Republikweb.net"
                  required
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/"
                  target="_blank"
                  className="text-center text-sm font-semibold text-slate-600 hover:text-emerald-600"
                >
                  Lihat Landing Page ↗
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </main>
  );
}
