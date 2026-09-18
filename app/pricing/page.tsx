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
            bg-[url('/images/story.png')]
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

<div className="pricing-card-actions">

  {/* WHATSAPP */}
  <a
    href={`https://wa.me/212623201547?text=${whatsappMessage}`}
    target="_blank"
    rel="noopener noreferrer"
    className="pricing-card-whatsapp"
  >
    <span>Book on WhatsApp</span>

    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[18px] w-[18px] shrink-0 fill-current"
      aria-hidden="true"
    >
      <path d="M16.02 3C8.84 3 3 8.75 3 15.82c0 2.26.6 4.46 1.73 6.39L3 29l7.02-1.8a13.1 13.1 0 0 0 6 1.45h.01C23.2 28.65 29 22.9 29 15.82 29 8.75 23.2 3 16.02 3Zm0 23.49a10.9 10.9 0 0 1-5.55-1.5l-.4-.24-4.16 1.07 1.11-4-.26-.41a10.4 10.4 0 0 1-1.65-5.59c0-5.89 4.9-10.68 10.91-10.68 6 0 10.88 4.79 10.88 10.68 0 5.89-4.88 10.67-10.88 10.67Zm5.98-8c-.33-.16-1.94-.94-2.24-1.05-.3-.1-.52-.16-.74.16-.22.32-.85 1.05-1.04 1.27-.19.21-.38.24-.71.08-.33-.16-1.39-.5-2.65-1.6a9.9 9.9 0 0 1-1.83-2.24c-.19-.32-.02-.5.14-.66.15-.14.33-.37.49-.56.17-.19.22-.32.33-.53.11-.21.05-.4-.03-.56-.08-.16-.74-1.75-1.01-2.4-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.4-.3.32-1.14 1.1-1.14 2.68 0 1.59 1.17 3.12 1.33 3.33.16.21 2.3 3.46 5.57 4.85.78.33 1.39.53 1.86.68.78.24 1.49.21 2.05.13.63-.09 1.94-.78 2.21-1.53.27-.75.27-1.4.19-1.53-.08-.13-.3-.21-.63-.37Z" />
    </svg>
  </a>


  {/* PAYPAL */}
  <Link
    href={reservationUrl}
    className="pricing-card-online"
  >
    <span>Book &amp; Pay Online</span>

    {/* PAYPAL ICON */}
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[19px] w-[19px] shrink-0 fill-current"
      aria-hidden="true"
    >
      <path d="M7.08 20.5H4.2a.65.65 0 0 1-.64-.76L6.1 3.58A.7.7 0 0 1 6.8 3h5.55c3.62 0 6.12 1.48 5.55 5.06-.65 4.05-3.55 5.2-6.93 5.2H9.55l-.77 4.9a.7.7 0 0 1-.7.59h-.65l-.35 1.75Zm3.03-10.28h1.13c1.8 0 3.25-.38 3.55-2.23.28-1.75-1.1-1.97-2.65-1.97h-1.3l-.73 4.2Z" />
      <path
        d="M10.05 20.5H8.23l1.02-6.47h1.72c3.38 0 6.28-1.15 6.93-5.2.05-.32.08-.62.08-.91.78.84 1.04 2.05.79 3.6-.59 3.7-3.2 4.9-6.35 4.9h-.92l-.55 3.49a.7.7 0 0 1-.7.59h-.2Z"
        opacity=".55"
      />
    </svg>
  </Link>

</div>

                  </div>
                </article>
              );
            })}
          </div>

        </div>

        <WavyDivider color="#DCE4C8" />
      </section>
    </main>
  );
}