
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const ADMIN_UID = "eff9b7ee-bd27-48b2-9609-4d7f1885325c";

export default function AdminFasilitasPage() {
  const router = useRouter();

  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadFacilities() {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();

      if (!active) return;

      if (authData.user?.id !== ADMIN_UID) {
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("facilities_content")
        .select("items")
        .eq("id", 1)
        .maybeSingle();

      if (!active) return;

      if (error) {
        setMessage("Gagal memuat fasilitas: " + error.message);
        setIsError(true);
      } else if (!data) {
        setMessage("Data fasilitas belum tersedia di Supabase.");
        setIsError(true);
      } else {
        setItems(
          Array.isArray(data.items)
            ? data.items.filter(
                (item: unknown): item is string =>
                  typeof item === "string"
              )
            : []
        );
      }

      setLoading(false);
    }

    loadFacilities();

    return () => {
      active = false;
    };
  }, [router]);

  async function saveItems(nextItems: string[]) {
    setSaving(true);
    setMessage("");

    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();

      if (authData.user?.id !== ADMIN_UID) {
        setMessage("Akses ditolak. Akun ini bukan admin.");
        setIsError(true);
        return false;
      }

      const { data, error } = await supabase
        .from("facilities_content")
        .update({
          items: nextItems,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1)
        .select("id")
        .maybeSingle();

      if (error) {
        setMessage("Gagal menyimpan: " + error.message);
        setIsError(true);
        return false;
      }

      if (!data) {
        setMessage(
          "Data tidak berubah. Periksa policy UPDATE dan UID admin."
        );
        setIsError(true);
        return false;
      }

      setItems(nextItems);
      setMessage("Perubahan fasilitas berhasil disimpan.");
      setIsError(false);
      return true;
    } catch {
      setMessage("Terjadi kesalahan saat menyimpan data.");
      setIsError(true);
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = newItem.trim();

    if (!value) {
      setMessage("Nama fasilitas tidak boleh kosong.");
      setIsError(true);
      return;
    }

    if (items.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setMessage("Fasilitas tersebut sudah ada.");
      setIsError(true);
      return;
    }

    if (await saveItems([...items, value])) {
      setNewItem("");
    }
  }

  async function handleEdit(index: number) {
    const value = editValue.trim();

    if (!value) {
      setMessage("Nama fasilitas tidak boleh kosong.");
      setIsError(true);
      return;
    }

    const nextItems = [...items];
    nextItems[index] = value;

    if (await saveItems(nextItems)) {
      setEditingIndex(null);
      setEditValue("");
    }
  }

  async function handleDelete(index: number) {
    if (!window.confirm(`Hapus fasilitas "${items[index]}"?`)) return;

    await saveItems(items.filter((_, i) => i !== index));
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        Memuat data fasilitas...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-600 shadow-sm transition hover:bg-green-50 hover:text-green-700"
        >
          <span aria-hidden="true">←</span>
          Kembali ke Dashboard Admin
        </Link>

        <h1 className="mt-4 text-2xl font-extrabold text-gray-800">
          Kelola Fasilitas
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Tambah, edit, atau hapus fasilitas yang didapat peserta magang.
        </p>

        {message && (
          <div
            role="status"
            aria-live="polite"
            className={`mt-5 rounded-lg border p-4 text-sm ${
              isError
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleAdd}
          className="mt-6 rounded-2xl border bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="mb-4 font-bold text-gray-800">
            Tambah Fasilitas
          </h2>

          <textarea
            required
            value={newItem}
            onChange={(event) => setNewItem(event.target.value)}
            placeholder="Contoh: Mendapat bimbingan dari mentor"
            rows={3}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-400"
          />

          <button
            type="submit"
            disabled={saving}
            className="mt-3 rounded-lg bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "+ Tambah Fasilitas"}
          </button>
        </form>

        <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 font-bold text-gray-800">
            Daftar Fasilitas ({items.length})
          </h2>

          {items.length === 0 ? (
            <p className="text-sm text-gray-500">
              Belum ada fasilitas. Silakan tambahkan fasilitas baru.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => {
                const orange = [0, 3].includes(index % 5);

                return (
                  <div
                    key={`${index}-${item}`}
                    className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
                      orange
                        ? "border-orange-200 bg-orange-50"
                        : "border-green-200 bg-green-50"
                    }`}
                  >
                    {editingIndex === index ? (
                      <div className="flex-1">
                        <textarea
                          autoFocus
                          value={editValue}
                          onChange={(event) =>
                            setEditValue(event.target.value)
                          }
                          rows={3}
                          className="w-full rounded-lg border bg-white px-3 py-2"
                        />

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleEdit(index)}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                          >
                            Simpan Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingIndex(null);
                              setEditValue("");
                            }}
                            className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                              orange
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="break-words text-sm font-bold text-gray-800">
                            {item}
                          </span>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => {
                              setEditingIndex(index);
                              setEditValue(item);
                              setMessage("");
                            }}
                            className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => handleDelete(index)}
                            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Hapus
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
