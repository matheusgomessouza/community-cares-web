"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoLogoGoogle } from "react-icons/io5";
import {
  CodeResponse,
  TokenResponse,
  useGoogleLogin,
} from "@react-oauth/google";
import axios from "axios";

import * as interfaces from "@/interfaces/index";

export function GoogleButtonComponent() {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [errorOnRequest, setErrorOnRequest] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = useGoogleLogin({
    onSuccess: async (
      codeResponse:
        | interfaces.GoogleCodeAuthProps
        | Omit<CodeResponse, "error" | "error_description" | "error_uri">
    ) => {
      const { code } = codeResponse;

      if (code) {
        try {
          setIsAuthenticating(true);
          
          const response = await axios.post<interfaces.GoogleAccessTokenProps>(
            `${process.env.NEXT_PUBLIC_API}/authenticate-google`,
            {
              code: code,
            }
          );

          localStorage.setItem(
            "google-token",
            JSON.stringify({
              access_token: response.data.access_token,
              refresh_token: response.data.refresh_token,
              scope: response.data.scope,
              token_type: response.data.token_type,
              id_token: response.data.id_token,
              expiry_date: response.data.expiry_date,
            })
          );
          router.push("/location");
        } catch (error) {
          setIsAuthenticating(false);
          setErrorOnRequest(true);
          console.error("Unable to perform code exchage with server:", error);
        }
      } else {
        setIsAuthenticating(false);
        setErrorOnRequest(true);
      }
    },
    flow: "auth-code",
  });

  return (
    <>
      <button
        className="rounded-xl gap-2 bg-darkOrange flex items-center justify-center p-4 w-64"
        type="button"
        onClick={() => handleLogin()}
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
          Error on the authentication request, please try again.
        </p>
      )}
    </>
  );
}
