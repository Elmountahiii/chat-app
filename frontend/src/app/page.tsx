import Features from "@/components/landingPage/Features";
import Footer from "@/components/landingPage/Footer";
import Header from "@/components/landingPage/Header";
import Hero from "@/components/landingPage/Hero";
import ProjectInfo from "@/components/landingPage/ProjectInfo";
import TechStack from "@/components/landingPage/TechStack";

export default function Home() {
  return (
    <div className="min-h-screen bg-primary overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-secondary to-primary opacity-50"></div>
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <Features />
          <TechStack />
          <ProjectInfo />
        </main>
        <Footer />
      </div>
    </div>
  );
}
