import GitHubButtonComponent from "@/components/Button/GitHubButtonComponent";
import GoogleButtonComponent from "@/components/Button/GoogleButtonComponent";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
      <h1 className="text-orange text-4xl">Community Cares</h1>
      <section className="mt-auto text-center flex flex-col items-center">
        <p className="text-gray mb-6">Login with</p>
        <Suspense fallback={<Loading />}>
          <GitHubButtonComponent />
          <GoogleOAuthProvider
            clientId={
              process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
                ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
                : ""
            }
          >
            <GoogleButtonComponent />
          </GoogleOAuthProvider>
        </Suspense>
      </section>
    </main>
  );
}

function Loading() {
  return <p>Loading...</p>;
}
