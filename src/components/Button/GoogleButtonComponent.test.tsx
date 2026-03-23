import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import api from "@/lib/api";
import { GoogleButtonComponent } from "./GoogleButtonComponent";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

let onSuccessHandler: ((arg: any) => Promise<void> | void) | null = null;

vi.mock("@react-oauth/google", () => ({
  useGoogleLogin: (config: { onSuccess: (arg: any) => void }) => {
    onSuccessHandler = config.onSuccess;
    return () => onSuccessHandler && onSuccessHandler({});
  },
}));

vi.mock("@/lib/api", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api, true);

describe("GoogleButtonComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedApi.post.mockReset();
    mockedApi.get.mockReset();
    onSuccessHandler = null;
    process.env.NEXT_PUBLIC_API = "http://api.test";
    sessionStorage.clear();
  });

  it("renders default button state", () => {
    render(<GoogleButtonComponent />);
    expect(screen.getByText("Google")).toBeInTheDocument();
  });

  it("authenticates successfully and stores token", async () => {
    mockedApi.post.mockResolvedValue({
      data: {
        access_token: "access",
        refresh_token: "refresh",
        scope: "scope",
        token_type: "Bearer",
        id_token: "id",
        expiry_date: 123,
      },
      status: 200,
    });
    mockedApi.get.mockResolvedValue({ status: 200 });

    render(<GoogleButtonComponent />);

    // Simulate Google OAuth success by invoking the captured handler
    // The mock defined at the top of the file captures the component's onSuccess in onSuccessHandler
    expect(onSuccessHandler).toBeDefined();

    if (onSuccessHandler) {
      await act(async () => {
        await onSuccessHandler?.({ code: "auth-code" });
      });
    }

    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith(
        "/users/authenticate/google",
        { code: "auth-code", env: "web" },
      );
      expect(mockedApi.get).toHaveBeenCalledWith("/auth/me");
      expect(pushMock).toHaveBeenCalledWith("/location");
    });
  });

  it("shows error when request fails", async () => {
    mockedApi.post.mockRejectedValueOnce(new Error("fail"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(<GoogleButtonComponent />);

    fireEvent.click(screen.getByRole("button"));

    if (onSuccessHandler) {
      await act(async () => {
        await onSuccessHandler?.({ code: "auth-code" });
      });
    }

    await waitFor(() => {
      expect(
        screen.getByText(
          "Error on the authentication request, please try again.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("shows error when code is missing", async () => {
    render(<GoogleButtonComponent />);

    fireEvent.click(screen.getByRole("button"));

    if (onSuccessHandler) {
      await act(async () => {
        await onSuccessHandler?.({});
      });
    }

    await waitFor(() => {
      expect(
        screen.getByText(
          "Error on the authentication request, please try again.",
        ),
      ).toBeInTheDocument();
    });
  });
});
