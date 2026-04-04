import React from "react";
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import TestimonialsPage from "./page";

describe("TestimonialsPage", () => {
  it("renders hero content and initial testimonials", () => {
    render(<TestimonialsPage />);

    expect(
      screen.getByRole("heading", { name: /stories that inspire/i, level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /latest stories/i, level: 2 }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(screen.getByText(/4 stories shared/i)).toBeInTheDocument();
  });

  it("opens and closes the share story modal", async () => {
    const user = userEvent.setup();
    render(<TestimonialsPage />);

    await user.click(screen.getByRole("button", { name: /share your story/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("adds a new testimonial after form submission", async () => {
    const user = userEvent.setup();
    render(<TestimonialsPage />);

    await user.click(screen.getByRole("button", { name: /share your story/i }));

    await user.type(screen.getByLabelText(/your name/i), "Alex Johnson");
    await user.type(screen.getByLabelText(/your role/i), "Volunteer");
    await user.type(
      screen.getByRole("textbox", { name: /^testimonial$/i }),
      "I found nearby help quickly and the information was accurate.",
    );

    await user.click(screen.getByRole("button", { name: /publish story/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText(/5 stories shared/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /alex johnson/i }),
    ).toBeInTheDocument();
  });

  it("has no detectable accessibility violations on initial render", async () => {
    const { container } = render(<TestimonialsPage />);

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("has no detectable accessibility violations with modal open", async () => {
    const user = userEvent.setup();
    const { container } = render(<TestimonialsPage />);

    await user.click(screen.getByRole("button", { name: /share your story/i }));

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
