"use client";

import React, { useRef } from "react";
import api from "@/lib/api";
import { useEffect, useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IoLogoGithub } from "react-icons/io";

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_SCOPES = "read:user user:email";

async function sha256(buffer: ArrayBuffer) {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return new Uint8Array(digest);
}
function base64UrlEncode(buffer: Uint8Array) {
  return btoa(String.fromCharCode(...Array.from(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
async function generateCodeChallenge(verifier: string) {
  const enc = new TextEncoder().encode(verifier);
  const hashed = await sha256(enc.buffer);
  return base64UrlEncode(hashed);
}
function generateRandomString(length = 64) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return base64UrlEncode(array).slice(0, length);
}

export function GitHubButtonComponent() {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [errorOnRequest, setErrorOnRequest] = useState<string | null>(null);
  const params = useSearchParams();
  const router = useRouter();
  const processedRef = useRef(false);

  const startGithubFlow = useCallback(async () => {
    const clientId =
      process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ||
      process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID_DEV;
    if (!clientId) {
      console.error("Missing NEXT_PUBLIC_GITHUB_CLIENT_ID");
      setErrorOnRequest("Configuração de OAuth ausente. Contate o suporte.");
      return;
    }

    try {
      setIsAuthenticating(true);
      const codeVerifier = generateRandomString(96);
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      sessionStorage.setItem("github_code_verifier", codeVerifier);

      const params = new URLSearchParams({
        client_id: clientId,
        scope: GITHUB_SCOPES,
        response_type: "code",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      });

      window.location.href = `${GITHUB_AUTHORIZE_URL}?${params.toString()}`;
    } catch (err) {
      console.error("Failed to start GitHub OAuth flow", err);
      setErrorOnRequest("Erro ao iniciar autenticação. Tente novamente.");
      setIsAuthenticating(false);
    }
  }, []);

  const authenticateWithGithub = useCallback(async () => {
    try {
      setIsAuthenticating(true);
      const code = params.get("code");
      if (!code) return;

      const codeVerifier =
        sessionStorage.getItem("github_code_verifier") || undefined;

      const response = await api.post(`/users/authenticate/github`, {
        code,
        env: "web",
        code_verifier: codeVerifier,
      });

      if (response.status === 200) {
        await api.get("/auth/me");
        sessionStorage.removeItem("github_code_verifier");
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        window.history.replaceState({}, document.title, url.toString());

        router.push("/location");
      } else {
        console.error(
          "Unexpected response from /users/authenticate/github",
          response,
        );
        setErrorOnRequest("Falha na autenticação. Tente novamente.");
      }
    } catch (error) {
      console.error(
        "Unable to retrieve access_token from Community Cares Server [authenticateWithGithub]",
        error,
      );
      setErrorOnRequest("Erro na autenticação. Verifique e tente novamente.");
    } finally {
      setIsAuthenticating(false);
    }
  }, [params, router]);

  useEffect(() => {
    if (processedRef.current) return;
    if (params.get("code")) {
      processedRef.current = true;
      authenticateWithGithub();
    }
  }, [authenticateWithGithub, params]);

  return (
    <>
      <button
        className="rounded-xl gap-2 bg-darkOrange flex items-center justify-center p-4 w-64"
        type="button"
        disabled={isAuthenticating}
        onClick={async () => {
          await startGithubFlow();
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
        <p className="text-red-600 font-bold mt-4">{errorOnRequest}</p>
      )}
    </>
  );
}
