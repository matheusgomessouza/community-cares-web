"use client";

import React from "react";
import {
  MdFoodBank,
  MdGroups,
  MdLocationOn,
  MdVolunteerActivism,
} from "react-icons/md";
import { FaHeart, FaHandsHelping, FaMapMarkedAlt } from "react-icons/fa";

// Metadata for SEO (Note: para usar metadata em client component, considere separar em layout.tsx ou usar generateMetadata)
// export const metadata: Metadata = {
//   title: "About Us | Community Cares - Connecting Communities Through Food",
//   description: "Learn about Community Cares' mission to connect people in need with free food locations. Discover how we're making a difference in communities.",
//   openGraph: {
//     title: "About Community Cares",
//     description: "Connecting people to free food giveaway locations with accessibility and care.",
//     type: "website",
//   },
// };

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description }) => {
  return (
    <article
      className="flex flex-col items-center text-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 focus-within:ring-2 focus-within:ring-darkOrange focus-within:ring-offset-2"
      role="article"
      aria-labelledby={`value-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="text-darkOrange text-5xl mb-4" aria-hidden="true">
        {icon}
      </div>
      <h3
        id={`value-${title.toLowerCase().replace(/\s+/g, "-")}`}
        className="font-heading text-xl md:text-2xl text-darkOrange mb-3"
      >
        {title}
      </h3>
      <p className="font-paragraph text-gray text-sm md:text-base leading-relaxed">
        {description}
      </p>
    </article>
  );
};

interface StatCardProps {
  number: string;
  label: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, icon }) => {
  return (
    <div
      className="flex flex-col items-center text-center p-4"
      role="group"
      aria-label={`${number} ${label}`}
    >
      <div className="text-orange text-4xl mb-2" aria-hidden="true">
        {icon}
      </div>
      <div className="font-heading text-3xl md:text-4xl text-darkOrange mb-2">
        {number}
      </div>
      <p className="font-paragraph text-gray text-sm md:text-base">{label}</p>
    </div>
  );
};

export default function AboutPage() {
  const coreValues = [
    {
      icon: <FaHeart />,
      title: "Compassion First",
      description:
        "We believe everyone deserves access to nutritious food and dignity. Our platform is built with empathy at its core.",
    },
    {
      icon: <MdGroups />,
      title: "Community Driven",
      description:
        "Together we're stronger. We empower communities to share resources and support each other through challenging times.",
    },
    {
      icon: <MdLocationOn />,
      title: "Accessible Everywhere",
      description:
        "Mobile-first design ensures anyone with a phone can find help nearby, anytime, anywhere.",
    },
    {
      icon: <FaHandsHelping />,
      title: "Open & Inclusive",
      description:
        "No barriers, no judgment. Our service is free, anonymous, and welcoming to all who need it.",
    },
  ];

  const impactStats = [
    { number: "0", label: "People Helped", icon: <MdGroups /> },
    { number: "1", label: "Food Locations", icon: <MdFoodBank /> },
    { number: "1", label: "Cities Covered", icon: <FaMapMarkedAlt /> },
    { number: "1", label: "Volunteers", icon: <MdVolunteerActivism /> },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-orange/10">
      <section
        className="bg-darkOrange text-white py-16 px-4 sm:px-8 md:px-16 lg:px-24"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1
            id="hero-heading"
            className="font-heading text-4xl sm:text-5xl md:text-6xl mb-6"
          >
            About
          </h1>
          <p className="font-paragraph text-lg sm:text-xl md:text-2xl leading-relaxed mb-8 text-white/90">
            We connect people in need with free food giveaway locations through
            an accessible, compassionate platform. Because everyone deserves a
            helping hand.
          </p>
          <div
            className="inline-flex items-center gap-2 text-white/80 font-paragraph text-sm md:text-base"
            role="note"
            aria-label="Our mission"
          >
            <FaHeart className="text-white" aria-hidden="true" />
            <span>Built with care for those who need it most</span>
          </div>
        </div>
      </section>

      <section
        className="py-12 px-4 sm:px-8 md:px-16 lg:px-24"
        aria-labelledby="mission-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2
            id="mission-heading"
            className="font-heading text-3xl sm:text-4xl text-darkOrange text-center mb-8 font-bold"
          >
            Our Mission
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <p className="font-paragraph text-gray text-base md:text-lg leading-relaxed mb-6">
              <strong className="text-darkOrange">Community Cares</strong> was
              born from a simple belief: no one should go hungry when help is
              available nearby. We created an easy-to-use mobile app that
              bridges the gap between people experiencing food insecurity and
              local organizations offering free meals and groceries.
            </p>
            <p className="font-paragraph text-gray text-base md:text-lg leading-relaxed mb-6">
              Our interactive map, advanced filters, and accessibility-first
              design ensure that finding help is just a few taps away—even for
              those with limited internet access or disabilities.
            </p>
            <p className="font-paragraph text-gray text-base md:text-lg leading-relaxed">
              Beyond connecting people to food, we're building a movement of
              compassion. We empower volunteers, organizations, and communities
              to share resources and amplify their impact. Together, we're
              creating a safety net that catches everyone.
            </p>
          </div>
        </div>
      </section>

      <section
        className="py-12 px-4 sm:px-8 md:px-16 lg:px-24 bg-white/50"
        aria-labelledby="values-heading"
      >
        <div className="max-w-6xl mx-auto">
          <h2
            id="values-heading"
            className="font-heading text-3xl sm:text-4xl text-darkOrange text-center mb-12 font-bold"
          >
            Our Core Values
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            role="list"
            aria-label="Core values"
          >
            {coreValues.map((value, index) => (
              <ValueCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-12 px-4 sm:px-8 md:px-16 lg:px-24"
        aria-labelledby="impact-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            id="impact-heading"
            className="font-heading text-3xl sm:text-4xl text-darkOrange text-center mb-4 font-bold"
          >
            Our Impact
          </h2>
          <p className="font-paragraph text-gray text-center text-base md:text-lg mb-12 max-w-2xl mx-auto">
            Every connection made through Community Cares represents a person
            helped, a community strengthened, and hope restored.
          </p>
          <div
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
            role="region"
            aria-label="Impact statistics"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {impactStats.map((stat, index) => (
                <StatCard
                  key={index}
                  number={stat.number}
                  label={stat.label}
                  icon={stat.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-12 px-4 sm:px-8 md:px-16 lg:px-24 bg-white/50"
        aria-labelledby="how-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2
            id="how-heading"
            className="font-heading text-3xl sm:text-4xl text-darkOrange text-center mb-12 font-bold"
          >
            How We Work
          </h2>
          <div className="space-y-6">
            <article className="flex gap-4 items-start">
              <div
                className="flex-shrink-0 w-12 h-12 bg-darkOrange text-white rounded-full flex items-center justify-center font-heading text-xl"
                aria-hidden="true"
              >
                1
              </div>
              <div>
                <h3 className="font-heading text-xl text-darkOrange mb-2 font-bold">
                  Find Nearby Help
                </h3>
                <p className="font-paragraph text-gray text-sm md:text-base leading-relaxed">
                  Use our interactive map to discover free food locations near
                  you, filtered by address, category, and operating hours.
                </p>
              </div>
            </article>

            <article className="flex gap-4 items-start">
              <div
                className="flex-shrink-0 w-12 h-12 bg-darkOrange text-white rounded-full flex items-center justify-center font-heading text-xl"
                aria-hidden="true"
              >
                2
              </div>
              <div>
                <h3 className="font-heading text-xl text-darkOrange mb-2 font-bold">
                  Access Anytime
                </h3>
                <p className="font-paragraph text-gray text-sm md:text-base leading-relaxed">
                  Our mobile-first design works on any device with an internet
                  connection, ensuring accessibility for all users.
                </p>
              </div>
            </article>

            <article className="flex gap-4 items-start">
              <div
                className="flex-shrink-0 w-12 h-12 bg-darkOrange text-white rounded-full flex items-center justify-center font-heading text-xl"
                aria-hidden="true"
              >
                3
              </div>
              <div>
                <h3 className="font-heading text-xl text-darkOrange mb-2 font-bold">
                  Share & Amplify
                </h3>
                <p className="font-paragraph text-gray text-sm md:text-base leading-relaxed">
                  Community members can share new food locations, expanding the
                  network and helping more people in need.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        className="py-16 px-4 sm:px-8 md:px-16 lg:px-24 bg-darkOrange text-white"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            id="cta-heading"
            className="font-heading text-3xl sm:text-4xl md:text-5xl mb-6 font-bold"
          >
            Join Our Community
          </h2>
          <p className="font-paragraph text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
            Whether you need help or want to help others, Community Cares
            welcomes you. Together, we can ensure no one goes hungry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/"
              className="inline-block bg-white text-darkOrange font-paragraph font-semibold px-8 py-4 rounded-full border-2 border-transparent hover:bg-orange/10 hover:border-white hover:text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg"
              aria-label="Find food locations near you"
            >
              Find Food Locations
            </a>
            <a
              href="/how-it-works"
              className="inline-block border-2 border-white text-white font-paragraph font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-darkOrange transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label="Learn how Community Cares works"
            >
              Learn How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Accessibility Note (visible only to screen readers) */}
      <div
        className="sr-only"
        role="complementary"
        aria-label="Accessibility information"
      >
        <p>
          This page is designed with accessibility in mind. All interactive
          elements are keyboard navigable, and screen reader friendly. If you
          encounter any accessibility issues, please contact us.
        </p>
      </div>
    </main>
  );
}
