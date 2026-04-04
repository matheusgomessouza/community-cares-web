"use client";

import React, { useEffect, useRef, useState } from "react";
import TestimonialCardComponent from "@/components/Testimonials/TestimonialCardComponent";
import ShareStoryModalComponent from "@/components/Testimonials/ShareStoryModalComponent";
import TestimonialsHeroComponent from "@/components/Testimonials/TestimonialsHeroComponent";
import { StoryFormData, Testimonial } from "@/components/Testimonials/types";

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
  const [formData, setFormData] = useState<StoryFormData>({
    name: "",
    role: "",
    message: "",
  });

  const openModalButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isModalOpen) {
      openModalButtonRef.current?.focus();
    }
  }, [isModalOpen]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name || !formData.role || !formData.message) return;

    setTestimonials((prev) => {
      const newTestimonial: Testimonial = {
        id: (prev.length + 1).toString(),
        name: formData.name,
        role: formData.role,
        message: formData.message,
        date: new Date().toISOString().split("T")[0],
      };

      return [newTestimonial, ...prev];
    });
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
    <main className="min-h-screen bg-gradient-to-br from-white to-orange/10 pb-20">
      <TestimonialsHeroComponent
        totalStories={testimonials.length}
        onOpenModal={() => setIsModalOpen(true)}
        triggerRef={openModalButtonRef}
      />

      <section
        className="max-w-5xl mx-auto px-4 sm:px-6 mt-12"
        aria-labelledby="testimonials-list-title"
      >
        <h2
          id="testimonials-list-title"
          className="font-heading text-3xl text-darkOrange mb-6"
        >
          Latest Stories
        </h2>

        <ol
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          aria-live="polite"
        >
          {testimonials.map((testimonial) => (
            <li key={testimonial.id}>
              <TestimonialCardComponent testimonial={testimonial} />
            </li>
          ))}
        </ol>
      </section>

      <ShareStoryModalComponent
        isOpen={isModalOpen}
        formData={formData}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
      />
    </main>
  );
}
