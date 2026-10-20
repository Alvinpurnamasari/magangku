
"use client";

import { useEffect, useState } from "react";
import {
  Wifi,
  ClipboardList,
  Mail,
  UserRoundCheck,
  Handshake,
  ShieldCheck,
  BookOpen,
  Laptop,
  Heart,
  BriefcaseBusiness,
  Trash2,
  Plus,
  Save,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase";

const ADMIN_UID = "eff9b7ee-bd27-48b2-9609-4d7f1885325c";

const iconOptions: { name: string; label: string; Icon: LucideIcon }[] = [
  { name: "Wifi", label: "Wi-Fi", Icon: Wifi },
  { name: "ClipboardList", label: "Pendaftaran", Icon: ClipboardList },
  { name: "Mail", label: "Email", Icon: Mail },
  { name: "UserRoundCheck", label: "Pengguna", Icon: UserRoundCheck },
  { name: "Handshake", label: "Kerja sama", Icon: Handshake },
  { name: "ShieldCheck", label: "Keamanan", Icon: ShieldCheck },
  { name: "BookOpen", label: "Buku", Icon: BookOpen },
  { name: "Laptop", label: "Laptop", Icon: Laptop },
  { name: "Heart", label: "Hati", Icon: Heart },
  { name: "BriefcaseBusiness", label: "Pekerjaan", Icon: BriefcaseBusiness },
];

type Requirement = {
  text: string;
  icon: string;
};

const defaultRequirements: Requirement[] = [
  { text: "Memiliki Koneksi Internet Sendiri", icon: "Wifi" },
  { text: "Daftarkan diri melalui WA magangku.com", icon: "ClipboardList" },
  {
    text: "Mengumpulkan surat pengantar dari kampus/sekolah melalui email",
    icon: "Mail",
  },
  {
    text: "Memiliki Niat positif mencari skill & pengalaman selama magang berjalan",
    icon: "UserRoundCheck",
  },
  {
    text: "Mau latihan hidup mandiri. Jadi lulus dari magang sudah siap hidup mandiri",
    icon: "Handshake",
  },
  {
    text: "Mau menjaga baik nama perusahaan, kampus/sekolah dan diri sendiri",
    icon: "ShieldCheck",
  },
];

function normalizeItems(items: unknown): Requirement[] {
  if (!Array.isArray(items)) return defaultRequirements;

  return items.map((item, index) => {
    if (typeof item === "string") {
      return {
        text: item,
        icon: defaultRequirements[index]?.icon ?? "BookOpen",
      };
    }

    if (item && typeof item === "object" && "text" in item) {
      const value = item as { text?: unknown; icon?: unknown };

      return {
        text: typeof value.text === "string" ? value.text : "",
        icon:
          typeof value.icon === "string" &&
          iconOptions.some((option) => option.name === value.icon)
            ? value.icon
            : defaultRequirements[index]?.icon ?? "BookOpen",
      };
    }

    return { text: "", icon: "BookOpen" };
  });
}

export default function AdminSyaratPage() {
  const [items, setItems] = useState<Requirement[]>(defaultRequirements);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const supabase = createClient();

  useEffect(() => {
    async function loadItems() {
      const { data: authData } = await supabase.auth.getUser();

      if (authData.user?.id !== ADMIN_UID) {
        setMessage("Akses ditolak. Silakan login menggunakan akun admin.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("requirements_content")
        .select("items")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        setMessage("Gagal mengambil data: " + error.message);
      } else if (data?.items) {
        setItems(normalizeItems(data.items));
      }

      setLoading(false);
    }

    loadItems();
  }, []);

  function updateItem(
    index: number,
    field: "text" | "icon",
    value: string
  ) {
    setItems((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      { text: "", icon: "BookOpen" },
    ]);
  }

  function deleteItem(index: number) {
    setItems((current) => current.filter((_, i) => i !== index));
  }

  async function saveItems() {
    setMessage("");

    const { data: authData } = await supabase.auth.getUser();

    if (authData.user?.id !== ADMIN_UID) {
      setMessage("Akses ditolak. Silakan login sebagai admin.");
      return;
    }

    if (items.some((item) => !item.text.trim())) {
      setMessage("Isi teks semua syarat terlebih dahulu.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("requirements_content")
      .update({
        items: items.map((item) => ({
          text: item.text.trim(),
          icon: item.icon,
        })),
      })
      .eq("id", 1);

    setSaving(false);

    if (error) {
      setMessage("Gagal menyimpan: " + error.message);
      return;
    }

    setMessage("Syarat dan ikon berhasil disimpan.");
  }

  if (loading) {
    return <div className="p-8">Memuat data syarat...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Pengaturan Syarat & Ketentuan
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Ubah teks, pilih ikon, tambah, atau hapus syarat.
          </p>
        </div>

        {items.map((item, index) => {
          const selectedIcon =
            iconOptions.find((option) => option.name === item.icon) ??
            iconOptions[6];
          const Icon = selectedIcon.Icon;
          const color = index % 2 === 0 ? "#39bd78" : "#ff941c";

          return (
            <div
              key={index}
              className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-bold text-gray-800">
                  Syarat {index + 1}
                </h2>

                <button
                  type="button"
                  onClick={() => deleteItem(index)}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Hapus
                </button>
              </div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Teks syarat
              </label>
              <textarea
                value={item.text}
                onChange={(event) =>
                  updateItem(index, "text", event.target.value)
                }
                rows={2}
                placeholder="Masukkan teks syarat..."
                className="mb-4 w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Pilih ikon
              </label>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map(({ name, label, Icon: OptionIcon }) => {
                  const selected = item.icon === name;

                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => updateItem(index, "icon", name)}
                      title={label}
                      className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 transition ${
                        selected
                          ? "border-gray-900 ring-2 ring-gray-200"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      style={{
                        backgroundColor: selected ? color : "#ffffff",
                        color: selected ? "#ffffff" : "#374151",
                      }}
                      aria-label={`Pilih ikon ${label}`}
                      aria-pressed={selected}
                    >
                      <OptionIcon size={22} />
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-black"
                  style={{ backgroundColor: color }}
                >
                  <Icon size={26} color="white" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-500">
                    Pratinjau ikon
                  </p>
                  <p className="break-words text-sm font-bold text-gray-800">
                    {item.text || "Teks syarat akan muncul di sini"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 rounded-lg border border-green-600 bg-white px-4 py-3 font-bold text-green-700 hover:bg-green-50"
          >
            <Plus size={18} />
            Tambah Syarat
          </button>

          <button
            type="button"
            onClick={saveItems}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

        {message && (
          <p
            className={`mt-4 rounded-lg p-3 text-sm font-semibold ${
              message.includes("berhasil")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
