
import Hero from "../components/Hero";
import HeroLanjutan from "../components/HeroLanjutan";
import SyaratKetentuan from "../components/SyaratKetentuan";
import FormasiMagang from "../components/FormasiMagang";
import Fasilitas from "../components/Fasilitas";
import Footer from "../components/Footer";
import FreeBadge from "../components/FreeBadge";

const WHATSAPP_URL = "https://wa.link/y23pe4";

const positions = [
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

export default function Home() {
  return (
    <main className="overflow-hidden bg-white text-[#343434]">
      <Hero />
      <HeroLanjutan />
      <SyaratKetentuan />

      <FormasiMagang
        positions={positions}
        whatsappUrl={WHATSAPP_URL}
      />

      <Fasilitas />

      <Footer />

      <FreeBadge />
    </main>
  );
}
