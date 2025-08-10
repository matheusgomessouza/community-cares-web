import { Suspense } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GitHubButtonComponent } from "@/components/Button/GitHubButtonComponent";
import { GoogleButtonComponent } from "@/components/Button/GoogleButtonComponent";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-darkOrange">
      <section className="text-center flex flex-col items-center bg-white min-w-96 min-h-96 rounded-xl shadow-lg p-8 mt-auto mb-auto drop-shadow-lg/25">
        <h1 className="font-shrikhand text-4xl mb-2 text-darkOrange">
          Welcome Back
        </h1>
        <span className="font-paragraph text-base text-gray mb-52">Sign in to your account</span>
        
        <div>
          <span className="font-paragraph text-base text-gray">Connect with your community through helping hands</span>
          <Suspense fallback={<Loading />}>
            <div className="flex gap-4 mt-6">
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
            </div>
          </Suspense>
          <p className="font-paragraph text-gray mt-8 text-base">By continuing, you agree to our <strong className="font-paragraph text-darkOrange text-base font-bold">Terms</strong> and <strong className="font-paragraph text-darkOrange text-base font-bold">Privacy Policy</strong></p>
        </div>
      </section>
    </main>
  );
}

function Loading() {
  return <p>Loading...</p>;
}

