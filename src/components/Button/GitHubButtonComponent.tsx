"use client";

import React from "react";
import axios from "axios";
import { useEffect, useCallback, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IoLogoGithub } from "react-icons/io";

export function GitHubButtonComponent() {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [errorOnRequest, setErrorOnRequest] = useState<boolean>(false);
  const params = useSearchParams();
  const router = useRouter();
  const isAuthCalled = useRef(false);

  const authenticateWithGithub = useCallback(async () => {
    try {
      const code = params.get("code");

      if (code && !isAuthCalled.current) {
        isAuthCalled.current = true;
        setIsAuthenticating(true);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/users/authenticate/github`,
          {
            code: code,
            env: "web",
          },
        );

        if (response.status === 200) {
          sessionStorage.setItem("github-token", response.data.access_token);
          router.push("/location");
        }
      }
    } catch (error) {
      setIsAuthenticating(false);
      setErrorOnRequest(true);
      console.error(
        "Unable to retrieve access_token from Community Cares Server [authenticateWithGithub]",
        error,
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
        className="rounded-xl gap-2 bg-darkOrange flex items-center justify-center p-4 w-64"
        type="button"
        disabled={isAuthenticating}
        onClick={async () => {
          router.push(
            `https://github.com/login/oauth/authorize?client_id=${
              process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ||
              process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID_DEV
            }`,
          );
        }}
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
                strokeWidth="4"
                fill="yellow"
              />
            </svg>
          </>
        ) : (
          <>
            <p className="font-semibold text-white">Github</p>
            <IoLogoGithub size={24} fill="white" />
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
