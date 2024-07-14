"use client";

import axios from "axios";
import { useEffect, useCallback, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IoLogoGoogle } from "react-icons/io5";

export default function GoogleButtonComponent() {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [errorOnRequest, setErrorOnRequest] = useState<boolean>(false);
  const params = useSearchParams();
  const router = useRouter();

  /*
   * Create form to request access token from Google's OAuth 2.0 server.
   */
  function oauthSignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement("form");
    form.setAttribute("method", "GET"); // Send as a GET request.
    form.setAttribute("action", oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
      response_type: "token",
      scope: "https://www.googleapis.com/auth/drive.metadata.readonly",
      include_granted_scopes: "true",
      state: "pass-through value",
    };

    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      input.setAttribute("value", p);
      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <>
      <button
        disabled
        className="rounded-xl gap-2 bg-orange flex items-center justify-center p-4 w-64 mt-2 cursor-not-allowed bg-opacity-65"
        type="button"
        onClick={() => oauthSignIn()}
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
            <p className="font-semibold">Google</p>
            <IoLogoGoogle size={20} />
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
