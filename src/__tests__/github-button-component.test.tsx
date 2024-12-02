import { expect, test, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';

import { GitHubButtonComponent } from "@/components/Button/GitHubButtonComponent";

describe("Authorization component", () => {
  test("if the component render as expected", () => {
    render(<GitHubButtonComponent />);
  });

  expect(screen.getByRole("paragraph")).toHaveTextContent("Github");
});