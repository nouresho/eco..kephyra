import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#49372D] px-6 py-10 text-[#F3EFE7] md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center">

        {/* LOGO */}
        <Link
          href="/"
          className="block transition-transform duration-300 hover:-translate-y-1"
        >
          <img
            src="/images/logo.png"
            alt="ECO KEPHYRA"
            className="h-auto w-[120px] object-contain md:w-[145px]"
          />
        </Link>


        {/* SOCIAL ICONS */}
        <div className="mt-8 flex items-center gap-4">

          {/* ========================= */}
          {/* INSTAGRAM */}
          {/* ========================= */}

          <a
            href="https://www.instagram.com/eco.kephyra?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="
              group
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-[#F3EFE7]/25
              text-[#F3EFE7]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#B9DCEF]
              hover:bg-[#B9DCEF]
              hover:text-[#49372D]
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-[19px] w-[19px] transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <circle
                cx="12"
                cy="12"
                r="4"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
              />
            </svg>
          </a>


          {/* ========================= */}
          {/* TIKTOK */}
          {/* ========================= */}

          <a
            href="https://www.tiktok.com/@eco_kephyra?_r=1&_t=ZS-99oQfjZ14Tq"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="
              group
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-[#F3EFE7]/25
              text-[#F3EFE7]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#B9DCEF]
              hover:bg-[#B9DCEF]
              hover:text-[#49372D]
            "
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="h-[19px] w-[19px] fill-current transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            >
              <path d="M14.4 3c.3 1.8 1.4 3.2 3 4 .8.4 1.7.6 2.6.6v3.2c-2 0-3.8-.6-5.5-1.8v6.5c0 3.3-2.7 5.9-6 5.9S2.5 18.7 2.5 15.5s2.7-5.9 6-5.9c.4 0 .8 0 1.2.1V13c-.4-.1-.8-.2-1.2-.2-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7V3h3.2Z" />
            </svg>
          </a>


          {/* ========================= */}
          {/* EMAIL / GMAIL */}
          {/* ========================= */}

          <a
            href="filioaltone@gmail.com"
            aria-label="Email ECO KEPHYRA"
            className="
              group
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-[#F3EFE7]/25
              text-[#F3EFE7]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#B9DCEF]
              hover:bg-[#B9DCEF]
              hover:text-[#49372D]
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-[20px] w-[20px] transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <path
                d="M4 7L12 13L20 7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

        </div>


        {/* BOTTOM */}
        <div className="mt-8 w-full border-t border-[#F3EFE7]/15 pt-5 text-center">
          <p className="text-[9px] uppercase tracking-[0.18em] text-[#DCCFC4]">
            © {new Date().getFullYear()} ECO KEPHYRA
          </p>
        </div>

      </div>
    </footer>
  );
}