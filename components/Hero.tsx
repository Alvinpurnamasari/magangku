
import { createClient } from "@/lib/supabase/server";

export default async function Hero() {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hero_content")
    .select("title, description, secondary_description, image_url")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Gagal mengambil data Hero:", error.message);
  }

  const title = data?.title || "Ayo Magang di sini!";
  const description =
    data?.description ||
    "Kamu Siswa SMK / Mahasiswa? Cari tempat PKL, Magang, Prakerin, OJT atau Praktik Kerja secara basic online? Pas banget ini!";
  const secondaryDescription =
    data?.secondary_description ||
    "Dimasa pandemi ini, kamu tetap bisa magang loh! Mau tau lebih lanjut? Yuk simak dibawah ini.";
  const heroImage =
    data?.image_url ||
    "https://1.bp.blogspot.com/-NZze-AW4PlQ/X3Q8etmLWLI/AAAAAAAADzI/gX__kIgI7FYNTORFOMvn7psq5tzmMQ8PwCLcBGAsYHQ/s1600/background-magangku.png";

  return (
    <section id="beranda" className="scroll-mt-[76px]">
      <div className="mx-auto grid min-h-[450px] max-w-[1200px] items-center gap-8 px-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-10 lg:py-6">
        <div className="relative z-10">
          <h1 className="mb-6 whitespace-pre-line text-[42px] font-extrabold leading-[1.35] text-[#ff941c] sm:text-[48px] md:text-[54px]">
            {title}
          </h1>

          <p className="max-w-[560px] whitespace-pre-line text-[17px] font-bold leading-[1.45] text-[#454545]">
            {description}
          </p>

          <p className="mt-5 max-w-[560px] whitespace-pre-line text-[17px] font-bold leading-[1.45] text-[#454545]">
            {secondaryDescription}
          </p>
        </div>

        <div className="mx-auto w-full max-w-[430px]">
          <img
            src={heroImage}
            alt="Peserta Magangku sedang belajar dan bekerja bersama"
            className="h-auto w-full"
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-7 w-full rounded-t-[50%] bg-white" />
    </section>
  );
}