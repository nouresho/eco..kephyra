"use client";

import { useState } from "react";
import { faqs } from "../faq/page";

export default function FaqImageSection() {
  const [showAll, setShowAll] = useState(false);
  const visibleFaqs = showAll ? faqs : faqs.slice(0, 5);

  return (
    <section className="home-faq-section bg-[#B9DCEF] px-6 pb-20 pt-12 md:px-12 md:pb-28 md:pt-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <p className="vintage-label text-[#526B61]">Questions & answers</p>
            <h2 className="home-faq-heading vintage-title mt-3 text-[#49372D]">
              BEFORE
              <br />
              YOU RIDE
            </h2>
          </div>

          <span className="hidden font-serif text-sm italic text-[#526B61] md:block">
            {showAll ? "All answers open" : "5 essential answers"}
          </span>
        </div>

        <div className="space-y-4">
          {visibleFaqs.map((faq) => (
            <details key={faq.id} id={faq.id} className="home-faq-card faq-detail-card group">
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

        <div className="mt-5 flex justify-start">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="border-0 bg-transparent p-0 text-left font-medium uppercase tracking-[0.08em] text-[#49372D] transition-opacity hover:opacity-80"
            aria-expanded={showAll}
          >
            {showAll ? "See less" : "See more"}
          </button>
        </div>
      </div>
    </section>
  );
}