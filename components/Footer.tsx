"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import SiteImage from "@/components/SiteImage";

type ContactSettings = {
  whatsapp_number: string;
  whatsapp_url: string;
  registration_url: string;
  powered_by: string;
};

const defaultContact: ContactSettings = {
  whatsapp_number: "0818 1818 1013",
  whatsapp_url: "https://wa.link/y23pe4",
  registration_url: "https://bit.ly/form_magangku",
  powered_by: "www.Republikweb.net",
};
export default function Footer() {
  const [contact, setContact] =

  useState<ContactSettings>(defaultContact);

  const whatsappUrl =
  contact.whatsapp_number.trim() !== ""
    ? `https://wa.me/${contact.whatsapp_number
        .replace(/\D/g, "")
        .replace(/^0/, "62")}`
    : contact.whatsapp_url;

useEffect(() => {
  let active = true;
  const supabase = createClient();

  async function loadContact() {
    const { data, error } = await supabase
      .from("contact_content")
      .select(
        "whatsapp_number, whatsapp_url, registration_url, powered_by"
      )
      .eq("id", 1)
      .maybeSingle();

    if (!active || error || !data) return;

    setContact({
      whatsapp_number:
        data.whatsapp_number ?? defaultContact.whatsapp_number,
      whatsapp_url:
        data.whatsapp_url ?? defaultContact.whatsapp_url,
      registration_url:
        data.registration_url ?? defaultContact.registration_url,
      powered_by:
        data.powered_by ?? defaultContact.powered_by,
    });
  }

  loadContact();

  const channel = supabase
    .channel("footer-contact-content")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "contact_content",
        filter: "id=eq.1",
      },
      (payload) => {
        if (!active) return;

        const data = payload.new as Partial<ContactSettings>;

        setContact({
          whatsapp_number:
            data.whatsapp_number ?? defaultContact.whatsapp_number,
          whatsapp_url:
            data.whatsapp_url ?? defaultContact.whatsapp_url,
          registration_url:
            data.registration_url ?? defaultContact.registration_url,
          powered_by:
            data.powered_by ?? defaultContact.powered_by,
        });
      }
    )
    .subscribe();

  return () => {
    active = false;
    supabase.removeChannel(channel);
  };
}, []);
    return (
      <footer
        id="footer"
        className="relative isolate overflow-hidden bg-[#edfff4] px-5 pb-20 pt-28 md:min-h-[650px] md:pb-24 md:pt-40"
      >
        {/* Gelombang putih bagian atas */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[220px] w-full"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0 H1440 V125 C1320 95 1230 45 1110 45 C970 45 900 105 760 125 C610 148 505 100 375 105 C250 110 165 165 85 160 C45 158 20 145 0 135 Z"
            fill="#ffffff"
          />
        </svg>
  
        {/* Ornamen background footer */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
          viewBox="0 0 1440 650"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <g fill="#d9ffea" opacity="0.78">
            <path d="M-120 30 C-45 45 10 65 75 115 C145 170 210 155 285 180 C365 205 430 250 475 310 C510 357 485 405 425 430 C360 458 300 430 235 405 C165 378 110 400 45 375 C-20 350 -75 305 -120 260 Z" />
  
            <path d="M-100 400 C-20 370 45 410 90 455 C135 500 185 525 200 575 C215 625 175 675 115 700 L-100 700 Z" />
  
            <path d="M690 210 C730 165 785 170 820 205 C855 240 875 280 855 325 C835 370 795 405 755 420 C715 435 675 405 660 365 C640 315 655 250 690 210 Z" />
  
            <path d="M1040 15 C1110 -15 1195 5 1265 40 C1340 75 1400 115 1480 150 L1480 440 C1410 410 1350 360 1305 305 C1260 250 1230 195 1170 150 C1120 112 1075 85 1040 15 Z" />
  
            <path d="M1080 405 C1115 365 1165 370 1200 405 C1245 450 1255 505 1225 560 C1200 605 1150 650 1095 665 C1045 680 1005 645 1005 595 C1005 545 1030 470 1080 405 Z" />
          </g>
  
          {/* Garis lengkung */}
          <g
            stroke="#caffdf"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.9"
          >
            <path d="M15 300 C65 250 100 270 145 295 C190 320 225 275 265 235 C305 195 340 225 380 265" />
            <path d="M320 360 C355 315 390 350 425 325 C465 295 495 250 535 280" />
            <path d="M990 115 C1035 55 1080 90 1115 155 C1150 225 1195 265 1245 225 C1295 185 1330 155 1380 205" />
            <path d="M1080 535 C1125 475 1170 520 1215 485 C1265 445 1310 420 1360 455 C1395 480 1420 465 1450 440" />
            <path d="M285 625 C325 575 365 600 405 635 C435 660 465 665 485 690" />
            <path d="M300 90 C345 40 390 70 415 115" />
  
            <circle cx="60" cy="190" r="17" />
            <circle cx="330" cy="90" r="8" />
            <circle cx="565" cy="120" r="7" />
            <circle cx="965" cy="95" r="8" />
            <circle cx="1275" cy="340" r="11" />
            <circle cx="305" cy="520" r="7" />
            <circle cx="880" cy="570" r="9" />
          </g>
  
          {/* Bintang dan titik kecil */}
          <g fill="#c4ffdf">
            <path d="M395 95 l7 14 14 7 -14 7 -7 14 -7 -14 -14 -7 14 -7Z" />
            <path d="M645 320 l5 10 10 5 -10 5 -5 10 -5 -10 -10 -5 10 -5Z" />
            <path d="M1190 110 l6 12 12 6 -12 6 -6 12 -6 -12 -12 -6 12 -6Z" />
            <path d="M1380 590 l7 14 14 7 -14 7 -7 14 -7 -14 -14 -7 14 -7Z" />
            <circle cx="250" cy="155" r="11" />
            <circle cx="1095" cy="290" r="8" />
            <circle cx="850" cy="610" r="7" />
          </g>
        </svg>
  
        {/* Konten footer */}
        <div className="font-magangku relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <h2 className="mb-5 text-[25px] font-bold text-[#30303b] sm:text-[28px]">
            More info
          </h2>
  
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mb-16 text-[30px] font-extrabold transition-colors hover:text-[#39bd78] sm:text-[36px]"
          >
            {contact.whatsapp_number}
          </a>
  
          <p className="mb-9 text-[20px] font-bold sm:text-[24px]">
            powered by {contact.powered_by}
          </p>
  
       
          {/* Tombol pendaftaran */}
          <a
            href={
              contact.registration_url?.trim() ||
              "https://bit.ly/form_magangku"
            }
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Form pendaftaran Magangku"
            className="group relative inline-flex h-[62px] w-[235px] items-center justify-center transition-transform duration-200 hover:-translate-y-1"
          >
            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 240 65"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M17 9 Q8 5 7 17 L9 44 Q9 57 24 57 L216 59 Q233 57 232 43 L230 18 Q228 7 215 9 L29 7 Z"
                fill="#258151"
                stroke="#303030"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M14 5 Q8 4 9 16 L11 41 Q11 52 24 52 L211 53 Q225 52 225 39 L223 15 Q222 5 210 6 L29 5 Z"
                fill="#39bd78"
                stroke="#303030"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <g
                stroke="#23794d"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 9 l5 4" />
                <path d="M28 7 l4 2" />
                <path d="M38 7 l3 1" />
                <path d="M214 9 l4 4" />
                <path d="M220 17 l1 4" />
                <path d="M17 43 l4 4" />
                <path d="M24 49 l4 1" />
                <path d="M204 50 l5 1" />
                <path d="M216 45 l4 -3" />
              </g>
            </svg>

            <span className="relative z-10 whitespace-nowrap font-magangku text-[14px] font-bold text-white sm:text-[15px]">
              FORM PENDAFTARAN
            </span>
          </a>

            
          <div className="mt-16 text-center text-[14px] font-bold">
            <div className="flex justify-center">
              <SiteImage
                type="logo"
                fallbackSrc=""
                alt="Logo Magangku"
                className="h-auto max-h-16 max-w-[180px] object-contain"
              />
            </div>
          </div>
        </div>
      </footer>
    );
  }
  