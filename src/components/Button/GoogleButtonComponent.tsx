"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoLogoGoogle } from "react-icons/io5";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";

import * as interfaces from "@/interfaces/index";

export default function GoogleButtonComponent() {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [errorOnRequest, setErrorOnRequest] = useState<boolean>(false);
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: (
      tokenResponse:
        | interfaces.GoogleAuthProps
        | Omit<TokenResponse, "error" | "error_description" | "error_uri">
    ) => {
      const { access_token, expires_in } = tokenResponse;

      if (access_token) {
        localStorage.setItem(
          "google-token",
          JSON.stringify({
            token: access_token,
            expiration: expires_in,
          })
        );
        router.push("/location");
      }
    },
  });

  return (
    <>
      <button
        className="rounded-xl gap-2 bg-orange flex items-center justify-center p-4 w-64 mt-2"
        type="button"
        onClick={() => login()}
      >
        {isAuthenticating ? (
          <>
            <p className="font-semibold text-white">Authenticating</p>
            <svg
              width="100"
              height="100"
              className="animate-spin h-5 w-5 mr-3 border-white rounded-full border-4 border-dotted"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="green"
                stroke-width="4"
                fill="yellow"
              />
            </svg>
          </>
        ) : (
          <>
            <p className="font-semibold text-white">Google</p>
            <IoLogoGoogle size={20} fill="white" />
          </>
        )}
      </button>
      {errorOnRequest && (
        <p className="text-red-600 font-bold mt-4">
          Error on the authentication request
        </p>
      )}
    </>
  );
}
