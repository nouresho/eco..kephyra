import Link from "next/link";

const faqs = [
  {
    id: "booking",
    number: "01",
    question: "Do I need to book in advance?",
    answer: (
      <>
        Yes, we highly recommend booking in advance to ensure that a scooter is
        available on the days you want, especially if you are planning your trip
        ahead of time.
        <br />
        <br />
        You can first visit our website to check the{" "}
        <strong>available dates and days</strong>, then choose the rental period
        that suits you.
      </>
    ),
  },

  {
    id: "speed",
    number: "02",
    question: "What is the scooter’s top speed?",
    answer: (
      <>
        The scooter can reach a top speed of <strong>50 km/h</strong>.
      </>
    ),
  },

  {
    id: "deposit",
    number: "03",
    question: "Is there a deposit?",
    answer: (
      <>
        Yes. We take your <strong>ID</strong> as a security deposit during the
        rental period.
        <br />
        <br />
        It is returned when you return the scooter in the same condition in
        which you received it.
      </>
    ),
  },

  {
    id: "charging",
    number: "04",
    question:
      "How long does the battery take to fully charge, and how is it charged?",
    answer: (
      <>
        The battery takes approximately <strong>3 hours maximum</strong> to
        fully charge.
        <br />
        <br />
        The battery is charged using{" "}
        <strong>the charger we provide with the scooter</strong>, which is
        included as part of the equipment provided with your rental.
        <br />
        <br />
        We recommend that the battery should{" "}
        <strong>not be left charging for more than 10 hours</strong>.
      </>
    ),
  },

  {
    id: "helmets",
    number: "05",
    question: "Do you provide helmets?",
    answer: (
      <>
        Yes. We provide high-quality helmets to ensure the safety of our
        customers.
        <br />
        <br />
        We also make sure they are kept clean and sanitized after every use.
      </>
    ),
  },

  {
    id: "tutorial",
    number: "06",
    question: "Do you provide a tutorial on how to use the scooter?",
    answer: (
      <>
        Yes. When you collect the scooter, one of our team members will guide
        you through how to use it and explain all the essential information and
        basic techniques step by step, so you can feel comfortable and
        confident using the scooter.
      </>
    ),
  },

  {
    id: "two-people",
    number: "07",
    question:
      "Can the scooter carry two people, and how much weight can it handle?",
    answer: (
      <>
        Yes. The scooter is designed to carry two people and provides
        comfortable and well-balanced seating for both riders.
        <br />
        <br />
        The rear seat also features a comfortable backrest for additional
        comfort and stability for the passenger.
        <br />
        <br />
        The scooter has enough power to carry{" "}
        <strong>two people weighing 80 kg or more each</strong>, reflecting the
        strength of its motor and overall performance.
      </>
    ),
  },

  {
    id: "hills",
    number: "08",
    question:
      "Is the scooter suitable for the hills and slopes in Tamraght and Taghazout?",
    answer: (
      <>
        Yes. The scooter is designed with enough power and performance to
        handle the roads, hills, and slopes around{" "}
        <strong>Tamraght and Taghazout</strong>, providing a smooth and powerful
        ride even in areas with steep roads and inclines.
        <br />
        <br />
        The scooter features two riding modes: <strong>Eco Mode</strong> and{" "}
        <strong>Sport Mode</strong>.
        <br />
        <br />
        Even in <strong>Eco Mode</strong>, which slightly reduces the speed,
        the scooter has enough power to carry{" "}
        <strong>two people weighing 80 kg or more each</strong>.
      </>
    ),
  },

  {
    id: "delivery",
    number: "09",
    question: "Do you offer scooter delivery?",
    answer: (
      <>
        Yes. If you are located within <strong>Tamraght</strong>, we offer
        scooter delivery.
        <br />
        <br />
        If you are outside <strong>Tamraght</strong>, or if you need more than
        one scooter,{" "}
        <strong>
          you will need to come to our location in Tamraght to collect it.
        </strong>
      </>
    ),
  },

  {
    id: "long-trip",
    number: "10",
    question:
      "Can I take the scooter on a long trip, and what happens if the battery runs out?",
    answer: (
      <>
        Yes. You can take the scooter on long trips. Many of our customers have
        used our scooters to travel to places such as{" "}
        <strong>
          Paradise, Agadir, Imsouane, Taghazout, Anza, and Aourir
        </strong>.
        <br />
        <br />
        We recommend planning your trip carefully, making sure the battery is
        charged to <strong>100%</strong> before you leave, and checking that
        there is a place at your destination where you can recharge the battery
        if needed.
        <br />
        <br />
        The customer is responsible for planning the journey and making sure
        there is enough battery or access to charging.
        <br />
        <br />
        If the trip is not properly planned and the battery runs out in a remote
        location,{" "}
        <strong>EKO KIVARA is not responsible for this situation</strong>.
      </>
    ),
  },

  {
    id: "accident",
    number: "11",
    question:
      "What happens in case of an accident or damage to the scooter?",
    answer: (
      <>
        In the event of an accident or any damage to the scooter, you must
        inform us immediately and should not attempt to repair or modify
        anything on the scooter without our permission.
        <br />
        <br />
        We handle each situation individually and work together with the
        customer to find the{" "}
        <strong>best and most suitable solution for both parties</strong>.
      </>
    ),
  },
];

