
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type ImageType = "hero_lanjutan" | "rocket" | "logo";

type SiteImageProps = {
  type: ImageType;
  fallbackSrc: string;
  alt: string;
  className?: string;
};

export default function SiteImage({
  type,
  fallbackSrc,
  alt,
  className = "",
}: SiteImageProps) {
  const [src, setSrc] = useState(fallbackSrc);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

   
async function loadImage() {
    const { data, error } = await supabase
      .from("site_images")
      .select("hero_lanjutan_url, rocket_url, logo_url")
      .eq("id", 1)
      .maybeSingle();
  
    if (!active) return;
  
    if (!error && data) {
      let imageUrl: string | null = null;
  
      if (type === "hero_lanjutan") {
        imageUrl = data.hero_lanjutan_url;
      } else if (type === "rocket") {
        imageUrl = data.rocket_url;
      } else if (type === "logo") {
        imageUrl = data.logo_url;
      }
  
      setSrc(imageUrl?.trim() || fallbackSrc);
    }
  }
  

    void loadImage();

    return () => {
      active = false;
    };
  }, [type, fallbackSrc]);

  
  // Jika URL gambar kosong, jangan tampilkan elemen img.
  if (!src?.trim()) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        if (src !== fallbackSrc) {
          setSrc(fallbackSrc);
        }
      }}
    />
  );
}

