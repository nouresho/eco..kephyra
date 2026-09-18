import Link from "next/link";
import WhyUs from "./components/WhyUs";
import WavyDivider from "./components/WavyDivider";


/* ================================================= */
/* FAQs */
/* ================================================= */

const homeFaqs = [
  {
    number: "01",
    question: "Do I need to book in advance?",
    answer:
      "Yes, advance booking is highly recommended. Check the available dates first, then choose your rental period.",
  },
  {
    number: "02",
    question: "What is the scooter’s top speed?",
    answer:
      "The scooter can reach a top speed of 50 km/h.",
  },
  {
    number: "03",
    question: "Is there a deposit?",
    answer:
      "Yes. Your ID is held as a security deposit during the rental period and returned when the scooter is returned in the same condition.",
  },
  {
    number: "04",
    question: "How long does the battery take to charge?",
    answer:
      "The battery takes approximately 3 hours maximum to fully charge. A charger is provided with the scooter. Please do not leave the scooter charging for more than 10 hours.",
  },
  {
    number: "05",
    question: "Do you provide helmets?",
    answer:
      "Yes. We provide high-quality helmets. Every helmet is cleaned and sanitized after each use.",
  },
  {
    number: "06",
    question: "Will you show me how to use the scooter?",
    answer:
      "Yes. Before you start your rental, we provide a tutorial at collection so you know how to use the scooter safely and comfortably.",
  },
  {
    number: "07",
    question: "Can the scooter carry two people?",
    answer:
      "Yes. The scooter is designed for two people and includes a rear backrest for extra comfort. It has enough power to carry two people weighing 80 kg or more each.",
  },
  {
    number: "08",
    question:
      "Can the scooter handle the hills around Tamraght and Taghazout?",
    answer:
      "Yes. The scooter can handle the hills and slopes around Tamraght and Taghazout. It has Eco and Sport modes, and even Eco mode can carry two people weighing 80 kg or more each.",
  },
  {
    number: "09",
    question: "Do you offer scooter delivery?",
    answer:
      "Yes. Delivery is available within Tamraght. For locations outside Tamraght, or if you are renting more than one scooter, collection is available at our location in Tamraght.",
  },
  {
    number: "10",
    question: "Can I take the scooter on longer trips?",
    answer:
      "Yes. You can explore places such as Paradise Valley, Agadir, Imsouane, Taghazout, Anza and Aourir. Make sure the battery is fully charged before leaving and plan where you can recharge during your trip. You are responsible for planning your battery usage, and EKO KIVARA cannot be held responsible if the battery runs out in a remote location due to poor planning.",
  },
  {
    number: "11",
    question: "What should I do in case of an accident or damage?",
    answer:
      "Please inform us immediately if an accident or damage occurs. Do not attempt to repair or modify the scooter without our permission. We will assess the situation and find the appropriate solution on a case-by-case basis.",
  },
];


/* ================================================= */
/* TEMPORARY REVIEWS */
/* Replace with real reviews later */
/* ================================================= */

const reviews = [
  {
    name: "Sarah M.",
    rating: 5,
    text:
      "Super easy to book and the scooter was perfect for exploring the coast.",
  },
  {
    name: "Adam R.",
    rating: 5,
    text:
      "We rode from Tamraght to Taghazout. Smooth, quiet and such a fun experience.",
  },
  {
    name: "Lina K.",
    rating: 5,
    text:
      "The team explained everything before the ride and made the whole experience really easy.",
  },
];


/* ================================================= */
/* HOME */
/* ================================================= */

