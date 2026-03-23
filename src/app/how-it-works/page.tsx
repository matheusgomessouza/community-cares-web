"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  MdAddLocationAlt,
  MdOutlinePhotoCamera,
  MdDescription,
  MdVerified,
  MdVolunteerActivism,
} from "react-icons/md";
import {
  FaMapMarkedAlt,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

// Metadata (considere mover para layout.tsx se usar App Router com Server Components)
// export const metadata = {
//   title: "How It Works | Shared Locations - Community Cares",
//   description: "Learn how to share free food locations and help your community. A simple guide to adding new donation points.",
// };

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({
  stepNumber,
  title,
  description,
  icon,
}) => {
  return (
    <div
      className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-2xl shadow-md border-l-4 border-darkOrange relative overflow-hidden"
      role="listitem"
    >
      <div
        className="absolute -right-4 -top-4 text-gray/10 text-9xl font-heading pointer-events-none select-none"
        aria-hidden="true"
      >
        {stepNumber}
      </div>

      <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-orange/10 rounded-full text-darkOrange text-3xl">
        {icon}
      </div>

      <div className="flex-1 z-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-darkOrange text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Step {stepNumber}
          </span>
          <h3 className="font-heading text-xl text-darkOrange font-bold">
            {title}
          </h3>
        </div>
        <p className="font-paragraph text-gray text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

interface TipCardProps {
  type: "success" | "warning";
  title: string;
  children: React.ReactNode;
}

const TipCard: React.FC<TipCardProps> = ({ type, title, children }) => {
  const isSuccess = type === "success";
  const bgClass = isSuccess
    ? "bg-green-50 border-green-200"
    : "bg-yellow-50 border-yellow-200";
  const titleColor = isSuccess ? "text-green-700" : "text-yellow-700";
  const Icon = isSuccess ? FaCheckCircle : FaExclamationCircle;

  return (
    <div className={`p-5 rounded-xl border ${bgClass} flex gap-4 items-start`}>
      <Icon className={`flex-shrink-0 mt-1 ${titleColor}`} aria-hidden="true" />
      <div>
        <h4 className={`font-heading text-lg mb-1 ${titleColor}`}>{title}</h4>
        <div className="font-paragraph text-gray text-sm">{children}</div>
      </div>
    </div>
  );
};

export default function HowItWorksPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const steps = [
    {
      title: "Locate the Spot",
      description:
        "Found a place offering free food? Open the map and pinpoint the exact location. Verify the address is correct so others can find it easily.",
      icon: <MdAddLocationAlt />,
    },
    {
      title: "Fill in Details",
      description:
        "Add essential info: Name of the organization, opening hours, type of food provided, and any accessibility details.",
      icon: <MdDescription />,
    },
    {
      title: "Add a Photo",
      description:
        "A picture helps people recognize the place. Snap a clear photo of the entrance or the food distribution area.",
      icon: <MdOutlinePhotoCamera />,
    },
    {
      title: "Submit for Review",
      description:
        "Send your submission! Our team will quickly verify the information to ensure safety and accuracy before publishing.",
      icon: <MdVerified />,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-orange/5 pb-20">
      <section
        className="bg-darkOrange text-white pt-20 pb-24 px-4 sticky-hero-pattern relative overflow-hidden"
        aria-labelledby="main-heading"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <FaMapMarkedAlt className="text-9xl text-white" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in-up">
            <MdVolunteerActivism className="text-white" />
            <span className="font-paragraph text-sm font-medium">
              Community Contributors
            </span>
          </div>

          <h1
            id="main-heading"
            className="font-heading text-4xl sm:text-5xl md:text-6xl mb-6 shadow-text"
          >
            Share Kindness, <br /> Map the Way.
          </h1>
          <p className="font-paragraph text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            By sharing a verified food donation location, you connect someone in
            need with their next meal. It takes less than 2 minutes to make a
            lasting impact. 🧡
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 relative z-20">
        <section
          className="bg-white rounded-2xl shadow-xl p-8 mb-12 text-center"
          aria-labelledby="intro-heading"
        >
          <h2
            id="intro-heading"
            className="font-heading text-2xl text-darkOrange mb-4 font-bold"
          >
            How Sharing Works
          </h2>
          <p className="font-paragraph text-gray mb-0 max-w-3xl mx-auto">
            Our platform relies on community heroes like you. We verify every
            submission to maintain a safe and reliable database for everyone.
            Here is the simple journey from spotting a location to helping
            someone find it.
          </p>
        </section>

        <section aria-label="Step by step guide">
          <ol className="space-y-6">
            {steps.map((step, index) => (
              <li key={index}>
                <StepCard
                  stepNumber={index + 1}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                />
              </li>
            ))}
          </ol>
        </section>

        <section
          className="mt-16 grid md:grid-cols-2 gap-6"
          aria-labelledby="tips-heading"
        >
          <div className="md:col-span-2 text-center mb-4">
            <h2
              id="tips-heading"
              className="font-heading text-3xl text-darkOrange"
            >
              Tips for Great Contributions
            </h2>
          </div>

          <TipCard type="success" title="Do's">
            <ul className="list-disc pl-4 space-y-1 mt-2">
              <li>Verify the operating hours if posted</li>
              <li>Ask permission before taking photos of people</li>
              <li>Note if the location is wheelchair accessible</li>
            </ul>
          </TipCard>

          <TipCard type="warning" title="Don'ts">
            <ul className="list-disc pl-4 space-y-1 mt-2">
              <li>Don't submit private residences</li>
              <li>Avoid blurry or dark photos</li>
              <li>Don't guess—if you aren't sure, add a note</li>
            </ul>
          </TipCard>
        </section>

        <section
          className="mt-20 text-center mb-10"
          aria-labelledby="cta-heading"
        >
          <h2
            id="cta-heading"
            className="font-heading text-3xl md:text-4xl text-darkOrange mb-6"
          >
            Ready to make a difference?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isLoggedIn ? (
              <Link
                href="/location"
                className="bg-darkOrange text-white font-paragraph font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-orange transition-transform hover:-translate-y-1 focus:ring-4 focus:ring-orange/30 flex items-center gap-2"
              >
                <MdAddLocationAlt aria-hidden="true" />
                Add a Location Now
              </Link>
            ) : (
              <button
                disabled
                className="bg-gray text-white font-paragraph font-bold text-lg px-8 py-4 rounded-full cursor-not-allowed flex items-center gap-2 opacity-70"
                aria-disabled="true"
                title="Please log in to add a location"
              >
                <MdAddLocationAlt aria-hidden="true" />
                Add a Location Now
              </button>
            )}
            {!isLoggedIn && (
              <Link
                href="/"
                className="text-gray underline hover:text-darkOrange font-paragraph transition-colors"
              >
                Back to Login
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
