"use client";

import { useEffect, useRef, useState } from "react";

const services = [
  {
    label: "LOW-IMPACT EXPLORING",
    title: "A Cleaner Way to Explore",
    text:
      "Our goal is to offer you a cleaner and more sustainable way to move around and enjoy the region. No Fuel. No Smoke. No Pollution.",
    image: "/images/cleaner-way.jpg",
  },
  {
    label: "COMFORT WITH CHARACTER",
    title: "Ride in Style",
    text:
      "Classic Italian-inspired design combining elegance, comfort and practicality. Storage bag, phone holder, USB charging port and a stylish helmet.",
    image: "/images/ride-style.jpg",
  },
  {
    label: "HERE WHEN YOU NEED US",
    title: "Excellent Service",
    text:
      "We're available 24/7 to respond to your messages, answer your questions and assist you throughout your entire scooter experience.",
    image: "/images/service.jpg",
  },
];

export default function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);

  const [visible, setVisible] = useState(false);

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

      {/* CARDS */}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-5">
        {services.map((service, index) => (
          <article
            key={service.title}
            style={{
              transitionDelay: visible ? `${180 + index * 140}ms` : "0ms",
            }}
            className={`group relative h-[510px] overflow-hidden rounded-[30px] border-2 border-white/80 bg-[#49372D] shadow-[0_18px_38px_rgba(73,55,45,0.18)] transition-[opacity,transform,box-shadow] duration-1000 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-2 hover:shadow-[0_26px_55px_rgba(73,55,45,0.24)] md:h-[540px] ${
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
                <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#B9DCEF]">
                  {service.label}
                </p>

                <h3 className="vintage-title text-[30px] leading-[0.94] text-[#F5F1E8] md:text-[34px]">
                  {service.title}
                </h3>

                <p className="mt-3 text-[12px] font-medium leading-5 text-[#EADAC8] md:text-[13px]">
                  {service.text}
                </p>

                <div className="mt-4 pt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/70">
                  <span>Electric freedom</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}