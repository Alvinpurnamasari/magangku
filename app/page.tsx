
import { Suspense } from "react";
import Header from "@/components/Header";
import Hero from "../components/Hero";
import HeroLanjutan from "../components/HeroLanjutan";
import SyaratKetentuan from "../components/SyaratKetentuan";
import FormasiMagang from "../components/FormasiMagang";
import Fasilitas from "../components/Fasilitas";
import Footer from "../components/Footer";
import FreeBadge from "../components/FreeBadge";

const WHATSAPP_URL = "https://wa.link/y23pe4";

export default function Home() {
  return (
    <main className="bg-white pt-[76px] text-[#343434]">
      <Suspense
        fallback={
          <section className="min-h-[450px] bg-[#f8fffa]" />
        }
      >
        <Header/>
        <Hero />
      </Suspense>

      <HeroLanjutan />
      <SyaratKetentuan />

      <FormasiMagang whatsappUrl={WHATSAPP_URL} />

      <Fasilitas />
      <Footer />
      <FreeBadge />
    </main>
  );
}
