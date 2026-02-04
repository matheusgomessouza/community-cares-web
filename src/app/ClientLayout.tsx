"use client";

import { MdOutlineHandshake } from "react-icons/md";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [authProvider, setAuthProvider] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const [userData, setUserData] = useState<{
    name: string;
    avatar_url: string;
  }>({
    name: "",
    avatar_url: "",
  });

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Testimonials", href: "#" },
  ];

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUserData({ name: "", avatar_url: "" });
      setAuthProvider("");
      setIsLoggedIn(false);
      setIsUserDropdownOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
      setUserData({ name: "", avatar_url: "" });
      setAuthProvider("");
      setIsLoggedIn(false);
      setIsUserDropdownOpen(false);
      window.location.href = "/";
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkAuthAndFetchData = async () => {
      try {
        const { data } = await api.get("/auth/me");
        if (data && (data.name || data.avatar_url || data.provider)) {
          setIsLoggedIn(true);
          setUserData({
            name: data.name ?? "",
            avatar_url: data.avatar_url ?? "",
          });
          setAuthProvider(data.provider ?? "");
        } else {
          setIsLoggedIn(false);
          setUserData({ name: "", avatar_url: "" });
          setAuthProvider("");
        }
      } catch (error) {
        if (!mounted) return;
        setIsLoggedIn(false);
        setUserData({ name: "", avatar_url: "" });
        setAuthProvider("");
        console.error("/auth/me failed", error);
      }
    };

    checkAuthAndFetchData();

    return () => {
      mounted = false;
    };
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 max-w-full">
            <a
              href="/"
              className="flex items-center gap-2 cursor-pointer group min-w-fit"
            >
              <div className="w-10 h-10 bg-darkOrange rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-sm">
                <MdOutlineHandshake className="w-6 h-6" />
              </div>
              <h1 className="font-heading text-xl tracking-tight transition-colors whitespace-nowrap">
                <span className="text-darkOrange">Community Cares</span>
              </h1>
            </a>

            <nav
              className="hidden md:flex items-center gap-8 flex-1 justify-center mx-8"
              aria-label="Main navigation"
            >
              <ul className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-base font-bold font-paragraph text-darkOrange hover:text-orange transition-colors relative py-2 group whitespace-nowrap"
                    >
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-darkOrange transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden md:flex items-center gap-4 min-w-fit">
              {isLoggedIn ? (
                <>
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-darkOrange"
                    aria-label="View notifications"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </button>

                  <div className="relative">
                    <div className="flex items-center gap-3 group">
                      {userData.avatar_url ? (
                        <Image
                          src={userData.avatar_url}
                          alt={userData.name || "User"}
                          width={40}
                          height={40}
                          className="rounded-full ring-2 ring-transparent group-hover:ring-orange-200 transition-all object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center ring-2 ring-transparent group-hover:ring-orange-200 transition-all overflow-hidden">
                          <span className="text-white text-sm font-semibold">
                            {userData.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="text-left">
                          <p className="text-sm font-semibold leading-none text-darkOrange">
                            {userData.name}
                          </p>
                          <p className="text-xs mt-1 text-gray">
                            {authProvider}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setIsUserDropdownOpen(!isUserDropdownOpen)
                          }
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          aria-label="Toggle user menu"
                        >
                          <svg
                            className={`w-4 h-4 transition-transform stroke-gray ${isUserDropdownOpen ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-darkOrange hover:bg-orange-50 transition-colors flex items-center gap-2"
                          aria-label="Log out"
                        >
                          <svg
                            className="w-4 h-4 stroke-darkOrange"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span className="text-zinc-400">Log out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="min-w-fit w-[200px]"></div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-darkOrange hover:text-orange focus:outline-none focus:ring-2 focus:ring-inset focus:ring-darkOrange transition-colors"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 top-16 bg-white z-40 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <nav className="flex-1 px-6 py-8" aria-label="Mobile navigation">
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="block text-2xl font-bold font-paragraph text-darkOrange hover:text-orange transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {isLoggedIn && (
              <footer className="border-t border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {userData.avatar_url ? (
                      <Image
                        src={userData.avatar_url}
                        alt={userData.name || "User"}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          {userData.name
                            ? userData.name.charAt(0).toUpperCase()
                            : "U"}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-base font-semibold text-darkOrange">
                        {userData.name || "Loading..."}
                      </p>
                      <p className="text-sm text-gray">{authProvider}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 text-darkOrange hover:text-orange transition-colors"
                    aria-label="Log out"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </div>
              </footer>
            )}
          </div>
        )}
      </header>
      <main id="main-content">{children}</main>
    </>
  );
}
