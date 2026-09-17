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
        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[350px]
            max-w-7xl
            items-center
            justify-center
            md:min-h-[450px]
          "
        >
          <p className="pricing-script-word pricing-script-word-large">
            Pricing
          </p>
        </div>

        <WavyDivider color="#F5F1E8" />
      </section>


      {/* ================================================= */}
      {/* PRICING OFFERS */}
      {/* ================================================= */}

      <section
        className="
          vintage-section
          relative
          bg-[#F5F1E8]
          px-6
          pb-36
          pt-24
          md:px-12
          md:pb-44
          md:pt-32
        "
      >
        <div className="mx-auto max-w-7xl">

          <div className="pricing-cards-grid pricing-cards-uniform">
            {prices.map((item, index) => {
              const whatsappMessage = encodeURIComponent(
                `Hello ECO KEPHYRA, I would like to book the ${item.period} rental offer at ${item.price} ${item.unit}.`
              );

              const reservationUrl = `/reservation?period=${encodeURIComponent(
                item.period
              )}&price=${encodeURIComponent(item.price)}`;

              return (
                <article
                  key={item.period}
                  className="pricing-shape-card pricing-shape-card-uniform"
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
                    <span>{item.price}</span>

                    <small>{item.unit}</small>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="pricing-shape-note">
                    {item.note}
                  </p>


                  {/* ===================================== */}
                  {/* BOOKING OPTIONS */}
                  {/* ===================================== */}

                  <div className="pricing-card-actions">

                    {/* WHATSAPP */}
                    <a
                      href={`https://wa.me/212623201547?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pricing-card-whatsapp"
                    >
                      <span>Book on WhatsApp</span>
                      <span>↗</span>
                    </a>


                    {/* ONLINE PAYMENT */}
                    <Link
                      href={reservationUrl}
                      className="pricing-card-online"
                    >
                      <span>Book &amp; Pay Online</span>
                      <span>→</span>
                    </Link>

                  </div>
                </article>
              );
            })}
          </div>

        </div>

        <WavyDivider color="#DCE4C8" />
      </section>


      {/* ================================================= */}
      {/* FINAL CTA */}
      {/* ================================================= */}

      <section
        className="
          ready-ride-section
          relative
          overflow-hidden
          px-6
          pb-28
          pt-36
          text-center
          md:px-12
          md:pb-36
          md:pt-44
        "
      >
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