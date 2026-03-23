"use client";

import React, { useEffect, useRef, useState } from "react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  date: string;
}

const initialTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Lorem Ipsum",
    role: "Community Organizer",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "2023-10-15",
  },
  {
    id: "2",
    name: "Dolor Sit",
    role: "Volunteer",
    message:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    date: "2023-11-20",
  },
  {
    id: "3",
    name: "Amet Consectetur",
    role: "Local Business Owner",
    message:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    date: "2023-12-05",
  },
  {
    id: "4",
    name: "Adipiscing Elit",
    role: "Resident",
    message:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: "2024-01-12",
  },
];

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(initialTestimonials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    message: "",
  });

  const openModalButtonRef = useRef<HTMLButtonElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isModalOpen) {
      openModalButtonRef.current?.focus();
      return;
    }

    nameInputRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name || !formData.role || !formData.message) return;

    const newTestimonial: Testimonial = {
      id: (testimonials.length + 1).toString(),
      name: formData.name,
      role: formData.role,
      message: formData.message,
      date: new Date().toISOString().split("T")[0],
    };

    setTestimonials((prev) => [newTestimonial, ...prev]);
    setFormData({ name: "", role: "", message: "" });
    setIsModalOpen(false);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 sm:p-8 space-y-8 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <header>
          <h1 className="font-heading text-3xl sm:text-4xl text-darkOrange">
            Testimonials
          </h1>
          <p className="font-paragraph text-black/70 mt-2">
            See what our community members are saying about us
          </p>
        </header>

        <button
          ref={openModalButtonRef}
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-orange hover:bg-darkOrange text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 shadow-lg"
        >
          + Share Your Story
        </button>
      </div>

      <section
        aria-label="Testimonials summary"
        className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center space-x-3">
          <svg
            className="w-6 h-6 text-orange"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="font-paragraph text-black/80">
            Total Stories Shared:{" "}
            <span className="font-bold text-darkOrange">
              {testimonials.length}
            </span>
          </p>
        </div>
      </section>

      <section aria-labelledby="testimonials-list-title">
        <h2 id="testimonials-list-title" className="sr-only">
          Testimonials list
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <li key={testimonial.id}>
              <article className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 bg-gradient-to-br from-orange to-darkOrange rounded-full flex items-center justify-center text-white font-bold font-heading"
                        aria-hidden="true"
                      >
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-heading text-lg text-black/90">
                          {testimonial.name}
                        </h3>
                        <p className="font-paragraph text-xs text-black/70">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    <span className="font-paragraph text-xs text-black/60 bg-black/5 px-2 py-1 rounded-full">
                      #{testimonial.id}
                    </span>
                  </div>

                  <p className="font-paragraph text-black/80 italic">
                    "{testimonial.message}"
                  </p>
                </div>

                <footer className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <time
                    className="font-paragraph text-xs text-black/60"
                    dateTime={testimonial.date}
                  >
                    {new Date(testimonial.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>

                  <div
                    className="flex space-x-1"
                    aria-label="Rated 5 out of 5 stars"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-4 h-4 text-orange"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl relative"
            role="dialog"
            aria-modal="true"
            aria-labelledby="testimonial-modal-title"
            aria-describedby="testimonial-modal-description"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                id="testimonial-modal-title"
                className="font-heading text-2xl text-darkOrange"
              >
                Share Your Story
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close testimonial form"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p
              id="testimonial-modal-description"
              className="font-paragraph text-sm text-black/70 mb-4"
            >
              Fill in your details to publish a testimonial card.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-black/80 mb-1 font-paragraph"
                >
                  Your Name
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  autoComplete="name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-colors"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-black/80 mb-1 font-paragraph"
                >
                  Your Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-colors"
                  placeholder="e.g. Volunteer"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-black/80 mb-1 font-paragraph"
                >
                  Testimonial
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-colors resize-none"
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-black/70 hover:text-black/90 font-medium transition-colors font-paragraph"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange hover:bg-darkOrange text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 shadow-md font-paragraph"
                >
                  Submit Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