export default function FAQPage() {
  return (
    <main className="overflow-hidden bg-[#F3EFE7]">
      {/* ================================================= */}
      {/* FAQ HERO */}
      {/* ================================================= */}

      <section className="faq-page-hero relative px-6 pb-28 pt-24 md:px-12 md:pb-36 md:pt-32">
        <div className="faq-background-question">?</div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-end gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="vintage-label text-[#6F7F73]">
                Everything you need to know
              </p>

              <h1 className="vintage-title retro-shadow mt-5 text-[78px] text-[#49372D] sm:text-[100px] md:text-[145px]">
                FAQ
              </h1>
            </div>

            <div className="md:pb-5">
              <p className="max-w-md border-l-2 border-[#49372D] pl-5 text-sm font-medium leading-7 text-[#6F7F73] md:text-base">
                A few useful things to know before booking your electric scooter
                and hitting the road.
              </p>

              <Link
                href="/reservation"
                className="retro-button mt-8 bg-[#DCE4C8] px-7 py-4 text-xs text-[#49372D]"
              >
                Book your ride
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* FAQ QUESTIONS */}
      {/* ================================================= */}

      <section className="bg-[#B9DCEF] px-6 pb-32 pt-24 md:px-12 md:pb-40 md:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex items-end justify-between gap-5">
            <div>
              <p className="vintage-label text-[#526B61]">
                Questions & answers
              </p>

              <h2 className="vintage-title mt-4 text-[48px] text-[#49372D] md:text-[70px]">
                BEFORE
                <br />
                YOU RIDE
              </h2>
            </div>

            <span className="hidden font-serif text-sm italic text-[#526B61] md:block">
              11 essential answers
            </span>
          </div>

          {/* FAQ LIST */}

          <div className="space-y-5">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                id={faq.id}
                className="faq-detail-card group"
              >
                <summary className="faq-detail-summary">
                  <span className="faq-detail-number">{faq.number}</span>

                  <span className="faq-detail-question">{faq.question}</span>

                  <span className="faq-detail-plus">+</span>
                </summary>

                <div className="faq-detail-answer">
                  <div className="faq-answer-line" />

                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* FINAL CTA */}
      {/* ================================================= */}

      <section className="relative bg-[#DCE4C8] px-6 py-28 text-center md:px-12 md:py-36">
        <div className="mx-auto max-w-4xl">
          <p className="vintage-label text-[#6F7F73]">
            Still ready?
          </p>

          <h2 className="vintage-title retro-shadow mt-6 text-[58px] text-[#49372D] md:text-[95px]">
            LET&apos;S
            <br />
            RIDE.
          </h2>

          <p className="mx-auto mt-7 max-w-md text-sm font-medium leading-7 text-[#66705C] md:text-base">
            Choose your dates, reserve your scooter and start your next
            adventure.
          </p>

          <Link
            href="/reservation"
            className="retro-button mt-9 bg-[#B9DCEF] px-9 py-4 text-xs text-[#49372D]"
          >
            Check availability
          </Link>
        </div>
      </section>
    </main>
  );
}