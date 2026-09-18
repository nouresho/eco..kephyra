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
    
    { label: "Availability", href: "/date-availability" },
    { label: "Pricing", href: "/pricing" },
    { label: "Storytelling", href: "/storytelling" },
  ];

  return (
    <header
      className={`${jakarta.className} sticky top-0 z-[100] w-full`}
    >
      {/* ======================================== */}
      {/* MAIN HEADER */}
      {/* ======================================== */}

      <div
        className="
          relative
          flex
          h-[74px]
          w-full
          items-center
          justify-between
          border-b
          border-black/[0.07]
          bg-[#F7F5EF]/95
          px-5
          backdrop-blur-xl
          md:h-[88px]
          md:px-10
          lg:px-14
        "
      >
        {/* ======================================== */}
        {/* LOGO — LEFT */}
        {/* ======================================== */}

        <Link
          href="/"
          onClick={closeMenu}
          className="
            relative
            z-50
            flex
            items-center
            gap-2.5
            text-black
            no-underline
            transition-opacity
            duration-300
            hover:opacity-60
          "
        >
          <img
            src="/images/logo.png"
            alt="ECO KEPHYRA"
            className="
              h-20
              w-20
              object-contain
              md:h-16
              md:w-16
            "
          />

          <span
            className="
              text-[16px]
              font-bold
              tracking-[-0.045em]
              text-black
              md:text-[18px]
            "
          >
            ECO KEPHYRA
          </span>
        </Link>


        {/* ======================================== */}
        {/* DESKTOP NAV — RIGHT */}
        {/* ======================================== */}

        <nav
          className="
            ml-auto
            hidden
            items-center
            gap-8
            md:flex
            lg:gap-11
          "
        >
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                group
                relative
                py-3
                text-[12px]
                font-medium
                tracking-[-0.01em]
                text-black
                no-underline
                transition-opacity
                duration-300
                hover:opacity-60
              "
            >
              {item.label}

              {/* UNDERLINE */}
              <span
                className="
                  absolute
                  bottom-[7px]
                  left-0
                  h-px
                  w-full
                  origin-right
                  scale-x-0
                  bg-black
                  transition-transform
                  duration-300
                  ease-out
                  group-hover:origin-left
                  group-hover:scale-x-100
                "
              />
            </Link>
          ))}
        </nav>


        {/* ======================================== */}
        {/* MOBILE MENU BUTTON */}
        {/* ======================================== */}

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="
            relative
            z-50
            flex
            h-10
            w-10
            items-center
            justify-center
            md:hidden
          "
        >
          <div className="relative h-[14px] w-[24px]">

            {/* TOP LINE */}
            <span
              className={`
                absolute
                left-0
                h-[1.5px]
                bg-black
                transition-all
                duration-300

                ${
                  open
                    ? "top-[6px] w-[24px] rotate-45"
                    : "top-[2px] w-[24px]"
                }
              `}
            />

            {/* BOTTOM LINE */}
            <span
              className={`
                absolute
                right-0
                h-[1.5px]
                bg-black
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
          border-black/[0.07]
          bg-[#F7F5EF]/98
          backdrop-blur-xl
          transition-all
          duration-500
          ease-[cubic-bezier(.22,1,.36,1)]
          md:hidden

          ${
            open
              ? "pointer-events-auto max-h-[350px] opacity-100"
              : "pointer-events-none max-h-0 opacity-0"
          }
        `}
      >
        <div className="px-5 pb-7 pt-2">

          <nav className="flex flex-col">

            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="
                  group
                  flex
                  items-center
                  justify-between
                  border-b
                  border-black/10
                  py-5
                  text-[24px]
                  font-medium
                  tracking-[-0.04em]
                  text-black
                  no-underline
                  transition-all
                  duration-300
                  hover:pl-1
                  hover:opacity-60
                "
              >
                <span>{item.label}</span>

                <ArrowUpRight
                  size={18}
                  strokeWidth={1.5}
                  className="
                    text-black
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                  "
                />
              </Link>
            ))}

          </nav>

        </div>
      </div>

    </header>
  );
}