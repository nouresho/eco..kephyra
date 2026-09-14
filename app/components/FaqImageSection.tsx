import Link from "next/link";

export default function FaqImageSection() {
  return (
    <section className="faq-image-section">

      <div className="faq-image-container">

        <Link
          href="/faq"
          className="faq-image-card group"
          aria-label="Go to FAQs"
        >

          {/* IMAGE - ORIGINAL RATIO */}
          <img
            src="/images/faq.jpg"
            alt="ECO KEPHYRA FAQs"
            className="faq-image"
          />

          {/* LIGHT OVERLAY */}
          <div className="faq-image-overlay" />

          {/* CENTER CONTENT */}
          <div className="faq-image-content">

            <div className="faq-image-content-inner">

              <p className="faq-image-small">
                Need to know something?
              </p>

              <h2 className="faq-image-title">
                FAQS
              </h2>

            </div>

          </div>

        </Link>

      </div>

    </section>
  );
}