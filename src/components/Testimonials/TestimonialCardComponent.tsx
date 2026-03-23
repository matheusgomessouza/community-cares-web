import React from "react";
import { Testimonial } from "./types";

interface TestimonialCardComponentProps {
  testimonial: Testimonial;
}

export default function TestimonialCardComponent({
  testimonial,
}: TestimonialCardComponentProps) {
  return (
    <article className="bg-white rounded-2xl border border-gray/30 shadow-md hover:shadow-lg transition-shadow duration-200 p-6 h-full flex flex-col justify-between">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full bg-darkOrange text-white font-heading text-lg flex items-center justify-center"
            aria-hidden="true"
          >
            {testimonial.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-heading text-xl text-darkOrange">
              {testimonial.name}
            </h3>
            <p className="font-paragraph text-sm text-black/50">
              {testimonial.role}
            </p>
          </div>
        </div>

        <span className="font-paragraph text-xs text-black/70 bg-black/5 px-2 py-1 rounded-full">
          Story {testimonial.id}
        </span>
      </header>

      <p className="font-paragraph text-black/50 italic mt-5 leading-relaxed">
        "{testimonial.message}"
      </p>

      <footer className="mt-6 pt-4 border-t border-gray/30 flex justify-between items-center">
        <time
          className="font-paragraph text-sm text-black/80"
          dateTime={testimonial.date}
        >
          {new Date(testimonial.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        <p
          className="font-paragraph text-sm text-black/80"
          aria-label="Rated 5 out of 5 stars"
        >
          5/5
        </p>
      </footer>
    </article>
  );
}
