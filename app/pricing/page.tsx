import Link from "next/link";
import WavyDivider from "../components/WavyDivider";

const prices = [
  {
    period: "1 — 3 DAYS",
    price: "200 DH",
    unit: "/ DAY",
    note: "Perfect for a short escape.",
  },
  {
    period: "3 — 5 DAYS",
    price: "180 DH",
    unit: "/ DAY",
    note: "A little more time to explore.",
  },
  {
    period: "5 — 7 DAYS",
    price: "170 DH",
    unit: "/ DAY",
    note: "Made for a full week adventure.",
  },
  {
    period: "FROM 1 WEEK",
    price: "155 DH",
    unit: "/ DAY",
    note: "Stay longer, ride further.",
  },
  {
    period: "FROM 1 MONTH",
    price: "120 DH",
    unit: "/ DAY",
    note: "Best rate for long-term rental.",
  },
];

export default function PricingPage() {
  return (
    <main className="overflow-hidden bg-[#F3EFE7]">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section
        className="
          pricing-hero
          relative
          min-h-[520px]
          overflow-hidden
          px-6
          pb-32
          pt-20
          md:min-h-[650px]
          md:px-12
          md:pb-40
          md:pt-28
        "
      >
        {/* BACKGROUND IMAGE */}
        <div
          className="
            absolute
            inset-0
            z-0
            bg-[url('/images/bgprincing.png')]
            bg-cover
            bg-center
            bg-no-repeat
          "
        />

        {/* LIGHT VINTAGE OVERLAY */}
        <div
          className="
            absolute
            inset-0
            z-[1]
            bg-[#F3EFE7]/35
          "
        />

        {/* SOFT GRADIENT */}
        <div
          className="
            absolute
            inset-0
            z-[2]
            bg-gradient-to-b
            from-[#F3EFE7]/20
            via-transparent
            to-[#F3EFE7]/55
          "
        />

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto max-w-7xl">

          <div className="mt-9 text-center">

            <h1 className="pricing-main-title mt-5">
              RIDE
              <br />
              <span>YOUR WAY.</span>
            </h1>

            <p className="pricing-script-word">
              Pricing
            </p>

          </div>

          <div className="mx-auto mt-10 max-w-2xl text-center">

            <p className="text-sm font-medium leading-7 text-[#49372D] md:text-base">
              Transparent pricing for your electric adventure.
              Choose your rental period and enjoy the road with everything
              you need to ride.
            </p>

          </div>

        </div>

        <WavyDivider color="#F5F1E8" />
      </section>


      {/* ================================================= */}
      {/* RENTAL RATES */}
      {/* ================================================= */}

      <section
        className="
          vintage-section
          relative
          bg-[#F5F1E8]
          px-6
          pb-36
          pt-28
          md:px-12
          md:pb-44
          md:pt-36
        "
      >
        <div className="mx-auto max-w-7xl">

          {/* SECTION INTRO */}
          <div className="grid items-end gap-8 md:grid-cols-2">

            {/* LEFT */}
            <div>

              <p className="vintage-label text-[#6F7F73]">
                Choose your ride
              </p>

              <h2
                className="
                  vintage-title
                  retro-shadow
                  mt-5
                  text-[58px]
                  text-[#49372D]
                  md:text-[92px]
                "
              >
                RENTAL
                <br />
                RATES
              </h2>

            </div>


            {/* RIGHT */}
            <div className="md:pb-3">

              <p
                className="
                  max-w-md
                  border-l-2
                  border-[#49372D]
                  pl-5
                  text-sm
                  font-medium
                  leading-7
                  text-[#66705C]
                "
              >
                One scooter. One simple rate.
                More freedom to explore at your own pace.
              </p>

            </div>

          </div>


          {/* ================================================= */}
          {/* ORGANIC RETRO PRICING CARDS — STYLE 10 */}
          {/* ================================================= */}

          <div className="pricing-cards-grid mt-14">

            {prices.map((item, index) => (
              <article
                key={item.period}
                className={`pricing-shape-card pricing-shape-card-${index + 1}`}
              >

                {/* NUMBER */}
                <span className="pricing-shape-number">
                  {String(index + 1).padStart(2, "0")}
                </span>


                {/* PERIOD */}
                <h3 className="pricing-shape-period">
                  {item.period}
                </h3>


                {/* PRICE */}
                <div className="pricing-shape-price">

                  <span>
                    {item.price}
                  </span>

                  <small>
                    {item.unit}
                  </small>

                </div>


                {/* DESCRIPTION */}
                <p className="pricing-shape-note">
                  {item.note}
                </p>

              </article>
            ))}

          </div>

        </div>

        <WavyDivider color="#DCE4C8" />
      </section>




      {/* ================================================= */}
{/* FINAL CTA */}
{/* ================================================= */}

<section className="ready-ride-section relative overflow-hidden px-6 pb-28 pt-36 text-center md:px-12 md:pb-36 md:pt-44">

  {/* BACKGROUND IMAGE */}
  <div className="ready-ride-bg" />

  {/* DARK / VINTAGE OVERLAY */}
  <div className="ready-ride-overlay" />

  {/* CONTENT */}
  <div className="relative z-10 mx-auto max-w-5xl">

    <p className="vintage-label text-[#DCE4C8]">
      Pick a day. Take the road.
    </p>

    <h2
      className="
        vintage-title
        retro-shadow
        mt-6
        text-[64px]
        text-[#FFF8EC]
        md:text-[105px]
      "
    >
      READY
      <br />
      TO RIDE?
    </h2>

    <p
      className="
        mx-auto
        mt-7
        max-w-lg
        text-sm
        font-medium
        leading-7
        text-[#F5F1E8]
        md:text-base
      "
    >
      Choose your day, book your scooter and start your
      ECO KEPHYRA adventure.
    </p>

    <Link
      href="/reservation"
      className="ready-ride-button"
    >
      BOOK
    </Link>

  </div>

</section>

    </main>
  );
}