
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

const defaultRequirements = [
  "Memiliki Koneksi Internet Sendiri",
  "Daftarkan diri melalui WA magangku.com",
  "Mengumpulkan surat pengantar dari kampus/sekolah melalui email",
  "Memiliki Niat positif mencari skill & pengalaman selama magang berjalan",
  "Mau latihan hidup mandiri. Jadi lulus dari magang sudah siap hidup mandiri",
  "Mau menjaga baik nama perusahaan, kampus/sekolah dan diri sendiri",
];

export default function SyaratKetentuan() {
  const [requirements, setRequirements] =
    useState<string[]>(defaultRequirements);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function loadRequirements() {
      const { data, error } = await supabase
        .from("requirements_content")
        .select("items")
        .eq("id", 1)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error("Gagal mengambil persyaratan:", error.message);
        return;
      }

      if (
        data &&
        Array.isArray(data.items) &&
        data.items.every((item: unknown) => typeof item === "string")
      ) {
        setRequirements(data.items);
      }
    }

    loadRequirements();

    // Memperbarui tampilan ketika data berubah di Supabase.
    const channel = supabase
      .channel("requirements-content-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "requirements_content",
          filter: "id=eq.1",
        },
        (payload) => {
          const items = payload.new.items;

          if (
            active &&
            Array.isArray(items) &&
            items.every((item: unknown) => typeof item === "string")
          ) {
            setRequirements(items);
          }
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section
      id="syarat"
      className="px-5 pb-16 pt-10 md:px-10 md:pb-20 md:pt-14"
    >
      <h2 className="mb-12 text-center text-[36px] font-extrabold text-[#ff941c] sm:text-[44px]">
        Syarat &amp; Ketentuan
      </h2>

      <div
        className="mx-auto grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2"
        style={{ width: "100%", maxWidth: "860px" }}
      >
        {requirements.map((text, index) => {
          const colorPattern = [
            "#39bd78", // 1. Hijau
            "#ff941c", // 2. Oranye
            "#ff941c", // 3. Oranye
            "#39bd78", // 4. Hijau
          ];
          
          const fill = colorPattern[index % colorPattern.length];

          return (
            <div
              key={`${index}-${text}`}
              className="flex min-w-0 items-center gap-3"
              style={{ minHeight: "104px" }}
            >
              {/* Kotak warna kecil bergaya coretan tangan */}
              <div
                className="relative shrink-0"
                style={{ width: "76px", height: "82px" }}
              >
                <svg
                  viewBox="0 0 90 90"
                  width="76"
                  height="82"
                  aria-hidden="true"
                >
                  <path
                    d="M8 7 C20 3 62 3 76 7 C84 10 85 23 84 42 L83 69 C82 80 74 84 59 84 L18 82 C7 80 5 72 5 58 L5 23 C5 14 5 9 8 7 Z"
                    fill={fill}
                    stroke="#111111"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M12 10 C25 6 63 7 75 10 C81 13 81 25 80 42 L79 67 C78 75 71 79 58 79 L20 78 C12 76 10 69 10 57 L10 24 C10 17 10 12 12 10 Z"
                    fill="none"
                    stroke="#111111"
                    strokeWidth="1"
                    opacity="0.65"
                  />

                  <path
                    d="M12 78 l5 5 M19 80 l4 4 M27 81 l3 3 M70 80 l4 3 M77 75 l4 3 M81 67 l3 3"
                    stroke="#111111"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />

                  <path
                    d="M17 18 l2 1 M28 13 l2 1 M65 17 l2 1 M19 32 l2 1 M72 30 l2 1 M16 58 l2 1 M68 65 l2 1"
                    stroke="#111111"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.35"
                  />
                </svg>
              </div>

              {/* Kartu teks */}
              <div
                className="relative min-w-0 flex-1"
                style={{ height: "104px" }}
              >
                <svg
                  viewBox="0 0 310 104"
                  preserveAspectRatio="none"
                  width="100%"
                  height="104"
                  className="absolute left-0 top-0"
                  aria-hidden="true"
                >
                  <path
                    d="M12 8 C35 2 81 4 112 5 C160 5 214 2 274 8 C294 10 302 14 304 27 L306 73 C305 88 296 94 277 96 C215 100 164 96 116 98 L34 97 C15 96 8 91 7 77 L6 29 C6 17 7 11 12 8 Z"
                    fill="#ffffff"
                    stroke="#111111"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M21 17 C40 10 75 13 107 13 C145 13 183 10 211 14 C228 16 228 25 234 30 C249 40 278 38 292 44 C300 48 300 67 296 78 C291 89 277 90 256 91 L41 91 C23 90 14 84 13 69 L13 34 C13 25 15 20 21 17 Z"
                    fill={fill}
                  />
                </svg>

                <div
                  className="absolute inset-0 flex items-center text-white"
                  style={{
                    padding: "14px 20px",
                    fontSize: "14px",
                    fontWeight: 800,
                    lineHeight: 1.25,
                    overflowWrap: "break-word",
                  }}
                >
                  {text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
