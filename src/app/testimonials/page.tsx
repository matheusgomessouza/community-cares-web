import React from "react";
import Link from "next/link";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  date: string;
}

const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Community Organizer",
    message:
      "Community Cares has completely transformed how we coordinate local events. The platform is intuitive and the support is amazing!",
    date: "2023-10-15",
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Volunteer",
    message:
      "I love how easy it is to find opportunities to help out in my neighborhood. This app really brings people together.",
    date: "2023-11-20",
  },
  {
    id: "3",
    name: "Emily Davis",
    role: "Local Business Owner",
    message:
      "A fantastic initiative. We've been able to connect with so many wonderful volunteers through this platform.",
    date: "2023-12-05",
  },
  {
    id: "4",
    name: "David Wilson",
    role: "Resident",
    message:
      "Finally, a simple way to give back to the community without all the red tape. Highly recommended!",
    date: "2024-01-12",
  },
];

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-6 sm:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl text-darkOrange">
            Testimonials
          </h1>
          <p className="font-paragraph text-black/60 mt-2">
            See what our community members are saying about us
          </p>
        </div>
        <button className="bg-orange hover:bg-darkOrange text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 shadow-lg">
          + Share Your Story
        </button>
      </div>

      {/* Stats Section */}
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <svg
            className="w-6 h-6 text-orange"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="font-paragraph text-black/80">
            Total Stories Shared:{" "}
            <span className="font-bold text-darkOrange">
              {mockTestimonials.length}
            </span>
          </p>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockTestimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange to-darkOrange rounded-full flex items-center justify-center text-white font-bold font-heading">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-black/90">
                      {testimonial.name}
                    </h3>
                    <p className="font-paragraph text-xs text-black/60">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <span className="font-paragraph text-xs text-black/40 bg-black/5 px-2 py-1 rounded-full">
                  #{testimonial.id}
                </span>
              </div>
              <p className="font-paragraph text-black/70 italic">
                "{testimonial.message}"
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="font-paragraph text-xs text-black/40">
                {new Date(testimonial.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 text-orange"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
