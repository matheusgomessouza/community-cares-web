import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfileBoxContainerComponent from "./ProfileBoxContainerComponent";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("ProfileBoxContainerComponent", () => {
  beforeEach(() => {
    pushMock.mockReset();
    sessionStorage.clear();
  });

  it("renders with opacity-0 when not hovered", () => {
    render(<ProfileBoxContainerComponent isHovered={false} />);
    const text = screen.getByText("Log out");
    const container = text.closest("div");
    expect(container?.className).toContain("opacity-0");
  });

  it("renders with opacity-100 when hovered", () => {
    render(<ProfileBoxContainerComponent isHovered />);
    const text = screen.getByText("Log out");
    const container = text.closest("div");
    expect(container?.className).toContain("opacity-100");
  });

  it("clears tokens and navigates on logout click", () => {
    sessionStorage.setItem("github-token", "x");
    sessionStorage.setItem("google-token", "y");

    render(<ProfileBoxContainerComponent isHovered />);

    fireEvent.click(screen.getByText("Log out"));

    expect(sessionStorage.getItem("github-token")).toBeNull();
    expect(sessionStorage.getItem("google-token")).toBeNull();
    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
