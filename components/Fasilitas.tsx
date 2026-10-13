
function CloudFacility({
    text,
    color,
    shadow,
  }: {
    text: string;
    color: string;
    shadow: string;
  }) {
    const cloudPath =
      "M 45,155 C 20,151 12,130 22,108 C 4,88 19,59 43,56 C 47,30 75,20 96,34 C 111,8 145,12 158,34 C 181,18 210,29 216,51 C 245,48 263,69 258,91 C 279,109 267,137 247,145 C 239,170 211,180 190,166 C 170,187 137,184 122,165 C 98,181 70,174 62,157 Z";
  
    return (
      <div className="relative mx-auto w-full max-w-[300px]">
        <svg
          viewBox="0 0 290 205"
          className="block h-auto w-full"
          aria-hidden="true"
        >
          {/* Bayangan awan */}
          <path
            d={cloudPath}
            transform="translate(9 9)"
            fill={shadow}
            stroke="#303030"
            strokeWidth="5"
            strokeLinejoin="round"
          />
  
          {/* Bentuk utama awan */}
          <path
            d={cloudPath}
            fill={color}
            stroke="#303030"
            strokeWidth="5"
            strokeLinejoin="round"
          />
  
          {/* Titik dekorasi awan */}
          <circle cx="76" cy="68" r="3" fill={shadow} opacity=".65" />
          <circle cx="191" cy="59" r="3" fill={shadow} opacity=".65" />
          <circle cx="216" cy="126" r="3" fill={shadow} opacity=".65" />
          <circle cx="83" cy="143" r="3" fill={shadow} opacity=".65" />
        </svg>
  
        {/* Teks di dalam awan */}
        <div className="absolute inset-[20%_12%_18%] flex items-center justify-center px-2 text-center font-bold leading-[1.35] text-[#303044] [font-family:'Mali',cursive] text-[13px] sm:text-[14px]">
          {text}
        </div>
      </div>
    );
  }
  
  function RocketScene() {
    return (
      <svg
        viewBox="0 0 520 520"
        className="block h-auto w-full"
        role="img"
        aria-label="Ilustrasi tiga roket meluncur dari monitor komputer"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Lingkaran hijau di belakang */}
        <circle cx="260" cy="305" r="172" fill="#39bd78" />
  
        {/* Awan kiri monitor */}
        <g fill="#f4f4f4">
          <ellipse cx="82" cy="300" rx="35" ry="24" />
          <ellipse cx="105" cy="286" rx="30" ry="29" />
          <ellipse cx="132" cy="301" rx="40" ry="25" />
          <ellipse cx="105" cy="309" rx="42" ry="19" />
        </g>
  
        {/* Awan kanan monitor */}
        <g fill="#f4f4f4">
          <ellipse cx="388" cy="300" rx="35" ry="24" />
          <ellipse cx="415" cy="286" rx="30" ry="29" />
          <ellipse cx="442" cy="301" rx="40" ry="25" />
          <ellipse cx="415" cy="309" rx="42" ry="19" />
        </g>
  
        {/* Monitor */}
        <rect
          x="94"
          y="260"
          width="332"
          height="230"
          rx="13"
          fill="#303044"
        />
  
        {/* Area layar */}
        <rect
          x="106"
          y="272"
          width="308"
          height="181"
          fill="#f7f7f7"
        />
  
        {/* Pola diagonal gelap pada layar */}
        <path d="M106 272 H180 L106 348 Z" fill="#303044" />
        <path d="M210 272 H275 L106 441 V378 Z" fill="#303044" />
        <path d="M315 272 H380 L199 453 H134 Z" fill="#303044" />
        <path d="M414 272 V320 L281 453 H216 Z" fill="#303044" />
        <path d="M414 376 V423 L384 453 H337 Z" fill="#303044" />
  
        {/* Pantulan putih diagonal */}
        <path d="M180 272 H210 L106 376 V348 Z" fill="#ffffff" />
        <path d="M275 272 H315 L134 453 H106 V441 Z" fill="#ffffff" />
        <path d="M380 272 H414 L414 320 L281 453 H248 Z" fill="#ffffff" />
  
        {/* Awan di dalam layar */}
        <g fill="#e8e8e8">
          <ellipse cx="119" cy="411" rx="31" ry="18" />
          <ellipse cx="141" cy="399" rx="27" ry="23" />
          <ellipse cx="165" cy="413" rx="34" ry="17" />
  
          <ellipse cx="350" cy="420" rx="28" ry="17" />
          <ellipse cx="371" cy="408" rx="25" ry="22" />
          <ellipse cx="394" cy="419" rx="25" ry="16" />
        </g>
  
        {/* Bagian bawah monitor */}
        <rect x="106" y="453" width="308" height="16" fill="#f4f4f4" />
        <rect
          x="226"
          y="463"
          width="68"
          height="7"
          rx="3.5"
          fill="#303044"
        />
        <path d="M220 490 H300 V515 H220 Z" fill="#303044" />
        <path d="M190 515 H330 V523 H190 Z" fill="#303044" />
  
        {/* Roket kecil kiri */}
        <g transform="translate(174 188) scale(0.65)">
          {/* Api */}
          <path d="M-13 91 L0 128 L13 91 L0 104 Z" fill="#ff941c" />
  
          {/* Sirip kiri */}
          <path
            d="M-16 48 L-30 89 L-8 81 L0 61 Z"
            fill="#ff941c"
            stroke="#303044"
            strokeWidth="4"
          />
  
          {/* Sirip kanan */}
          <path
            d="M16 48 L30 89 L8 81 L0 61 Z"
            fill="#ff941c"
            stroke="#303044"
            strokeWidth="4"
          />
  
          {/* Badan roket */}
          <path
            d="M-17 49 Q-17 9 0 -10 Q17 9 17 49 L12 80 H-12 Z"
            fill="#f7f7f7"
            stroke="#303044"
            strokeWidth="4"
          />
  
          <path
            d="M-16 15 Q0 23 16 15 L17 23 Q0 31 -17 23 Z"
            fill="#e33d2e"
          />
  
          {/* Jendela roket */}
          <circle cx="0" cy="40" r="10" fill="#303044" />
          <circle cx="0" cy="40" r="6.5" fill="#42d7c4" />
  
          <path d="M-12 57 H12 V65 H-12 Z" fill="#ff941c" />
        </g>
  
        {/* Roket kecil kanan */}
        <g transform="translate(346 188) scale(0.65)">
          <path d="M-13 91 L0 128 L13 91 L0 104 Z" fill="#ff941c" />
  
          <path
            d="M-16 48 L-30 89 L-8 81 L0 61 Z"
            fill="#ff941c"
            stroke="#303044"
            strokeWidth="4"
          />
  
          <path
            d="M16 48 L30 89 L8 81 L0 61 Z"
            fill="#ff941c"
            stroke="#303044"
            strokeWidth="4"
          />
  
          <path
            d="M-17 49 Q-17 9 0 -10 Q17 9 17 49 L12 80 H-12 Z"
            fill="#f7f7f7"
            stroke="#303044"
            strokeWidth="4"
          />
  
          <path
            d="M-16 15 Q0 23 16 15 L17 23 Q0 31 -17 23 Z"
            fill="#e33d2e"
          />
  
          <circle cx="0" cy="40" r="10" fill="#303044" />
          <circle cx="0" cy="40" r="6.5" fill="#42d7c4" />
  
          <path d="M-12 57 H12 V65 H-12 Z" fill="#ff941c" />
        </g>
  
        {/* Api roket utama */}
        <path
          d="M240 204 L260 275 L280 204 L260 226 Z"
          fill="#ff941c"
        />
        <path
          d="M252 228 L260 264 L268 228 L260 239 Z"
          fill="#ffe7a8"
        />
  
        {/* Sirip kiri roket utama */}
        <path
          d="M239 132 L208 203 L244 191 L258 160 Z"
          fill="#ff941c"
          stroke="#303044"
          strokeWidth="5"
          strokeLinejoin="round"
        />
  
        {/* Sirip kanan roket utama */}
        <path
          d="M281 132 L312 203 L276 191 L262 160 Z"
          fill="#ff941c"
          stroke="#303044"
          strokeWidth="5"
          strokeLinejoin="round"
        />
  
        {/* Badan roket utama */}
        <path
          d="M232 133 Q232 67 260 34 Q288 67 288 133 L280 190 Q260 204 240 190 Z"
          fill="#f7f7f7"
          stroke="#303044"
          strokeWidth="5"
          strokeLinejoin="round"
        />
  
        {/* Ujung merah */}
        <path
          d="M260 34 Q238 62 235 81 Q260 94 285 81 Q282 62 260 34 Z"
          fill="#e33d2e"
        />
        <path
          d="M260 34 Q250 61 260 86 Q273 60 260 34 Z"
          fill="#ff6a45"
        />
  
        {/* Garis kepala roket */}
        <path
          d="M235 81 Q260 92 285 81 L288 94 Q260 106 232 94 Z"
          fill="#303044"
        />
        <path
          d="M233 94 Q260 105 287 94 L288 102 Q260 113 232 102 Z"
          fill="#ffffff"
        />
  
        {/* Jendela utama */}
        <circle cx="260" cy="121" r="25" fill="#303044" />
        <circle cx="260" cy="121" r="18" fill="#42d7c4" />
  
        <path
          d="M248 113 Q258 101 270 110"
          fill="none"
          stroke="#a2fff0"
          strokeWidth="4"
          strokeLinecap="round"
        />
  
        {/* Pita oranye */}
        <path d="M238 145 H282 V158 H238 Z" fill="#ff941c" />
      </svg>
    );
  }
  
  export default function Fasilitas() {
    return (
      <section
        id="fasilitas"
        className="px-5 pb-0 pt-8 md:px-10 md:pb-0 md:pt-10"
      >
        {/* Judul section */}
        <h2 className="mb-10 text-center text-[32px] font-extrabold text-[#ff941c] [font-family:'Mali',cursive] sm:mb-12 sm:text-[44px]">
          Fasilitas Yang didapat
        </h2>
  
        {/* Layout fasilitas: awan kiri, roket tengah, awan kanan */}
        <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-x-4 gap-y-5 md:grid-cols-[1fr_1.25fr_1fr] md:gap-x-5">
          {/* Kolom kiri */}
          <div className="flex flex-col justify-center gap-5 sm:flex-row md:flex-col md:gap-12">
            <CloudFacility
              text="Bimbingan dari asisten/staf kami 24 jam"
              color="#ff941c"
              shadow="#d86f12"
            />
  
            <CloudFacility
              text="Mendapat Surat rekomendasi yang akan dikirim ke alamat rumah"
              color="#39bd78"
              shadow="#287b50"
            />
          </div>
  
          {/* Ilustrasi roket di tengah */}
          <div className="mx-auto w-full max-w-[430px]">
            <RocketScene />
          </div>
  
          {/* Kolom kanan */}
          <div className="flex flex-col justify-center gap-5 sm:flex-row md:flex-col md:gap-12">
            <CloudFacility
              text="Mendapat sertifikat yang akan dikirim ke alamat rumah (bukan e-Sertifikat)"
              color="#39bd78"
              shadow="#287b50"
            />
  
            <CloudFacility
              text="Berkesempatan di rekrut menjadi bagian TIM perusahaan"
              color="#ff941c"
              shadow="#d86f12"
            />
          </div>
        </div>
  
        {/* Fasilitas kelima di bagian bawah */}
        <div className="mx-auto mt-6 max-w-[300px]">
          <CloudFacility
            text="Konsultasi Free Lifetime setelah magang selesai"
            color="#39bd78"
            shadow="#287b50"
          />
        </div>
      </section>
    );
  }
  