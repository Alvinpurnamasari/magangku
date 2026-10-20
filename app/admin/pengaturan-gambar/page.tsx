
"use client";
import Link from "next/link";
import { useEffect, useState, type ChangeEvent } from "react";
import { createClient } from "@/lib/supabase";

const ADMIN_UID = "eff9b7ee-bd27-48b2-9609-4d7f1885325c";

type ImageKey = "hero" | "hero_lanjutan" | "rocket" | "logo";

const initialImages: Record<ImageKey, string> = {
  hero: "",
  hero_lanjutan: "",
  rocket: "",
  logo: "",
};

const imageLabels: { key: ImageKey; label: string; description: string }[] = [
  {
    key: "hero",
    label: "Gambar Hero",
    description: "Gambar utama pada bagian paling atas landing page.",
  },
  {
    key: "hero_lanjutan",
    label: "Gambar Hero Lanjutan",
    description: "Gambar pada bagian lanjutan setelah Hero utama.",
  },
  {
    key: "rocket",
    label: "Gambar Roket Fasilitas",
    description: "Ilustrasi roket pada bagian fasilitas.",
  },
  {
    key: "logo",
    label: "Logo Website",
    description: "Logo yang akan digunakan pada bagian website yang mendukung logo.",
  },
];

export default function PengaturanGambarPage() {
  const supabase = createClient();

  const [images, setImages] =
    useState<Record<ImageKey, string>>(initialImages);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<ImageKey | null>(null);
  const [message, setMessage] = useState("");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function loadImages() {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user || user.id !== ADMIN_UID) {
        setMessage("Akses ditolak. Silakan login menggunakan akun admin.");
        setLoading(false);
        return;
      }

      setAuthorized(true);

      const [heroResult, settingsResult] = await Promise.all([
        supabase
          .from("hero_content")
          .select("image_url")
          .eq("id", 1)
          .maybeSingle(),
        supabase
          .from("site_images")
          .select("hero_lanjutan_url, rocket_url, logo_url")
          .eq("id", 1)
          .maybeSingle(),
      ]);

      if (heroResult.error || settingsResult.error) {
        setMessage(
          "Gagal memuat pengaturan gambar. Periksa tabel dan izin Supabase."
        );
      } else {
        setImages({
          hero: heroResult.data?.image_url ?? "",
          hero_lanjutan: settingsResult.data?.hero_lanjutan_url ?? "",
          rocket: settingsResult.data?.rocket_url ?? "",
          logo: settingsResult.data?.logo_url ?? "",
        });
      }

      setLoading(false);
    }

    void loadImages();
  }, [supabase]);

  function updateImage(key: ImageKey, value: string) {
    setImages((previous) => ({ ...previous, [key]: value }));
  }

  async function uploadImage(
    key: ImageKey,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("File harus berupa gambar.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Ukuran gambar maksimal 5 MB.");
      return;
    }

    setMessage("");
    setUploading(key);

    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const filePath = `${key}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("site-images")
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      setMessage(`Upload gagal: ${uploadError.message}`);
      setUploading(null);
      return;
    }

    const { data } = supabase.storage
      .from("site-images")
      .getPublicUrl(filePath);

    updateImage(key, data.publicUrl);
    setMessage("Gambar berhasil diunggah. Klik Simpan Pengaturan untuk menerapkannya.");
    setUploading(null);
  }

  async function saveSettings() {
    setSaving(true);
    setMessage("");

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user || authData.user.id !== ADMIN_UID) {
      setMessage("Sesi admin tidak valid. Silakan login ulang.");
      setSaving(false);
      return;
    }

    const { error: heroError } = await supabase
      .from("hero_content")
      .update({
        image_url: images.hero.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (heroError) {
      setMessage(`Gagal menyimpan gambar Hero: ${heroError.message}`);
      setSaving(false);
      return;
    }

    const { error: settingsError } = await supabase
      .from("site_images")
      .update({
        hero_lanjutan_url: images.hero_lanjutan.trim(),
        rocket_url: images.rocket.trim(),
        logo_url: images.logo.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (settingsError) {
      setMessage(
        `Gambar Hero tersimpan, tetapi pengaturan lainnya gagal: ${settingsError.message}`
      );
      setSaving(false);
      return;
    }

    setMessage("Semua pengaturan gambar berhasil disimpan.");
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="p-8">
        <p>Memuat pengaturan gambar...</p>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="p-8">
        
        <h1 className="text-2xl font-bold">Pengaturan Gambar</h1>
        <p className="mt-3 text-red-600">{message}</p>
      </main>
    );
  }

  return (   
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="mx-auto max-w-4xl">
            <div className="mb-6">
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-600 shadow-sm transition hover:bg-green-50 hover:text-green-700"
                    >
                    <span aria-hidden="true">←</span>
                    Kembali ke Dashboard Admin
                </Link>
            </div>

        <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Pengaturan Gambar
        </h1>
        <p className="mt-2 text-sm text-gray-600">
            Unggah gambar baru atau masukkan URL, lalu simpan pengaturan.
        </p>
        </div>


        
        {message && (
        <div
            className={`mb-6 rounded-lg border p-4 text-sm ${
            message.includes("berhasil")
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
        >
            {message}
        </div>
        )}


        <div className="space-y-6">
          {imageLabels.map((item) => (
            <section
              key={item.key}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {item.label}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {item.description}
              </p>

              <div className="mt-4 flex min-h-40 items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3">
                {images[item.key] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={images[item.key]}
                    alt={`Pratinjau ${item.label}`}
                    className="max-h-56 max-w-full object-contain"
                  />
                ) : (
                  <p className="text-sm text-gray-400">
                    Belum ada gambar
                  </p>
                )}
              </div>

              <label className="mt-4 block text-sm font-medium text-gray-700">
                URL gambar
                <input
                  type="url"
                  value={images[item.key]}
                  onChange={(event) =>
                    updateImage(item.key, event.target.value)
                  }
                  placeholder="https://contoh.com/gambar.png"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </label>

              <div className="mt-4">
                <label className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  {uploading === item.key
                    ? "Mengunggah..."
                    : "Pilih gambar dari komputer"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading !== null}
                    onChange={(event) => uploadImage(item.key, event)}
                  />
                </label>
                <p className="mt-2 text-xs text-gray-500">
                  Format gambar yang didukung mengikuti browser. Maksimal 5 MB.
                </p>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={saveSettings}
            disabled={saving || uploading !== null}
            className="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Lihat Website
          </a>
        </div>
      </div>
    </main>
  );
}
