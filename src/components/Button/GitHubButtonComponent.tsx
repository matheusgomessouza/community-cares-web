"use client";

import React, { useRef } from "react";
import api from "@/lib/api";
import { useEffect, useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IoLogoGithub } from "react-icons/io";

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_SCOPES = "read:user user:email"; // ajuste se precisar de outros scopes

// Helpers PKCE
async function sha256(buffer: ArrayBuffer) {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return new Uint8Array(digest);
}
function base64UrlEncode(buffer: Uint8Array) {
  // base64url without padding
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
  // convert to base64url-safe string
  return base64UrlEncode(array).slice(0, length);
}

export function GitHubButtonComponent() {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [errorOnRequest, setErrorOnRequest] = useState<string | null>(null);
  const params = useSearchParams();
  const router = useRouter();
  const processedRef = useRef(false);

  // inicia o fluxo: gera PKCE e redireciona para GitHub
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
      // gerar code_verifier e code_challenge
      const codeVerifier = generateRandomString(96);
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // salvar code_verifier temporariamente (sessionStorage é suficiente para PKCE)
      sessionStorage.setItem("github_code_verifier", codeVerifier);

      // montar URL de autorização com PKCE
      const params = new URLSearchParams({
        client_id: clientId,
        scope: GITHUB_SCOPES,
        response_type: "code",
        // redirect_uri: opcional se já configurado no app; GitHub usa o redirect configurado
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      });

      // redireciona o browser para o GitHub
      window.location.href = `${GITHUB_AUTHORIZE_URL}?${params.toString()}`;
    } catch (err) {
      console.error("Failed to start GitHub OAuth flow", err);
      setErrorOnRequest("Erro ao iniciar autenticação. Tente novamente.");
      setIsAuthenticating(false);
    }
  }, []);

  // quando o GitHub redireciona com ?code=..., trocamos o code pelo token no backend
  const authenticateWithGithub = useCallback(async () => {
    try {
      setIsAuthenticating(true);
      const code = params.get("code");
      if (!code) return;

      // recuperar code_verifier salvo
      const codeVerifier =
        sessionStorage.getItem("github_code_verifier") || undefined;

      // enviar para o backend; api já tem withCredentials: true
      const response = await api.post(`/users/authenticate/github`, {
        code,
        env: "web",
        code_verifier: codeVerifier,
      });

      if (response.status === 200) {
        // backend setou cookie HttpOnly; agora confirmar sessão e popular UI
        await api.get("/auth/me");
        // limpar code_verifier e remover code da URL
        sessionStorage.removeItem("github_code_verifier");
        // remove code da URL sem recarregar a página
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
          // inicia o fluxo PKCE + redirect
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
