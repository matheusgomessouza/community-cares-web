import ButtonComponent from "@/components/Button/ButtonComponent";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-orange text-4xl">Community Cares</h1>
      <section className="mt-auto text-center">
        <p className="text-gray mb-6">Login with</p>
        <ButtonComponent />
      </section>
    </main>
  );
}
