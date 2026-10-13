
const heroImage =
  "https://1.bp.blogspot.com/-NZze-AW4PlQ/X3Q8etmLWLI/AAAAAAAADzI/gX__kIgI7FYNTORFOMvn7psq5tzmMQ8PwCLcBGAsYHQ/s1600/background-magangku.png";

export default function Hero() {
  return (
    <section className="relative bg-[#f8fffa]">
      <div className="mx-auto grid min-h-[450px] max-w-[1200px] items-center gap-8 px-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-10 lg:py-6">
        {/* Teks utama */}
        <div className="relative z-10">
          <h1 className="mb-6 text-[42px] font-extrabold leading-[1.35] text-[#ff941c] sm:text-[48px] md:text-[54px]">
            Ayo Magang
            <br />
            di sini!
          </h1>

          <p className="max-w-[560px] text-[17px] font-bold leading-[1.45] text-[#454545]">
            Kamu Siswa SMK / Mahasiswa? Cari tempat PKL, Magang,
            Prakerin, OJT atau Praktik Kerja secara basic online? Pas banget ini!
          </p>

          <p className="mt-5 max-w-[560px] text-[17px] font-bold leading-[1.45] text-[#454545]">
            Dimasa pandemi ini, kamu tetap bisa magang loh!
            <br />
            Mau tau lebih lanjut? Yuk simak dibawah ini.
          </p>
        </div>

        {/* Gambar Hero */}
        <div className="mx-auto w-full max-w-[430px]">
          <img
            src={heroImage}
            alt="Peserta Magangku sedang belajar dan bekerja bersama"
            className="h-auto w-full"
          />
        </div>
      </div>

      {/* Lengkungan putih di bagian bawah Hero */}
      <div className="absolute bottom-0 left-0 h-7 w-full rounded-t-[50%] bg-white" />
    </section>
  );
}
