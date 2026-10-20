
"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import SiteImage from "@/components/SiteImage";

const menuItems = [
  { label: "Syarat", href: "#syarat" },
  { label: "Formasi", href: "#formasi" },
  { label: "Fasilitas", href: "#fasilitas" },
  { label: "Kontak", href: "#footer" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) return;

    event.preventDefault();

    const targetId = href.slice(1);

    // Beranda selalu kembali ke bagian paling atas halaman.
    if (targetId === "beranda") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      window.history.replaceState(null, "", "#beranda");
      setMenuOpen(false);
      return;
    }

    // Navigasi ke bagian yang dituju.
    const target = document.getElementById(targetId);

    if (target) {
      const headerHeight = 76;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth",
      });

      window.history.replaceState(null, "", href);
    }

    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-6 px-5 py-3 md:px-8">
        {/* Logo */}
        <Link
          href="/#beranda"
          className="flex shrink-0 items-center"
          aria-label="Magangku - Beranda"
          onClick={(event) => handleNavigate(event, "#beranda")}
        >
          <SiteImage
            type="logo"
            fallbackSrc="/logo-magangku.png"
            alt="Logo Magangku"
            className="h-11 w-auto max-w-[220px] object-contain"
          />
        </Link>

        {/* Navigasi desktop */}
        <nav
          className="hidden items-center gap-6 lg:flex xl:gap-8"
          aria-label="Navigasi utama"
        >
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(event) =>
                handleNavigate(event, item.href)
              }
              className="whitespace-nowrap text-sm font-semibold text-gray-700 transition-colors hover:text-green-600"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Tombol menu HP */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-800 transition hover:bg-green-50 lg:hidden"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigasi mobile */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-5 pb-4 pt-3 shadow-lg lg:hidden">
          <nav
            className="mx-auto flex max-w-7xl flex-col"
            aria-label="Navigasi mobile"
          >
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(event) =>
                  handleNavigate(event, item.href)
                }
                className="rounded-lg px-4 py-3 font-semibold text-gray-700 transition hover:bg-green-50 hover:text-green-700"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
