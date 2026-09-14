import WhyUs from "./components/WhyUs";
import WavyDivider from "./components/WavyDivider";
import FaqPreview from "./components/FaqImageSection";

export default function Home() {
  return (
    <>
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="hero-home relative overflow-hidden bg-[#F3EFE7]">
        {/* ================================================= */}
        {/* DESKTOP HERO */}
        {/* ================================================= */}

        <div className="relative hidden min-h-[calc(100vh-100px)] md:block">
          {/* BLUE WAVE BACKGROUND */}

          <div className="pointer-events-none absolute inset-0 z-0">
            <svg
              viewBox="0 0 1440 900"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <path
                d="
                  M0,610
                  C170,470 320,690 500,555
                  C700,405 860,645 1050,505
                  C1220,380 1345,480 1440,410
                  L1440,900
                  L0,900
                  Z
                "
                fill="#B9DCEF"
              />
            </svg>
          </div>

          {/* LOGO TOP CENTER */}

          <div className="hero-logo-desktop">
            <img src="/images/logo.png" alt="ECO KEPHYRA" />
          </div>

          {/* HERO CONTENT */}

          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl items-center gap-10 px-10 pb-14 pt-[120px] lg:gap-16 lg:px-12">
            {/* LEFT CONTENT */}

            <div className="flex flex-1 items-center">
              <div>
                <h1 className="hero-main-title">
                  <span className="hero-title-line hero-title-line--one block">
                    ELECTRIC
                  </span>

                  <span className="hero-title-line hero-title-line--two relative block">
                    SCOOTERS

                    <span className="hero-script-word">for</span>
                  </span>

                  <span className="hero-title-line hero-title-line--three block">
                    RENTAL
                  </span>
                </h1>

                {/* SAME FONT AS "for" */}

                <p className="hero-home-caption hero-caption-typing hero-tagline-script">
                  No fuel. No smoke. No pollution.
                </p>
              </div>
            </div>

            {/* RIGHT VIDEO PHONE */}

            <div className="flex shrink-0 justify-center">
              <div className="phone-wrapper">
                <div className="phone-frame">
                  <div className="phone-speaker" />

                  <video
                    className="phone-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/images/hero-poster.jpg"
                  >
                    <source src="/videos/intro.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* MOBILE HERO */}
        {/* ================================================= */}

        <div className="relative min-h-[calc(100svh-90px)] md:hidden">
          {/* FULL BACKGROUND VIDEO */}

          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero-poster.jpg"
          >
            <source src="/videos/intro.mp4" type="video/mp4" />
          </video>

          {/* OVERLAY */}

          <div className="absolute inset-0 z-[1] bg-[#49372D]/25" />

          {/* MOBILE LOGO TOP CENTER */}

          <div className="hero-logo-mobile">
            <img src="/images/logo.png" alt="ECO KEPHYRA" />
          </div>

          {/* MOBILE CONTENT */}

          <div className="relative z-10 flex min-h-[calc(100svh-90px)] items-center justify-center px-4 pb-16 pt-[125px] text-center">
            <div className="w-full">
              <h1 className="hero-mobile-title">
                <span className="hero-title-line hero-title-line--one block">
                  ELECTRIC
                </span>

                <span className="hero-title-line hero-title-line--two relative block">
                  SCOOTERS

                  <span className="hero-mobile-script">for</span>
                </span>

                <span className="hero-title-line hero-title-line--three block">
                  RENTAL
                </span>
              </h1>

              {/* SAME FONT AS "for" */}

              <p className="hero-mobile-caption hero-caption-typing hero-tagline-script">
                No fuel. No smoke. No pollution.
              </p>
            </div>
          </div>
        </div>

        <WavyDivider color="#F5F1E8" />
      </section>

      {/* ================================================= */}
      {/* WHY US */}
      {/* ================================================= */}

      <div className="relative z-30 bg-[#F5F1E8] pt-[60px] md:pt-[85px]">
        <WhyUs />

        <WavyDivider color="#B9DCEF" />
      </div>

      {/* ================================================= */}
      {/* FAQ PREVIEW */}
      {/* ================================================= */}

      <FaqPreview />

      {/* ================================================= */}
      {/* SCOOTER PREVIEW */}
      {/* ================================================= */}

      <section className="vintage-section relative z-10 bg-[#DCE4C8] px-6 pb-32 pt-[150px] md:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-[1.1fr_0.9fr]">
          {/* IMAGE */}

          <div className="relative">
            <div className="overflow-hidden rounded-[24px] border-2 border-[#49372D] shadow-[8px_8px_0_#49372D]">
              <img
                src="/images/scooter-preview.jpg"
                alt="ECO KEPHYRA electric scooter"
                className="vintage-image h-[520px] w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -right-3 rotate-[-5deg] border-2 border-[#49372D] bg-[#B9DCEF] px-6 py-4 shadow-[4px_4px_0_#49372D]">
              <p className="vintage-label text-[#49372D]">Ride local</p>
            </div>
          </div>

          {/* TEXT */}

          <div>
            <p className="vintage-label text-[#66705C]">
              Your next adventure
            </p>

            <h2 className="vintage-title retro-shadow mt-5 text-[58px] text-[#49372D] md:text-[82px]">
              MORE
              <br />
              THAN A
              <br />
              RIDE.
            </h2>

            <p className="mt-7 max-w-md border-l-2 border-[#49372D] pl-5 text-sm font-medium leading-7 text-[#66705C] md:text-base">
              Classic style meets electric freedom. Explore the region slowly,
              quietly and differently.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Electric",
                "Eco Friendly",
                "Easy To Ride",
                "Local",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border-2 border-[#49372D] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#49372D]"
                >
                  {item}
                </span>
              ))}
            </div>

            <a
              href="/scooters"
              className="retro-button mt-9 bg-[#B9DCEF] px-7 py-4 text-xs text-[#49372D]"
            >
              Discover Scooters
            </a>
          </div>
        </div>

        <WavyDivider color="#6B4935" />
      </section>

      {/* ================================================= */}
      {/* FINAL CTA — READY TO RIDE */}
      {/* ================================================= */}

      <section className="ready-ride-section relative overflow-hidden px-6 pb-28 pt-36 text-center md:px-12 md:pb-36 md:pt-44">
        {/* BACKGROUND PHOTO */}

        <div className="ready-ride-bg" />

        {/* OVERLAY */}

        <div className="ready-ride-overlay" />

        {/* CONTENT */}

        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="vintage-label text-[#DCE4C8]">
            Road calling?
          </p>

          <h2 className="vintage-title retro-shadow mt-6 text-[65px] text-[#FFF8EC] md:text-[105px]">
            READY
            <br />
            TO RIDE?
          </h2>

          <p className="mx-auto mt-7 max-w-lg text-sm font-medium leading-7 text-[#F5F1E8] md:text-base">
            Your electric adventure starts here. Pick your scooter and make the
            road yours.
          </p>

          <a href="/reservation" className="ready-ride-button">
            BOOK
          </a>
        </div>
      </section>
    </>
  );
}