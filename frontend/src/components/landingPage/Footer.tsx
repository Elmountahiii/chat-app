import React from "react";
import { GitHub, LinkedIn } from "./Icons";

function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-white border-t border-gray-100 py-12">
			<div className="container mx-auto px-6">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="mb-4 md:mb-0">
						<span className="text-xl font-bold text-gray-900 tracking-tight">
							ChatApp
						</span>
						<p className="text-sm text-gray-500 mt-1">
							A modern real-time messaging platform.
						</p>
					</div>

					<div className="flex space-x-6">
						<a
							href="https://github.com/Elmountahiii"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-400 hover:text-gray-900 transition-colors"
							aria-label="GitHub"
						>
							<GitHub className="w-6 h-6 fill-current" />
						</a>
						<a
							href="https://linkedin.com/in/elmountahiii"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-400 hover:text-blue-600 transition-colors"
							aria-label="LinkedIn"
						>
							<LinkedIn className="w-6 h-6 fill-current" />
						</a>
					</div>
				</div>

				<div className="border-t border-gray-100 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
					<p>&copy; {currentYear} Elmountahiii. All Rights Reserved.</p>
					<p className="mt-2 md:mt-0">
						Designed & Built for Portfolio Showcase.
					</p>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
