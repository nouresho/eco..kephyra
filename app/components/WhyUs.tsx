"use client";

import { useEffect, useRef, useState } from "react";

/* ================================================= */
/* SERVICES */
/* ================================================= */

const services = [
  {
    title: "A Cleaner Way to Explore",
    paragraphs: [
      "Our goal is to offer you a cleaner and more sustainable way to move around and enjoy the region.",
      "No Fuel. No Smoke. No Pollution.",
      "With a single charge, enjoy a full day of riding and exploring without worrying about fuel costs. Our electric scooters provide a clean, quiet, and comfortable ride, away from the noise of traditional engines.",
      "Protecting the environment and reducing pollution are at the heart of our vision. That's why we chose EKO KIVARA to be part of the change toward more sustainable mobility.",
    ],
    image: "/images/cleaner-way.jpg",
  },
  {
    title: "Ride in Style",
    paragraphs: [
      "Classic Italian-inspired design combining elegance, comfort, and practicality. Enjoy a large storage bag, phone holder, USB charging port, and a classic, stylish helmet that combines protection with a great look, carefully cleaned and sanitized after every use.",
      "Everything you need for a comfortable, practical, and stylish ride.",
    ],
    image: "/images/ride-style.jpg",
  },
  {
    title: "Excellent Service",
    paragraphs: [
      "We're available 24/7 to respond to your messages, answer your questions, and assist you with anything related to your scooter experience.",
      "For us, excellent service means being there for you throughout the entire experience.",
    ],
    image: "/images/service.jpg",
  },
];

const moreLessBtn = `
  text-[11px]
  font-bold
  uppercase
  tracking-[0.16em]
  text-[#F5F1E8]
  underline
  decoration-white/50
  underline-offset-4
  transition-opacity
  hover:opacity-80
`;

/* ================================================= */
/* COMPONENT */
/* ================================================= */

