"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ArrowUpRight } from "lucide-react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Header() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  const links = [
    { label: "Pricing", href: "/pricing" },
    { label: "Story", href: "/storytelling" },
    { label: "Availability", href: "/date-availability" },
  ];

  return (
    <header
      className={`${jakarta.className} sticky top-0 z-[100] w-full`}
    >
      {/* ======================================== */}
      {/* MAIN HEADER */}
      {/* ======================================== */}

      <div className="relative flex h-[74px] w-full items-center justify-between border-b border-[#183B48]/[0.07] bg-[#F7F5EF]/95 px-5 backdrop-blur-xl md:h-[88px] md:px-10 lg:px-14">
        
        {/* ======================================== */}
        {/* LOGO */}
        {/* ======================================== */}

        <Link
          href="/"
          onClick={closeMenu}
          className="header-brand relative z-50 flex items-center gap-2"
        >
          <img
            src="/images/logo.png"
            alt=""
            aria-hidden="true"
            className="h-12 w-12 object-contain md:h-16 md:w-16"
          />

          ECO KEPHYRA
        </Link>

        {/* ======================================== */}
        {/* DESKTOP NAV */}
        {/* ======================================== */}

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="header-nav-link"
            >
              <span>{item.label}</span>

              <span className="header-nav-line" />
            </Link>
          ))}
        </nav>

        {/* ======================================== */}
        {/* RIGHT */}
        {/* ======================================== */}

        <div className="relative z-50 flex items-center">
          
          {/* DESKTOP CTA */}

          <Link
            href="/reservation"
            className="header-book hidden md:flex"
          >
            <span>Book a ride</span>

            <ArrowUpRight
              size={15}
              strokeWidth={1.7}
              className="header-book-arrow"
            />
          </Link>

          {/* ======================================== */}
          {/* MOBILE MENU BUTTON */}
          {/* ======================================== */}

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="header-menu-button relative flex h-10 w-10 items-center justify-center md:hidden"
          >
            <div className="relative h-[14px] w-[24px]">
              <span
                className={`
                  absolute
                  left-0
                  h-[1.5px]
                  bg-[#183B48]
                  transition-all
                  duration-300

                  ${
                    open
                      ? "top-[6px] w-[24px] rotate-45"
                      : "top-[2px] w-[24px]"
                  }
                `}
              />

              <span
                className={`
                  absolute
                  right-0
                  h-[1.5px]
                  bg-[#183B48]
                  transition-all
                  duration-300

                  ${
                    open
                      ? "bottom-[6px] w-[24px] -rotate-45"
                      : "bottom-[2px] w-[16px]"
                  }
                `}
              />
            </div>
          </button>
        </div>
      </div>

      {/* ======================================== */}
      {/* MOBILE MENU */}
      {/* ======================================== */}

      <div
        className={`
          absolute
          left-0
          top-[74px]
          w-full
          overflow-hidden
          border-b
          border-[#183B48]/[0.07]
          bg-[#F7F5EF]/98
          backdrop-blur-xl
          transition-all
          duration-500
          ease-[cubic-bezier(.22,1,.36,1)]
          md:hidden

          ${
            open
              ? "pointer-events-auto max-h-[430px] opacity-100"
              : "pointer-events-none max-h-0 opacity-0"
          }
        `}
      >
        <div className="px-5 pb-6 pt-2">
          
          {/* MOBILE LINKS */}

          <nav className="flex flex-col">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="mobile-nav-link"
              >
                <span>{item.label}</span>

                <ArrowUpRight
                  size={17}
                  strokeWidth={1.5}
                  className="mobile-nav-arrow"
                />
              </Link>
            ))}
          </nav>

          {/* MOBILE CTA */}

          <Link
            href="/reservation"
            onClick={closeMenu}
            className="mobile-book"
          >
            <span>Book a ride</span>

            <ArrowUpRight
              size={16}
              strokeWidth={1.7}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}