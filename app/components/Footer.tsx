import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#49372D] px-6 py-10 text-[#F3EFE7] md:px-12">

      <div className="mx-auto flex max-w-7xl flex-col items-center">

        {/* LOGO */}
        <Link href="/" className="block">
          <img
            src="/images/logo.png"
            alt="ECO KEPHYRA"
            className="h-auto w-[120px] object-contain md:w-[145px]"
          />
        </Link>

        {/* SOCIAL MEDIA */}
        <div className="mt-7 flex items-center gap-8">

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
          >
            Instagram
          </a>

          <span className="h-[3px] w-[3px] rounded-full bg-[#DCE4C8]" />

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
          >
            TikTok
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