export default function Home() {
  return (
    <>
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

<section className="hero-home relative overflow-hidden">

  {/* DESKTOP HERO */}
  <div className="relative hidden min-h-[calc(100vh-88px)] overflow-hidden bg-[#DCE4C8] md:block">

    {/* TITLE LEFT */}
    <div
      className="
        absolute
        left-10
        top-1/2
        z-20
        w-[38%]
        -translate-y-1/2
        lg:left-14
      "
    >
      <h1 className="hero-main-title">
        <span className="hero-title-line hero-title-line--one block">
          ELECTRIC
        </span>

        <span className="hero-title-line hero-title-line--two block">
          SCOOTERS
        </span>

        <span className="hero-title-line hero-title-line--three block">
          FOR
        </span>

        <span className="hero-title-line hero-title-line--four block">
          RENTAL
        </span>
      </h1>

      <p className="hero-home-caption hero-caption-typing hero-tagline-script">
        No fuel. No smoke. No pollution.
      </p>
    </div>


    {/* ================================================= */}
{/* VIDEO — CENTER + FULL HERO HEIGHT */}
{/* ================================================= */}

<div
  className="
    absolute
    left-1/2
    top-0
    z-10
    h-full
    -translate-x-1/2
  "
>
  <video
    className="
      block
      h-full
      w-auto
      max-w-none
      object-contain
    "
    autoPlay
    muted
    loop
    playsInline
    poster="/images/hero-poster.jpg"
  >
    <source
      src="/videos/intro.mp4"
      type="video/mp4"
    />
  </video>
</div>
    

    <WavyDivider color="#F5F1E8" />
  </div>


  {/* MOBILE HERO */}
  <div className="relative min-h-[calc(100svh-90px)] md:hidden">

    <video
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      poster="/images/hero-poster.jpg"
    >
      <source
        src="/videos/intro.mp4"
        type="video/mp4"
      />
    </video>

    <div className="absolute inset-0 z-[1] bg-[#49372D]/25" />

    <div className="relative z-10 flex min-h-[calc(100svh-90px)] items-center justify-center px-4 pb-16 pt-[125px] text-center">
      <div className="w-full">

        <h1 className="hero-mobile-title">
          <span className="hero-title-line hero-title-line--one block">
            ELECTRIC
          </span>

          <span className="hero-title-line hero-title-line--two block">
            SCOOTERS
          </span>

          <span className="hero-title-line hero-title-line--three block">
            FOR
          </span>

          <span className="hero-title-line hero-title-line--four block">
            RENTAL
          </span>
        </h1>

        <p className="hero-mobile-caption hero-caption-typing hero-tagline-script">
          No fuel. No smoke. No pollution.
        </p>

      </div>
    </div>

    <WavyDivider color="#F5F1E8" />
  </div>

</section>



      {/* ================================================= */}
      {/* WHY CHOOSE US */}
      {/* ================================================= */}

      <div className="relative z-30 bg-[#F5F1E8] pt-[60px] md:pt-[85px]">
        <WhyUs />
      </div>


      {/* ================================================= */}
      {/* FAQs */}
      {/* ================================================= */}

      <section className="bg-[#F5F1E8] px-5 py-24 md:px-10 md:py-32 lg:px-14">

        <div className="mx-auto max-w-6xl">

          {/* CENTERED TITLE */}
          <div className="mb-14 text-center md:mb-20">

            <h2 className="section-title mt-5">
              FAQs
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-sm font-medium leading-7 text-[#6F7F73]">
              Everything you need to know before starting your electric
              adventure.
            </p>

          </div>


          {/* FAQ LIST */}
          <div className="border-t border-[#49372D]/20">

            {homeFaqs.map((faq) => (
              <details
                key={faq.number}
                className="group border-b border-[#49372D]/20"
              >

                <summary className="flex cursor-pointer list-none items-center gap-5 py-7 md:gap-8 md:py-9">

                  <span className="w-8 shrink-0 text-[10px] font-bold tracking-[0.16em] text-[#6F7F73]">
                    {faq.number}
                  </span>

                  <h3 className="flex-1 text-left text-[18px] font-bold leading-tight tracking-[-0.025em] text-[#49372D] md:text-[25px]">
                    {faq.question}
                  </h3>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#49372D]/25 text-xl font-light text-[#49372D] transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>

                </summary>


                <div className="pb-8 pl-[52px] pr-12 md:pb-10 md:pl-[64px]">

                  <p className="max-w-3xl text-sm font-medium leading-7 text-[#6F7F73] md:text-base">
                    {faq.answer}
                  </p>

                </div>

              </details>
            ))}

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* HOW TO BOOK */}
      {/* ================================================= */}

      <section className="bg-[#B9DCEF] px-5 py-24 md:px-10 md:py-32 lg:px-14">

        <div className="mx-auto max-w-7xl">

          {/* CENTERED TITLE */}
          <div className="mb-14 text-center md:mb-20">

            <p className="vintage-label text-[#526B61]">
              Two easy ways
            </p>

            <h2 className="section-title mt-5">
              HOW TO BOOK

            </h2>

          </div>


          {/* CARDS */}
          <div className="grid gap-5 lg:grid-cols-2">

            {/* ================================================= */}
            {/* ONLINE BOOKING */}
            {/* ================================================= */}

            <article className="flex min-h-[620px] flex-col rounded-[30px] bg-[#F5F1E8] p-7 md:p-10">

              {/* NUMBER */}
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#49372D]/30">

                <span className="text-[11px] font-bold tracking-[0.16em] text-[#49372D]">
                  01
                </span>

              </div>


              {/* LABEL */}
              <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.22em] text-[#6F7F73]">
                Online Booking
              </p>


              {/* TITLE */}
              <h3 className="mt-7 max-w-lg text-[36px] font-black leading-[1.02] tracking-[-0.045em] text-[#49372D] md:text-[48px]">
                Book and pay securely online
              </h3>


              {/* DESCRIPTION */}
              <p className="mt-7 max-w-xl text-sm font-medium leading-7 text-[#6F7F73] md:text-base">
                Check the available dates, choose your rental period and number
                of scooters, complete your details, then continue to Stripe
                Checkout. Your payment is processed securely by Stripe.
              </p>


              {/* STEPS */}
              <div className="mt-10 border-t border-[#49372D]/15">

                <div className="flex gap-5 border-b border-[#49372D]/15 py-4">

                  <span className="text-[10px] font-bold tracking-[0.14em] text-[#6F7F73]">
                    01
                  </span>

                  <p className="text-[12px] font-bold tracking-[0.04em] text-[#49372D]">
                    Choose available dates
                  </p>

                </div>


                <div className="flex gap-5 border-b border-[#49372D]/15 py-4">

                  <span className="text-[10px] font-bold tracking-[0.14em] text-[#6F7F73]">
                    02
                  </span>

                  <p className="text-[12px] font-bold tracking-[0.04em] text-[#49372D]">
                    See the calculated price
                  </p>

                </div>


                <div className="flex gap-5 py-4">

                  <span className="text-[10px] font-bold tracking-[0.14em] text-[#6F7F73]">
                    03
                  </span>

                  <p className="text-[12px] font-bold tracking-[0.04em] text-[#49372D]">
                    Pay securely with Stripe
                  </p>

                </div>

              </div>


              {/* BUTTON */}
              <div className="mt-auto pt-9">

                <Link
                  href="/date-availability"
                  className="inline-flex items-center justify-center gap-4 rounded-full bg-[#49372D] px-8 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#F5F1E8] transition-all duration-300 hover:-translate-y-1 hover:bg-[#6F7F73]"
                >
                  Book online
                  <span>→</span>
                </Link>

              </div>

            </article>


            {/* ================================================= */}
            {/* CASH PAYMENT */}
            {/* ================================================= */}

            <article className="flex min-h-[620px] flex-col rounded-[30px] bg-[#49372D] p-7 text-[#F5F1E8] md:p-10">

              {/* NUMBER */}
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25">

                <span className="text-[11px] font-bold tracking-[0.16em] text-[#B9DCEF]">
                  02
                </span>

              </div>


              {/* LABEL */}
              <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.22em] text-[#B9DCEF]">
                Cash Payment
              </p>


              {/* TITLE */}
              <h3 className="mt-7 max-w-lg text-[36px] font-black leading-[1.02] tracking-[-0.045em] text-[#F5F1E8] md:text-[48px]">
                Book with us and pay on collection
              </h3>


              {/* DESCRIPTION */}
              <p className="mt-7 max-w-xl text-sm font-medium leading-7 text-[#EADAC8] md:text-base">
                Contact us on WhatsApp to arrange your scooter. If you are in
                Tamraght, we can discuss delivery; otherwise, visit our location,
                collect your scooter and pay in cash.
              </p>


              {/* STEPS */}
              <div className="mt-10 border-t border-white/15">

                <div className="flex gap-5 border-b border-white/15 py-4">

                  <span className="text-[10px] font-bold tracking-[0.14em] text-[#B9DCEF]">
                    01
                  </span>

                  <p className="text-[12px] font-bold tracking-[0.04em] text-[#F5F1E8]">
                    Message us on WhatsApp
                  </p>

                </div>


                <div className="flex gap-5 border-b border-white/15 py-4">

                  <span className="text-[10px] font-bold tracking-[0.14em] text-[#B9DCEF]">
                    02
                  </span>

                  <p className="text-[12px] font-bold tracking-[0.04em] text-[#F5F1E8]">
                    Find our exact location
                  </p>

                </div>


                <div className="flex gap-5 py-4">

                  <span className="text-[10px] font-bold tracking-[0.14em] text-[#B9DCEF]">
                    03
                  </span>

                  <p className="text-[12px] font-bold tracking-[0.04em] text-[#F5F1E8]">
                    Pay in cash when collecting
                  </p>

                </div>

              </div>


              {/* ACTIONS */}
              <div className="mt-auto pt-9">

                <a
                  href="https://wa.me/212623201547"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-4 rounded-full bg-[#B9DCEF] px-8 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#49372D] transition-all duration-300 hover:-translate-y-1 hover:bg-[#DCE4C8]"
                >
                  WhatsApp us
                  <span>→</span>
                </a>


                <a
                  href="#find-us"
                  className="mt-5 inline-flex items-center gap-3 border-b border-[#F5F1E8]/40 pb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#F5F1E8] transition-colors hover:text-[#B9DCEF]"
                >
                  View our location
                  <span>↓</span>
                </a>

              </div>

            </article>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* REVIEWS */}
      {/* ================================================= */}

      <section className="bg-[#F5F1E8] px-5 py-24 md:px-10 md:py-32 lg:px-14">

        <div className="mx-auto max-w-7xl">

          {/* CENTERED TITLE */}
          <div className="mb-14 text-center md:mb-20">


            <h2 className="section-title mt-5">
              FROM THE ROAD
            </h2>

            <p className="mx-auto mt-5 max-w-md text-sm font-medium leading-7 text-[#6F7F73]">
              Experiences shared by people who explored the coast on two
              electric wheels.
            </p>

          </div>


          {/* ================================================= */}
          {/* REVIEW CARDS — ALL CREAMY GREEN */}
          {/* ================================================= */}

          <div className="grid gap-5 md:grid-cols-3">

            {reviews.map((review) => (
              <article
                key={review.name}
                className="
                  flex
                  min-h-[330px]
                  flex-col
                  justify-between
                  rounded-[26px]
                  border
                  border-[#49372D]/10
                  bg-[#DCE4C8]
                  p-7
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:shadow-[0_18px_40px_rgba(73,55,45,0.10)]
                  md:p-8
                "
              >

                <div>

                  {/* STARS */}
                  <div className="text-[15px] tracking-[0.12em] text-[#49372D]">
                    {"★".repeat(review.rating)}
                  </div>


                  {/* REVIEW */}
                  <p className="mt-8 text-[20px] font-bold leading-8 tracking-[-0.025em] text-[#49372D]">
                    “{review.text}”
                  </p>

                </div>


                {/* NAME */}
                <div className="mt-10 border-t border-[#49372D]/15 pt-5">

                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6F7F73]">
                    {review.name}
                  </p>

                </div>

              </article>
            ))}

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* ADD REVIEW */}
      {/* ================================================= */}

      <section className="bg-[#F3EFE7] px-5 py-24 md:px-10 md:py-32 lg:px-14">

        <div className="mx-auto max-w-6xl">

          {/* CENTERED TITLE */}
          <div className="mb-14 text-center md:mb-20">

            <p className="vintage-label text-[#6F7F73]">
              Share your ride
            </p>

            <h2 className="section-title mt-5">
              LEAVE A REVIEW.
            </h2>

            <p className="mx-auto mt-6 max-w-md text-sm font-medium leading-7 text-[#6F7F73]">
              Your review will appear after a quick approval by our team.
              Safe &amp; simple.
            </p>

          </div>


          {/* ================================================= */}
          {/* REVIEW FORM */}
          {/* ================================================= */}

          <form className="mx-auto max-w-3xl rounded-[30px] border-2 border-[#49372D]/15 bg-[#FFFDF8] p-6 shadow-[0_18px_50px_rgba(73,55,45,0.10)] md:p-10">

            {/* FORM HEADER */}
            <div className="mb-9 border-b border-[#49372D]/10 pb-6">

              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#49372D]">
                Write your review
              </p>

              <p className="mt-2 text-xs leading-5 text-[#6F7F73]">
                Fill in the fields below to share your experience.
              </p>

            </div>


            {/* NAME */}
            <div>

              <label
                htmlFor="review-name"
                className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#49372D]"
              >
                Your name
              </label>

              <input
                id="review-name"
                name="name"
                type="text"
                placeholder="Enter your name"
                className="
                  w-full
                  rounded-[14px]
                  border
                  border-[#49372D]/20
                  bg-[#F3EFE7]
                  px-5
                  py-4
                  text-[14px]
                  font-medium
                  text-[#49372D]
                  outline-none
                  transition-all
                  duration-300
                  placeholder:text-[#6F7F73]/60
                  hover:border-[#49372D]/35
                  focus:border-[#6F7F73]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#6F7F73]/10
                "
              />

            </div>


            {/* RATING */}
            <div className="mt-6">

              <label
                htmlFor="review-rating"
                className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#49372D]"
              >
                Your rating
              </label>

              <select
                id="review-rating"
                name="rating"
                defaultValue="5"
                className="
                  w-full
                  cursor-pointer
                  rounded-[14px]
                  border
                  border-[#49372D]/20
                  bg-[#F3EFE7]
                  px-5
                  py-4
                  text-[14px]
                  font-medium
                  text-[#49372D]
                  outline-none
                  transition-all
                  duration-300
                  hover:border-[#49372D]/35
                  focus:border-[#6F7F73]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#6F7F73]/10
                "
              >
                <option value="5">★★★★★ — Excellent</option>
                <option value="4">★★★★☆ — Very good</option>
                <option value="3">★★★☆☆ — Good</option>
                <option value="2">★★☆☆☆ — Fair</option>
                <option value="1">★☆☆☆☆ — Poor</option>
              </select>

            </div>


            {/* REVIEW MESSAGE */}
            <div className="mt-6">

              <label
                htmlFor="review-message"
                className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#49372D]"
              >
                Your review
              </label>

              <textarea
                id="review-message"
                name="review"
                rows={6}
                placeholder="How was your ride? Share your experience..."
                className="
                  w-full
                  resize-none
                  rounded-[14px]
                  border
                  border-[#49372D]/20
                  bg-[#F3EFE7]
                  px-5
                  py-4
                  text-[14px]
                  font-medium
                  leading-7
                  text-[#49372D]
                  outline-none
                  transition-all
                  duration-300
                  placeholder:text-[#6F7F73]/60
                  hover:border-[#49372D]/35
                  focus:border-[#6F7F73]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#6F7F73]/10
                "
              />

            </div>


            {/* SUBMIT */}
            <div className="mt-8 flex justify-center">

              <button
                type="button"
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-between
                  rounded-full
                  bg-[#49372D]
                  px-7
                  py-4
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-[#F5F1E8]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[#6F7F73]
                  sm:w-auto
                  sm:min-w-[230px]
                "
              >
                Submit review

                <span className="ml-8 text-base">
                  ↗
                </span>

              </button>

            </div>

          </form>

        </div>

      </section>


      {/* ================================================= */}
      {/* FIND US */}
      {/* ================================================= */}

      <section
        id="find-us"
        className="scroll-mt-24 bg-[#B9DCEF] px-5 pb-16 pt-24 md:px-10 md:pb-20 md:pt-32 lg:px-14"
      >

        <div className="mx-auto max-w-7xl text-center">

          <p className="vintage-label text-[#526B61]">
            Come say hi
          </p>


          <h2 className="section-title mt-5">
            FIND US
            <br />
            IN TAMRAGHT.
          </h2>


          <p className="mt-7 text-[20px] font-bold tracking-[-0.025em] text-[#49372D]">
            Tamraght, Morocco
          </p>


          <p className="mx-auto mt-3 max-w-sm text-sm font-medium leading-7 text-[#526B61]">
            Close to the beach and ready for your next coastal ride.
          </p>


          <div className="mt-6 flex flex-wrap justify-center gap-2">

            {["Tamraght", "Coast", "Morocco"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#49372D]/25 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#49372D]"
              >
                {item}
              </span>
            ))}

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* TAMRAGHT MAP */}
      {/* ================================================= */}

      <section className="bg-[#B9DCEF] px-5 pb-24 md:px-10 md:pb-32 lg:px-14">

        <div className="mx-auto max-w-7xl overflow-hidden rounded-[30px] border-2 border-[#49372D] bg-[#F5F1E8] shadow-[8px_8px_0_#49372D]">

          <iframe
            title="Tamraght Map"
            src="https://www.google.com/maps?q=Tamraght%2C%20Morocco&output=embed"
            width="100%"
            height="520"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full border-0"
          />

        </div>


        <div className="mx-auto mt-5 flex max-w-7xl items-center justify-between gap-4">

          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#526B61]">
            Tamraght · Morocco
          </p>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Tamraght%2C%20Morocco"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#49372D] underline underline-offset-4"
          >
            Open map ↗
          </a>

        </div>

      </section>

    </>
  );
}