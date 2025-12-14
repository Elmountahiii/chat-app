import React from "react";
import Link from "next/link";
import { GitHub } from "./Icons";

function Hero() {
	return (
		<section className="pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
			<div className="container mx-auto px-6 text-center relative z-10">
				<div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold tracking-wide">
					Real-Time Chat Application
				</div>
				<h2 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
					Connect Instantly. <br />
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
						Chat Seamlessly.
					</span>
				</h2>
				<p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
					Experience real-time communication with a robust architecture. Built
					with Next.js, Express, and Socket.io to demonstrate scalable web
					development practices.
				</p>
				<div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
					<a
						href="https://github.com/Elmountahiii/chat-app"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center bg-gray-900 text-white font-bold py-3.5 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-500/20"
					>
						<GitHub className="w-5 h-5 mr-2 fill-current" />
						View Source
					</a>
					<Link
						href="/auth/register"
						className="bg-white text-gray-900 border border-gray-200 font-bold py-3.5 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:border-blue-300 hover:shadow-xl hover:text-blue-600"
					>
						Try Demo
					</Link>
				</div>

				{/* Mock UI */}
				<div className="mt-20 max-w-5xl mx-auto relative">
					<div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20"></div>
					<div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
						<div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center space-x-2">
							<div className="w-3 h-3 rounded-full bg-red-500"></div>
							<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
							<div className="w-3 h-3 rounded-full bg-green-500"></div>
							<div className="ml-4 bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-500 flex-1 text-center font-mono">
								chat.elmountahi.com
							</div>
						</div>
						<div className="flex h-[400px] md:h-[500px]">
							{/* Sidebar */}
							<div className="w-1/4 md:w-1/5 border-r border-gray-100 bg-gray-50 hidden sm:block p-4 space-y-4">
								<div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
								<div className="space-y-3">
									{[1, 2, 3, 4].map((i) => (
										<div key={i} className="flex items-center space-x-3">
											<div className="w-8 h-8 rounded-full bg-gray-200"></div>
											<div className="h-4 w-20 bg-gray-200 rounded"></div>
										</div>
									))}
								</div>
							</div>
							{/* Chat Area */}
							<div className="flex-1 flex flex-col bg-white">
								<div className="flex-1 p-6 space-y-6 overflow-hidden relative">
									{/* Messages */}
									<div className="flex items-end space-x-2">
										<div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0"></div>
										<div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none max-w-xs text-sm text-gray-700">
											Hey! Have you checked out the new chat app? 🚀
										</div>
									</div>
									<div className="flex items-end space-x-2 flex-row-reverse space-x-reverse">
										<div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0"></div>
										<div className="bg-blue-600 p-3 rounded-2xl rounded-br-none max-w-xs text-sm text-white shadow-md shadow-blue-500/20">
											Yeah! The real-time features are amazing. Socket.io works
											perfectly.
										</div>
									</div>
									<div className="flex items-end space-x-2">
										<div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0"></div>
										<div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none max-w-xs text-sm text-gray-700">
											And the UI is so clean! Tailwind CSS?
										</div>
									</div>
									<div className="flex items-end space-x-2 flex-row-reverse space-x-reverse">
										<div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0"></div>
										<div className="bg-blue-600 p-3 rounded-2xl rounded-br-none max-w-xs text-sm text-white shadow-md shadow-blue-500/20">
											Absolutely. Plus it's fully dockerized! 🐳
										</div>
									</div>
								</div>
								{/* Input Area */}
								<div className="p-4 border-t border-gray-100">
									<div className="bg-gray-50 rounded-full px-4 py-3 flex items-center justify-between border border-gray-200">
										<div className="text-gray-400 text-sm">
											Type a message...
										</div>
										<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 12h14M12 5l7 7-7 7"
												/>
											</svg>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Hero;
