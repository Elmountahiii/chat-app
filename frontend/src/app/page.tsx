import Features from "@/components/landingPage/Features";
import Footer from "@/components/landingPage/Footer";
import Hero from "@/components/landingPage/Hero";
import Stack from "@/components/landingPage/Stack";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Hero />
      <Stack />
      <Features />
      <Footer />
    </main>
  );
}