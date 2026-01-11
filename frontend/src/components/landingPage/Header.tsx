import React from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

function Header() {
	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 support-[backdrop-filter]:bg-white/60">
			<div className="container mx-auto px-6 h-20 flex justify-between items-center">
				<div className="flex items-center gap-2.5 group cursor-pointer">
					<div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105">
						<MessageCircle className="w-5 h-5 text-white" />
					</div>
					<span className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
						ChatApp
					</span>
				</div>

				<nav className="hidden md:flex items-center space-x-8">
					{["Features", "Tech Stack", "Architecture"].map((item) => (
						<a
							key={item}
							href={`#${item.toLowerCase().replace(" ", "-")}`}
							className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
						>
							{item}
						</a>
					))}
				</nav>

				<div className="flex items-center gap-4">
					<Link
						href="/auth/login"
						className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block"
					>
						Log in
					</Link>
					<Link
						href="/auth/signup"
						className="bg-slate-900 text-white text-sm font-semibold py-2.5 px-6 rounded-full hover:bg-slate-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95"
					>
						Get Started
					</Link>
				</div>
			</div>
		</header>
	);
}

export default Header;
