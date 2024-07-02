import { IoLogoGithub } from "react-icons/io";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="font-heading text-orange">Community Cares</h1>
      <section className="mt-auto text-center">
        <p className="font-paragraph text-gray mb-6">Login with</p>
        <button className="rounded-xl gap-2 bg-orange flex items-center justify-center p-4 w-64">
          <p className="font-paragraph font-semibold">Github</p>
          <IoLogoGithub size={24} />
        </button>
      </section>
    </main>
  );
}
