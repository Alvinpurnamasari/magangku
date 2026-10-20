
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type FormasiMagangProps = {
  whatsappUrl: string;
};

const defaultPositions = [
  "UI/UX Designer",
  "SEO",
  "Human Resource",
  "Social Media Specialist",
  "Editor Foto / Editor Video",
  "Content Writer",
  "Digital Marketing",
  "Desainer Grafis",
  "Content Planner",
  "Tiktok Creator",
  "Marcomm / Public Relation",
];


const colorPattern = [
  "green",  // 1. Hijau
  "orange", // 2. Oranye
  "green",  // 3. Hijau
  "orange", // 4. Oranye
  "orange", // 5. Oranye
  "green",  // 6. Hijau
  "orange", // 7. Oranye
  "green",  // 8. Hijau
];


export default function FormasiMagang({
  whatsappUrl,
}: FormasiMagangProps) {
  const [positions, setPositions] = useState<string[]>(defaultPositions);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function loadPositions() {
      const { data, error } = await supabase
        .from("internship_positions")
        .select("items")
        .eq("id", 1)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error("Gagal mengambil formasi:", error.message);
        return;
      }

      if (
        data &&
        Array.isArray(data.items) &&
        data.items.every((item: unknown) => typeof item === "string")
      ) {
        setPositions(data.items);
      }
    }

    loadPositions();

    const channel = supabase
      .channel("internship-positions-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "internship_positions",
          filter: "id=eq.1",
        },
        (payload) => {
          const items = payload.new.items;

          if (
            active &&
            Array.isArray(items) &&
            items.every((item: unknown) => typeof item === "string")
          ) {
            setPositions(items);
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
      id="formasi"
      className="px-5 pb-14 pt-10 md:px-10 md:pb-16 md:pt-12"
    >
      <h2 className="mb-3 text-center text-[32px] font-extrabold leading-tight text-[#ff941c] sm:text-[44px]">
        Formasi Magang Online
      </h2>

      <p className="mb-10 text-center text-[18px] font-bold text-[#303044] sm:mb-12 sm:text-[22px]">
        Untuk Kamu
      </p>

      <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {positions.map((position, index) => {
          const color = colorPattern[index % colorPattern.length];
          const isOrange = color === "orange";

          return (
            <a
              key={`${index}-${position}`}
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className={`group flex min-h-[112px] flex-col items-center justify-center rounded-2xl border px-3 py-5 text-center shadow-[0_2px_5px_rgba(48,48,68,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                isOrange
                  ? "border-[#ffd5a5] bg-[#fff3e5] hover:border-[#ff941c] hover:bg-[#ffe8cc]"
                  : "border-[#bce9cd] bg-[#e9f9ef] hover:border-[#39bd78] hover:bg-[#d7f4e2]"
              }`}
            >
              <span
                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-sm transition-transform duration-200 group-hover:scale-105 ${
                  isOrange ? "bg-[#ff941c]" : "bg-[#39bd78]"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="text-[13px] font-bold leading-snug text-[#303044] sm:text-[14px]">
                {position}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
