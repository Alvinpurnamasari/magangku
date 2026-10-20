
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function HeroLanjutan() {
  const [imageUrl, setImageUrl] = useState(
    "/magang-online-original.png"
  );

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function loadImage() {
      const { data, error } = await supabase
        .from("site_images")
        .select("hero_lanjutan_url")
        .eq("id", 1)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error(
          "Gagal mengambil gambar Hero Lanjutan:",
          error.message
        );
        return;
      }

      const url = data?.hero_lanjutan_url?.trim();

      if (url) {
        setImageUrl(url);
      }
    }

    loadImage();

    const channel = supabase
      .channel("hero-lanjutan-image-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_images",
          filter: "id=eq.1",
        },
        (payload) => {
          const url = (
            payload.new as { hero_lanjutan_url?: string }
          )?.hero_lanjutan_url?.trim();

          if (active && url) {
            setImageUrl(url);
          } else if (active) {
            setImageUrl("/magang-online-original.png");
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
    <section className="bg-white px-6 py-12 md:py-16">
      <div className="mx-auto max-w-[1100px]">
        <img
          src={imageUrl}
          alt="Ilustrasi kegiatan magang online"
          className="mx-auto h-auto w-full max-w-[850px] object-contain"
        />
      </div>
    </section>
  );
}
