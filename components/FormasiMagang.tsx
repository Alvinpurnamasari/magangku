
type FormasiMagangProps = {
    positions: string[];
    whatsappUrl: string;
  };
  
  export default function FormasiMagang({
    positions,
    whatsappUrl,
  }: FormasiMagangProps) {
    return (
      <section
        id="formasi"
        className="px-5 pb-12 pt-10 md:px-10 md:pb-14 md:pt-12"
      >
        <h2 className="mb-3 text-center text-[32px] font-extrabold leading-tight text-[#ff941c] sm:text-[44px]">
          Formasi Magang Online
        </h2>
  
        <p className="mb-10 text-center text-[18px] font-bold text-[#303044] sm:mb-12 sm:text-[22px]">
          Untuk Kamu
        </p>
  
        <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {positions.map((position, index) => (
            <a
              key={position}
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-[92px] flex-col items-center justify-center rounded-2xl border-2 border-[#303044] bg-white px-3 py-4 text-center shadow-[3px_4px_0_#303044] transition-all duration-200 hover:-translate-y-1 hover:border-[#39bd78] hover:bg-[#edfff4] hover:shadow-[3px_5px_0_#258151]"
              
            >
              <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#edfff4] text-sm font-extrabold text-[#258151] transition-colors group-hover:bg-[#39bd78] group-hover:text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
  
              <span className="text-[13px] font-extrabold leading-snug text-[#303044] sm:text-[14px]">
                {position}
              </span>
            </a>
          ))}
        </div>
      </section>
    );
  }
  