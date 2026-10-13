
"use client";

export default function FreeBadge() {
  const goToFooter = () => {
    document.getElementById("footer")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <button
      type="button"
      aria-label="Lihat informasi pendaftaran di footer"
      onClick={goToFooter}
      className="fixed bottom-7 right-5 z-50 flex h-[145px] w-[145px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 animate-free-bounce"
    >
      {/* Bingkai luar */}
      <div className="absolute inset-2 rotate-45 rounded-[25px] border-[7px] border-[#ffbd42] bg-[#17365f] shadow-xl" />

      {/* Bagian dalam */}
      <div className="absolute inset-5 rotate-45 rounded-[18px] border-[5px] border-[#303030] bg-[#39bd78]" />

      {/* Tulisan FREE */}
      <div className="relative mt-[-12px] text-center text-white">
        <p className="text-[30px] font-extrabold">FREE</p>
      </div>

      {/* Pita merah muda */}
      <div className="absolute bottom-4 left-[-3px] right-[-3px] rounded-full bg-[#ef777d] px-2 py-2 text-center text-[12px] font-extrabold text-white shadow">
        100% TANPA BIAYA
      </div>
    </button>
  );
}
