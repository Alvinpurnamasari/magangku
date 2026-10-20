"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import SiteImage from "@/components/SiteImage";

function CloudFacility({
    text,
    color,
    shadow,
  }: {
    text: string;
    color: string;
    shadow: string;
  }) {
    const cloudPath =
      "M 45,155 C 20,151 12,130 22,108 C 4,88 19,59 43,56 C 47,30 75,20 96,34 C 111,8 145,12 158,34 C 181,18 210,29 216,51 C 245,48 263,69 258,91 C 279,109 267,137 247,145 C 239,170 211,180 190,166 C 170,187 137,184 122,165 C 98,181 70,174 62,157 Z";
  
    return (
      <div className="relative mx-auto w-full max-w-[300px] min-w-0">
        <svg
          viewBox="0 0 290 205"
          className="block h-auto w-full"
          aria-hidden="true"
        >
          {/* Bayangan awan */}
          <path
            d={cloudPath}
            transform="translate(9 9)"
            fill={shadow}
            stroke="#303030"
            strokeWidth="5"
            strokeLinejoin="round"
          />
  
          {/* Bentuk utama awan */}
          <path
            d={cloudPath}
            fill={color}
            stroke="#303030"
            strokeWidth="5"
            strokeLinejoin="round"
          />
  
          {/* Titik dekorasi awan */}
          <circle cx="76" cy="68" r="3" fill={shadow} opacity=".65" />
          <circle cx="191" cy="59" r="3" fill={shadow} opacity=".65" />
          <circle cx="216" cy="126" r="3" fill={shadow} opacity=".65" />
          <circle cx="83" cy="143" r="3" fill={shadow} opacity=".65" />
        </svg>
  
        {/* Teks di dalam awan */}
        <div className="absolute inset-[20%_12%_18%] flex items-center justify-center px-2 text-center font-bold leading-[1.35] text-[#303044] [font-family:'Mali',cursive] text-[13px] sm:text-[14px]">
          {text}
        </div>
      </div>
    );
  }

  
function RocketScene() {
  return (
    <div className="mx-auto flex h-[280px] w-full max-w-[300px] items-center justify-center overflow-hidden sm:h-[320px] sm:max-w-[340px] lg:h-[360px] lg:max-w-[380px]">
      <SiteImage
        type="rocket"
        fallbackSrc="/rocket.png"
        alt="Ilustrasi roket meluncur dari monitor komputer"
        className="block max-h-full max-w-full object-contain"
      />
    </div>
  );
}


  
  
const defaultFacilities = [
  "Bimbingan dari asisten/staf kami 24 jam",
  "Mendapat Surat rekomendasi yang akan dikirim ke alamat rumah",
  "Mendapat sertifikat yang akan dikirim ke alamat rumah (bukan e-Sertifikat)",
  "Berkesempatan di rekrut menjadi bagian TIM perusahaan",
  "Konsultasi Free Lifetime setelah magang selesai",
];


const greenColor = { color: "#39bd78", shadow: "#287b50" };
const orangeColor = { color: "#ff941c", shadow: "#d86f12" };

function createColorMap(items: string[]) {
  const map: Record<number, number> = {};

  items.forEach((_, index) => {
    // Indeks genap = oranye, indeks ganjil = hijau.
    map[index] = index % 2 === 0 ? 1 : 0;
  });

  return map;
}



export default function Fasilitas() {
  const [facilities, setFacilities] =
    useState<string[]>(defaultFacilities);
  const [randomColorMap, setRandomColorMap] = useState<Record<number, number>>({});

  useEffect(() => {
    setRandomColorMap(createColorMap(defaultFacilities));
    let active = true;
    const supabase = createClient();

    async function loadFacilities() {
      const { data, error } = await supabase
        .from("facilities_content")
        .select("items")
        .eq("id", 1)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error("Gagal mengambil fasilitas:", error.message);
        return;
      }

      if (
        data &&
        Array.isArray(data.items) &&
        data.items.every((item: unknown) => typeof item === "string")
      ) {
        setFacilities(data.items);
        setRandomColorMap(createColorMap(data.items));
      }
    }

    loadFacilities();

    const channel = supabase
      .channel("public-facilities-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "facilities_content",
          filter: "id=eq.1",
        },
        (payload) => {
          const items = payload.new.items;

          if (
            active &&
            Array.isArray(items) &&
            items.every((item: unknown) => typeof item === "string")
          ) {
            setFacilities(items);
            setRandomColorMap(createColorMap(items));
          }
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  
  function getFacilityColor(index: number) {
    const colorIndex = randomColorMap[index] ?? (index % 2 === 0 ? 1 : 0);
    return colorIndex === 1 ? orangeColor : greenColor;
  }


  function renderFacility(text: string, index: number) {
    const colors = getFacilityColor(index);

    return (
      <CloudFacility
        key={`${index}-${text}`}
        text={text}
        color={colors.color}
        shadow={colors.shadow}
      />
    );
  }

  return (
    <section
      id="fasilitas"
      className="px-5 pb-8 pt-8 md:px-10 md:pt-10"
    >
      <h2 className="mb-10 text-center text-[32px] font-extrabold text-[#ff941c] [font-family:'Mali',cursive] sm:mb-12 sm:text-[44px]">
        Fasilitas Yang didapat
      </h2>

      {/* Desktop: fasilitas mengelilingi roket dalam pola oval */}
      <div
        className="relative mx-auto hidden w-full max-w-[1350px] lg:block"
        style={{ height: `${Math.max(760, facilities.length * 105)}px` }}
      >
        {facilities.map((item, index) => {
          const angle = -90 + (index * 360) / facilities.length;
          const radians = (angle * Math.PI) / 180;
          const x = 50 + Math.cos(radians) * 37;
          const y = 50 + Math.sin(radians) * 39;

          return (
            <div
              key={`${index}-${item}`}
              className="absolute z-10 w-[clamp(210px,22vw,300px)] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {renderFacility(item, index)}
            </div>
          );
        })}

        {/* Ilustrasi roket tetap tepat di tengah lingkaran fasilitas */}
        <div className="absolute left-1/2 top-1/2 z-0 w-[min(36vw,430px)] -translate-x-1/2 -translate-y-1/2">
          <RocketScene />
        </div>
      </div>

      {/* Tampilan HP/tablet: susunan tetap rapi dan mudah dibaca */}
      <div className="mx-auto grid w-full max-w-[760px] grid-cols-1 items-center justify-items-center gap-x-6 gap-y-5 sm:grid-cols-2 lg:hidden">
        <div className="w-full max-w-[430px] sm:col-span-2">
          <RocketScene />
        </div>
        {facilities.map((item, index) => (
          <div
            key={`mobile-${index}-${item}`}
            className="w-full max-w-[300px]"
          >
            {renderFacility(item, index)}
          </div>
        ))}
      </div>
    </section>
  );
}
