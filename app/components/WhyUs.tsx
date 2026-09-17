"use client";

import { useEffect, useRef, useState } from "react";

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

export default function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);

  const [visible, setVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFirstCardExpanded, setIsFirstCardExpanded] = useState(false);

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
      {
        threshold: 0.18,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const goToPreviousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length);
  };

  const firstService = services[0];
  const firstCardParagraphs = isFirstCardExpanded
    ? firstService.paragraphs
    : firstService.paragraphs.slice(0, 1);

  return (
    <section
      ref={sectionRef}
      className="vintage-section overflow-hidden bg-[linear-gradient(180deg,#F5F1E8_0%,#EAF0E5_48%,#F5F1E8_100%)] px-4 pb-24 pt-16 md:px-12 md:pb-28 md:pt-20"
    >
      {/* TITLE */}

      <div
        className={`mx-auto mb-12 flex max-w-6xl justify-center text-center transition-all duration-1000 ease-[cubic-bezier(.22,1,.36,1)] md:mb-14 ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
      >
        <h2 className="vintage-title retro-shadow text-center text-[56px] text-[#49372D] sm:text-[70px] md:text-[88px]">
          WHY
          <br />
          CHOOSE US
        </h2>
      </div>

      {/* MOBILE CAROUSEL */}

      <div className="mx-auto max-w-[420px] md:hidden">
        <div className="relative overflow-hidden rounded-[30px]">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {services.map((service, index) => (
              <article
                key={service.title}
                className="group relative h-[650px] min-w-full overflow-hidden rounded-[30px] border-2 border-white/80 bg-[#49372D] shadow-[0_18px_38px_rgba(73,55,45,0.18)]"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#20140de8] via-[#20140d45] to-[#20140d0a]" />

                <div className="absolute left-5 right-5 top-5 z-10 flex items-center justify-between">
                  <p className="rounded-full border border-white/50 bg-[#49372D]/35 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#F5F1E8] backdrop-blur-sm">
                    0{index + 1}
                  </p>
                </div>

                <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                  <h3 className="vintage-title text-[30px] leading-[0.94] text-[#F5F1E8]">
                    {service.title}
                  </h3>

                  <div className="mt-3 space-y-3 text-[12px] font-medium leading-5 text-[#EADAC8]">
                    {index === 0 && !isFirstCardExpanded ? (
                      <p>
                        {firstService.paragraphs[0]}{" "}
                        <button
                          type="button"
                          onClick={() => setIsFirstCardExpanded(true)}
                          className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#F5F1E8] underline decoration-white/50 underline-offset-4 transition-opacity hover:opacity-80"
                        >
                          More
                        </button>
                      </p>
                    ) : (
                      <>
                        {(index === 0 ? firstCardParagraphs : service.paragraphs).map((paragraph, paragraphIndex, paragraphs) => (
                          <p key={paragraph}>
                            {paragraph}
                            {index === 0 && paragraphIndex === paragraphs.length - 1 && (
                              <>
                                {" "}
                                <button
                                  type="button"
                                  onClick={() => setIsFirstCardExpanded(false)}
                                  className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#F5F1E8] underline decoration-white/50 underline-offset-4 transition-opacity hover:opacity-80"
                                >
                                  Less
                                </button>
                              </>
                            )}
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            aria-label="Previous slide"
            onClick={goToPreviousSlide}
            className="absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white/90 backdrop-blur-[2px] transition-all duration-300 hover:scale-105 hover:bg-[#49372D]/35 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
              <path d="M14.5 5.5 8 12l6.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Next slide"
            onClick={goToNextSlide}
            className="absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white/90 backdrop-blur-[2px] transition-all duration-300 hover:scale-105 hover:bg-[#49372D]/35 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
              <path d="M9.5 5.5 16 12l-6.5 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* DESKTOP CARDS */}

      <div className="mx-auto hidden max-w-6xl grid-cols-1 gap-5 md:grid md:grid-cols-3 md:gap-5">
        {services.map((service, index) => (
          <article
            key={service.title}
            style={{
              transitionDelay: visible ? `${180 + index * 140}ms` : "0ms",
            }}
            className={`group relative h-[650px] overflow-hidden rounded-[30px] border-2 border-white/80 bg-[#49372D] shadow-[0_18px_38px_rgba(73,55,45,0.18)] transition-[opacity,transform,box-shadow] duration-1000 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-2 hover:shadow-[0_26px_55px_rgba(73,55,45,0.24)] md:h-[680px] ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            {/* IMAGE */}

            <img
              src={service.image}
              alt={service.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
            />

            {/* OVERLAY */}

            <div className="absolute inset-0 bg-gradient-to-t from-[#20140de8] via-[#20140d45] to-[#20140d0a] transition-all duration-700 group-hover:from-[#20140df2] group-hover:via-[#20140d55]" />

            {/* TOP NUMBER */}

            <div className="absolute left-5 right-5 top-5 z-10 flex items-center justify-between">
              <p className="rounded-full border border-white/50 bg-[#49372D]/35 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#F5F1E8] backdrop-blur-sm">
                0{index + 1}
              </p>
            </div>

            {/* BOTTOM CONTENT */}

            <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
              <div className="transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1">
                <h3 className="vintage-title text-[30px] leading-[0.94] text-[#F5F1E8] md:text-[34px]">
                  {service.title}
                </h3>

                <div className="mt-3 space-y-3 text-[12px] font-medium leading-5 text-[#EADAC8] md:text-[13px]">
                  {index === 0 && !isFirstCardExpanded ? (
                    <p>
                      {firstService.paragraphs[0]}{" "}
                      <button
                        type="button"
                        onClick={() => setIsFirstCardExpanded(true)}
                        className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#F5F1E8] underline decoration-white/50 underline-offset-4 transition-opacity hover:opacity-80"
                      >
                        More
                      </button>
                    </p>
                  ) : (
                    <>
                      {(index === 0 ? firstCardParagraphs : service.paragraphs).map((paragraph, paragraphIndex, paragraphs) => (
                        <p key={paragraph}>
                          {paragraph}
                          {index === 0 && paragraphIndex === paragraphs.length - 1 && (
                            <>
                              {" "}
                              <button
                                type="button"
                                onClick={() => setIsFirstCardExpanded(false)}
                                className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#F5F1E8] underline decoration-white/50 underline-offset-4 transition-opacity hover:opacity-80"
                              >
                                Less
                              </button>
                            </>
                          )}
                        </p>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}