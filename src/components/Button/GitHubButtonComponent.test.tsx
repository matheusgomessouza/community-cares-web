import React from "react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { GitHubButtonComponent } from "@/components/Button/GitHubButtonComponent";
import api from "@/lib/api";

// Mocks must be defined before importing the component under test
const pushMock = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => ({
    get: (name: string) => searchParams.get(name),
  }),
}));

vi.mock("@/lib/api", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api, true);

describe("Authorization component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedApi.post.mockReset();
    mockedApi.get.mockReset();
    searchParams = new URLSearchParams();
    process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID = "github_client_123";
    process.env.NEXT_PUBLIC_API = "https://api.example.com";
    window.sessionStorage.clear();
  });

  test("if the component render as expected", () => {
    render(<GitHubButtonComponent />);
    expect(screen.getByRole("button")).toHaveTextContent("Github");
  });

  test("shows config error if GitHub client id is missing", async () => {
    delete process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    delete process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID_DEV;

    render(<GitHubButtonComponent />);
    const button = screen.getByRole("button");

    await waitFor(() => expect(button).not.toBeDisabled());
    await userEvent.click(button);

    expect(
      await screen.findByText(
        "Configuração de OAuth ausente. Contate o suporte.",
      ),
    ).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  test("exchanges code for token and redirects on success", async () => {
    searchParams = new URLSearchParams("code=abc123");

    mockedApi.post.mockResolvedValue({
      status: 200,
      data: { access_token: "token_456" },
    });
    mockedApi.get.mockResolvedValue({ status: 200 });

    render(<GitHubButtonComponent />);

    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith(
        "/users/authenticate/github",
        expect.objectContaining({
          code: "abc123",
          env: "web",
        }),
      );
    });

    await waitFor(() => {
      expect(mockedApi.get).toHaveBeenCalledWith("/auth/me");
    });

    expect(pushMock).toHaveBeenCalledWith("/location");
  });

  test("shows error message when authentication request fails", async () => {
    searchParams = new URLSearchParams("code=badcode");

    mockedApi.post.mockRejectedValue(new Error("network error"));

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<GitHubButtonComponent />);

    expect(
      await screen.findByText(
        "Erro na autenticação. Verifique e tente novamente.",
      ),
    );
    expect(pushMock).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
