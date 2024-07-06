"use client";

import axios from "axios";
import { useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IoLogoGithub } from "react-icons/io";

export default function ButtonComponent() {
  const params = useSearchParams();
  const router = useRouter();

  const authenticateWithGithub = useCallback(async () => {
    try {
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
      console.error(
        "Unable to retrieve access_token from Community Cares Server [authenticateWithGithub]",
        error
      );
    }
  }, [params, router]);

  useEffect(() => {
    authenticateWithGithub();
  }, [authenticateWithGithub]);

  return (
    <button
      className="rounded-xl gap-2 bg-orange flex items-center justify-center p-4 w-64"
      type="button"
      onClick={async () => {
        router.push(
          `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}`
        );
      }}
    >
      <p className="font-semibold">Github</p>
      <IoLogoGithub size={24} />
    </button>
  );
}