export default function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);

  const [visible, setVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFirstCardExpanded, setIsFirstCardExpanded] = useState(false);

  /* ---------- SWIPE STATE ---------- */
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  /* ================================================= */
  /* SCROLL ANIMATION */
  /* ================================================= */

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  /* ================================================= */
  /* MOBILE CAROUSEL */
  /* ================================================= */

  const goToPreviousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
    setIsFirstCardExpanded(false);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length);
    setIsFirstCardExpanded(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (index !== 0) setIsFirstCardExpanded(false);
  };

  /* ================================================= */
  /* SWIPE HANDLERS */
  /* ================================================= */

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    // wach swipe horizontal wla scroll vertical
    if (
      isHorizontalSwipe.current === null &&
      (Math.abs(dx) > 8 || Math.abs(dy) > 8)
    ) {
      isHorizontalSwipe.current = Math.abs(dx) > Math.abs(dy);
    }

    if (isHorizontalSwipe.current) setDragX(dx);
  };

  const handleTouchEnd = () => {
    if (isHorizontalSwipe.current && Math.abs(dragX) > 50) {
      if (dragX < 0) goToNextSlide();
      else goToPreviousSlide();
    }

    setDragX(0);
    setIsDragging(false);
    isHorizontalSwipe.current = null;
  };

  /* ================================================= */
  /* FIRST CARD MORE / LESS */
  /* ================================================= */

  const firstService = services[0];

  const firstCardParagraphs = isFirstCardExpanded
    ? firstService.paragraphs
    : firstService.paragraphs.slice(0, 1);

  /* ================================================= */
  /* CARD TEXT (mobile + desktop) */
  /* ================================================= */

  const renderText = (
    service: (typeof services)[number],
    index: number,
    textClass: string
  ) => (
    <div className={textClass}>
      {index === 0 && !isFirstCardExpanded ? (
        <p>
          {firstService.paragraphs[0]}{" "}
          <button
            type="button"
            onClick={() => setIsFirstCardExpanded(true)}
            className={moreLessBtn}
          >
            More
          </button>
        </p>
      ) : (
        <>
          {(index === 0 ? firstCardParagraphs : service.paragraphs).map(
            (paragraph, paragraphIndex, paragraphs) => (
              <p key={paragraph}>
                {paragraph}
                {index === 0 && paragraphIndex === paragraphs.length - 1 && (
                  <>
                    {" "}
                    <button
                      type="button"
                      onClick={() => setIsFirstCardExpanded(false)}
                      className={moreLessBtn}
                    >
                      Less
                    </button>
                  </>
                )}
              </p>
            )
          )}
        </>
      )}
    </div>
  );

  /* ================================================= */
  /* RENDER */
  /* ================================================= */

  return (
    <section
      ref={sectionRef}
      className="
        vintage-section
        overflow-hidden
        bg-[linear-gradient(180deg,#F5F1E8_0%,#EAF0E5_48%,#F5F1E8_100%)]
        px-4
        pb-24
        pt-16
        md:px-12
        md:pb-28
        md:pt-20
      "
    >
      {/* ================================================= */}
      {/* TITLE */}
      {/* ================================================= */}

      <div
        className={`
          mx-auto
          mb-12
          flex
          max-w-6xl
          justify-center
          text-center
          transition-all
          duration-1000
          ease-[cubic-bezier(.22,1,.36,1)]
          md:mb-14

          ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
        `}
      >
        <h2 className="section-title mt-5">WHY US</h2>
      </div>

      {/* ================================================= */}
      {/* MOBILE */}
      {/* ================================================= */}

      <div className="mx-auto max-w-[420px] md:hidden">
        {/* MOBILE CAROUSEL */}
        <div className="relative overflow-hidden rounded-[30px]">
          <div
            className="
              flex
              touch-pan-y
              transition-transform
              duration-700
              ease-[cubic-bezier(.22,1,.36,1)]
            "
            style={{
              transform: `translateX(calc(-${currentSlide * 100}% + ${dragX}px))`,
              transition: isDragging ? "none" : undefined,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            {services.map((service, index) => (
              <article
                key={service.title}
                className="
                  group
                  relative
                  h-[650px]
                  min-w-full
                  overflow-hidden
                  rounded-[30px]
                  border-2
                  border-white/80
                  bg-[#49372D]
                  shadow-[0_18px_38px_rgba(73,55,45,0.18)]
                "
              >
                {/* IMAGE */}
                <img
                  src={service.image}
                  alt={service.title}
                  draggable={false}
                  className="absolute inset-0 h-full w-full select-none object-cover"
                />

                {/* OVERLAY */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#20140de8]
                    via-[#20140d45]
                    to-[#20140d0a]
                  "
                />

                {/* NUMBER */}
                <div
                  className="
                    absolute
                    left-5
                    right-5
                    top-5
                    z-10
                    flex
                    items-center
                    justify-between
                  "
                >
                  <p
                    className="
                      rounded-full
                      border
                      border-white/50
                      bg-[#49372D]/35
                      px-3
                      py-1.5
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#F5F1E8]
                      backdrop-blur-sm
                    "
                  >
                    0{index + 1}
                  </p>
                </div>

                {/* BOTTOM CONTENT */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                  <h3
                    className="
                      vintage-title
                      text-[30px]
                      leading-[0.94]
                      text-[#F5F1E8]
                    "
                  >
                    {service.title}
                  </h3>

                  {renderText(
                    service,
                    index,
                    "mt-3 space-y-3 text-[12px] font-medium leading-5 text-[#EADAC8]"
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 3 DISK NAVIGATION */}
        <div className="mt-6 flex items-center justify-center gap-3 md:hidden">
          {services.map((service, index) => (
            <button
              key={service.title}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to ${service.title}`}
              className={`
                rounded-full
                transition-all
                duration-300

                ${
                  currentSlide === index
                    ? "h-6 w-6 bg-[#49372D]"
                    : "h-6 w-6 bg-[#DCE4C8] hover:bg-[#49372D]/25"
                }
              `}
            />
          ))}
        </div>

        {/* CAROUSEL ARROWS */}
        <div className="mt-6 flex items-center justify-center gap-4 md:hidden">
          {/* LEFT */}
          <button
            type="button"
            aria-label="Previous card"
            onClick={goToPreviousSlide}
            className="
              group
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-[#49372D]/25
              bg-[#F5F1E8]
              text-[#49372D]
              transition-all
              duration-300
              hover:-translate-x-1
              hover:border-[#49372D]
              hover:bg-[#DCE4C8]
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5"
              aria-hidden="true"
            >
              <path
                d="M14.5 5.5 8 12l6.5 6.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* RIGHT */}
          <button
            type="button"
            aria-label="Next card"
            onClick={goToNextSlide}
            className="
              group
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-[#49372D]/25
              bg-[#49372D]
              text-[#F5F1E8]
              transition-all
              duration-300
              hover:translate-x-1
              hover:bg-[#6F7F73]
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <path
                d="M9.5 5.5 16 12l-6.5 6.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* DESKTOP CARDS */}
      {/* ================================================= */}

      <div
        className="
          mx-auto
          hidden
          max-w-6xl
          grid-cols-1
          gap-5
          md:grid
          md:grid-cols-3
          md:gap-5
        "
      >
        {services.map((service, index) => (
          <article
            key={service.title}
            style={{
              transitionDelay: visible ? `${180 + index * 140}ms` : "0ms",
            }}
            className={`
              group
              relative
              h-[650px]
              overflow-hidden
              rounded-[30px]
              border-2
              border-white/80
              bg-[#49372D]
              shadow-[0_18px_38px_rgba(73,55,45,0.18)]
              transition-[opacity,transform,box-shadow]
              duration-1000
              ease-[cubic-bezier(.22,1,.36,1)]
              hover:-translate-y-2
              hover:shadow-[0_26px_55px_rgba(73,55,45,0.24)]
              md:h-[680px]

              ${visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}
            `}
          >
            {/* IMAGE */}
            <img
              src={service.image}
              alt={service.title}
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-transform
                duration-[900ms]
                ease-[cubic-bezier(.22,1,.36,1)]
                group-hover:scale-[1.04]
              "
            />

            {/* OVERLAY */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-[#20140de8]
                via-[#20140d45]
                to-[#20140d0a]
                transition-all
                duration-700
                group-hover:from-[#20140df2]
                group-hover:via-[#20140d55]
              "
            />

            {/* TOP NUMBER */}
            <div
              className="
                absolute
                left-5
                right-5
                top-5
                z-10
                flex
                items-center
                justify-between
              "
            >
              <p
                className="
                  rounded-full
                  border
                  border-white/50
                  bg-[#49372D]/35
                  px-3
                  py-1.5
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#F5F1E8]
                  backdrop-blur-sm
                "
              >
                0{index + 1}
              </p>
            </div>

            {/* BOTTOM CONTENT */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
              <div
                className="
                  transition-transform
                  duration-500
                  ease-[cubic-bezier(.22,1,.36,1)]
                  group-hover:-translate-y-1
                "
              >
                <h3
                  className="
                    vintage-title
                    text-[30px]
                    leading-[0.94]
                    text-[#F5F1E8]
                    md:text-[34px]
                  "
                >
                  {service.title}
                </h3>

                {renderText(
                  service,
                  index,
                  "mt-3 space-y-3 text-[12px] font-medium leading-5 text-[#EADAC8] md:text-[13px]"
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}