import React from "react";

function Header() {
	return (
		<header className="py-6">
			<div className="container mx-auto px-6 flex justify-between items-center">
				<div className="flex items-center space-x-3">
					<svg
						className="w-8 h-8 text-blue-600"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"></path>
					</svg>
					<h1 className="text-2xl font-bold text-gray-900">Chat</h1>
				</div>
				<a
					href="#"
					className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-transform transform hover:scale-105 hover:bg-blue-700"
				>
					<span>Start Now</span>
				</a>
			</div>
		</header>
	);
}

export default Header;
