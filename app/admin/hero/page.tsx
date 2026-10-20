
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type HeroContent = {
  id: number;
  title: string;
  description: string;
  secondary_description: string;
  image_url: string;
};

export default function AdminHeroPage() {
  const [form, setForm] = useState<HeroContent>({
    id: 1,
    title: "",
    description: "",
    secondary_description: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadHero() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("hero_content")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        setMessage("Gagal mengambil data: " + error.message);
      } else if (data) {
        setForm({
          id: data.id,
          title: data.title ?? "",
          description: data.description ?? "",
          secondary_description: data.secondary_description ?? "",
          image_url: data.image_url ?? "",
        });
      } else {
        setMessage("Data Hero belum tersedia di database.");
      }

      setLoading(false);
    }

    loadHero();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase
      .from("hero_content")
      .update({
        title: form.title,
        description: form.description,
        secondary_description: form.secondary_description,
        image_url: form.image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", form.id);

    if (error) {
      setMessage("Gagal menyimpan: " + error.message);
    } else {
      setMessage("Perubahan berhasil disimpan.");
    }

    setSaving(false);
  }

  function updateField(
    field: keyof Omit<HeroContent, "id">,
    value: string
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  if (loading) {
    return <main className="p-8">Memuat data Hero...</main>;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-600 shadow-sm transition hover:bg-green-50 hover:text-green-700"
        >
          <span aria-hidden="true">←</span>
          Kembali ke Dashboard Admin
        </Link>


        <h1 className="mt-4 text-2xl font-extrabold text-gray-800">
          Kelola Hero & Banner
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Ubah teks dan gambar utama landing page Magangku.
        </p>

        
        {message && (
        <p
            role="status"
            aria-live="polite"
            className={`mt-5 rounded-lg border p-4 text-sm ${
            message.startsWith("Perubahan berhasil")
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
        >
            {message}
        </p>
        )}


        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 rounded-2xl border bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Judul Hero
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Deskripsi Utama
            </label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Deskripsi Kedua
            </label>
            <textarea
              rows={4}
              value={form.secondary_description}
              onChange={(e) =>
                updateField("secondary_description", e.target.value)
              }
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </main>
  );
}
