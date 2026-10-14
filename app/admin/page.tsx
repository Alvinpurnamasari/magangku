
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const menu = [
  {
    title: "Hero & Banner",
    description: "Kelola judul, deskripsi, dan gambar utama website.",
    href: "/admin/hero",
  },
  {
    title: "Syarat & Ketentuan",
    description: "Kelola informasi persyaratan peserta magang.",
    href: "/admin/syarat",
  },
  {
    title: "Formasi Magang",
    description: "Kelola daftar posisi atau formasi magang.",
    href: "/admin/formasi",
  },
  {
    title: "Fasilitas",
    description: "Kelola informasi fasilitas program magang.",
    href: "/admin/fasilitas",
  },
  {
    title: "Kontak & Pendaftaran",
    description: "Kelola nomor WhatsApp dan informasi pendaftaran.",
    href: "/admin/pengaturan",
  },
];


export default async function AdminDashboardPage() {
    const supabase = await createClient();
  
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
  
    if (error || !user) {
      redirect("/admin/login");
    }
  
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-green-600">
              MAGANGKU
            </p>
            <h1 className="mt-1 text-xl font-extrabold text-gray-800 md:text-2xl">
              Dashboard Admin
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Lihat Website
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-400 p-7 text-white">
          <p className="text-sm font-medium text-green-50">
            Panel Pengelolaan Website
          </p>
          <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
            Selamat Datang di Admin Magangku!
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-green-50">
            Kelola konten landing page Magangku melalui menu berikut.
          </p>
        </div>

        <h2 className="mb-5 text-lg font-bold text-gray-800">
          Menu Pengelolaan
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {menu.map((item, index) => (
            <article
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 font-bold text-green-600">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="font-bold text-gray-800">
                {item.title}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                {item.description}
              </p>

              <Link
                href={item.href}
                className="mt-5 inline-flex font-semibold text-green-600 hover:text-green-700"
              >
                Kelola menu →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}