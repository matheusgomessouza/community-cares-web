"use client";

import axios from "axios";
import { useEffect, useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IoLogoGithub } from "react-icons/io";

export default function ButtonComponent() {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [errorOnRequest, setErrorOnRequest] = useState<boolean>(false);
  const params = useSearchParams();
  const router = useRouter();

  const authenticateWithGithub = useCallback(async () => {
    try {
      setIsAuthenticating(true);
      const code = params.get("code");

      if (code) {
        const response = await axios.post(
          "https://community-cares-server.onrender.com/authenticate",
          {
            code: code,
            env: "web",
          }
        );

        if (response.status === 200) {
          localStorage.setItem("github-token", response.data.access_token);
          router.push("/location");
        }
      }
    } catch (error) {
      setIsAuthenticating(false);
      setErrorOnRequest(true);
      console.error(
        "Unable to retrieve access_token from Community Cares Server [authenticateWithGithub]",
        error
      );
    } finally {
      setIsAuthenticating(false);
    }
  }, [params, router]);

  useEffect(() => {
    authenticateWithGithub();
  }, [authenticateWithGithub]);

  return (
    <>
      <button
        className="rounded-xl gap-2 bg-orange flex items-center justify-center p-4 w-64"
        type="button"
        onClick={async () => {
          router.push(
            `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}`
          );
        }}
      >
        {isAuthenticating ? (
          <>
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
            <p className="font-semibold">Authenticating</p>
          </>
        ) : (
          <>
            <p className="font-semibold">Github</p>
            <IoLogoGithub size={24} />
          </>
        )}
      </button>
      {errorOnRequest && <p className="text-red-600 font-bold mt-4">Error on the authentication request</p>}
    </>
  );
}
