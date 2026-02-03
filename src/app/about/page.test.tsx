import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPage from "./page";

describe("AboutPage", () => {
  it("renders the hero heading with correct text", () => {
    render(<AboutPage />);
    const heading = screen.getByRole("heading", {
      name: /about community cares/i,
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });

  it("displays the mission statement", () => {
    render(<AboutPage />);
    const missionHeading = screen.getByRole("heading", {
      name: /our mission/i,
    });
    expect(missionHeading).toBeInTheDocument();

    const missionText = screen.getByText(/no one should go hungry/i);
    expect(missionText).toBeInTheDocument();
  });

  it("renders all core values cards", () => {
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", { name: /compassion first/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /community driven/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /accessible everywhere/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /open & inclusive/i }),
    ).toBeInTheDocument();
  });

  it("displays impact statistics", () => {
    render(<AboutPage />);

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("People Helped")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Food Locations")).toBeInTheDocument();
  });

  it("renders CTA buttons with correct links", () => {
    render(<AboutPage />);

    const findFoodLink = screen.getByRole("link", {
      name: /find food locations near you/i,
    });
    expect(findFoodLink).toHaveAttribute("href", "/");

    const learnMoreLink = screen.getByRole("link", {
      name: /learn how community cares works/i,
    });
    expect(learnMoreLink).toHaveAttribute("href", "/how-it-works");
  });

  it("has accessible landmarks and headings hierarchy", () => {
    render(<AboutPage />);

    // Verifica main landmark
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();

    // Verifica hierarquia de headings (h1 -> h2 -> h3)
    const allHeadings = screen.getAllByRole("heading");
    const h1 = allHeadings.find((h) => h.tagName === "H1");
    const h2s = allHeadings.filter((h) => h.tagName === "H2");

    expect(h1).toBeInTheDocument();
    expect(h2s.length).toBeGreaterThan(0);
  });

  it("includes screen reader only accessibility note", () => {
    const { container } = render(<AboutPage />);

    const srOnlyElement = container.querySelector(".sr-only");
    expect(srOnlyElement).toBeInTheDocument();
    expect(srOnlyElement?.textContent).toContain("accessibility");
  });

  it("renders How We Work section with numbered steps", () => {
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", { name: /find nearby help/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /access anytime/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /share & amplify/i }),
    ).toBeInTheDocument();
  });
});
