import React from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { MdVolunteerActivism } from "react-icons/md";

interface TestimonialsHeroComponentProps {
  totalStories: number;
  onOpenModal: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

export default function TestimonialsHeroComponent({
  totalStories,
  onOpenModal,
  triggerRef,
}: TestimonialsHeroComponentProps) {
  return (
    <>
      <section
        className="bg-darkOrange text-white pt-20 pb-24 px-4 sticky-hero-pattern"
        aria-labelledby="testimonials-hero-heading"
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
            <MdVolunteerActivism aria-hidden="true" />
            <span className="font-paragraph text-sm font-medium">
              Community Voices
            </span>
          </div>

          <h1
            id="testimonials-hero-heading"
            className="font-heading text-4xl sm:text-5xl md:text-6xl mb-5"
          >
            Stories That Inspire
          </h1>
          <p className="font-paragraph text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
            Read real experiences from residents, volunteers, and organizers
            helping neighbors find food support with dignity and care.
          </p>
        </div>
      </section>

      <section
        className="max-w-5xl mx-auto px-4 sm:px-6 -mt-14 relative z-10"
        aria-labelledby="testimonials-summary-heading"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray/40 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-3">
            <span
              className="bg-orange/10 text-darkOrange rounded-full p-3"
              aria-hidden="true"
            >
              <FaQuoteLeft className="text-xl" />
            </span>
            <div>
              <h2
                id="testimonials-summary-heading"
                className="font-heading text-2xl text-darkOrange"
              >
                Community Testimonials
              </h2>
              <p className="font-paragraph text-black/50 mt-1">
                {totalStories} stories shared by people making a difference.
              </p>
            </div>
          </div>

          <button
            ref={triggerRef}
            type="button"
            onClick={onOpenModal}
            className="bg-orange text-white font-paragraph font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-darkOrange  transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Share Your Story
          </button>
        </div>
      </section>
    </>
  );
}
