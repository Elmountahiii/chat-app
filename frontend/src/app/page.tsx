import Features from "@/components/landingPage/Features";
import Footer from "@/components/landingPage/Footer";
import Header from "@/components/landingPage/Header";
import Hero from "@/components/landingPage/Hero";
import ProjectInfo from "@/components/landingPage/ProjectInfo";
import TechStack from "@/components/landingPage/TechStack";

export default function Home() {
	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 overflow-x-hidden">
			<Header />
			<main>
				<Hero />
				<Features />
				<TechStack />
				<ProjectInfo />
			</main>
			<Footer />
		</div>
	);
}
