import React from "react";
import { Docker, Expressjs, MongoDB, Nextjs, Nodejs, SocketIO } from "./Icons";

const techStack = [
	{
		name: "Next.js",
		logo: <Nextjs />,
		description:
			"Server-rendered React framework for a fast, SEO-friendly, and dynamic frontend experience.",
	},
	{
		name: "Node.js",
		logo: <Nodejs />,
		description:
			"Event-driven runtime environment ensuring efficient handling of concurrent connections.",
	},
	{
		name: "Express.js",
		logo: <Expressjs />,
		description:
			"Minimalist web framework for building a robust and scalable RESTful API.",
	},
	{
		name: "Socket.IO",
		logo: <SocketIO />,
		description:
			"Real-time engine powering instant messaging, typing indicators, and live updates.",
	},
	{
		name: "MongoDB",
		logo: <MongoDB />,
		description:
			"NoSQL database for flexible schema design and efficient storage of chat history.",
	},
	{
		name: "Docker",
		logo: <Docker />,
		description:
			"Containerization platform ensuring consistent environments from development to production.",
	},
];

function TechStack() {
	return (
		<section id="tech-stack" className="py-24 bg-white">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Built With Modern Tech
					</h2>
					<p className="text-gray-600 max-w-2xl mx-auto text-lg">
						Leveraging the power of the MERN stack and modern DevOps tools.
					</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{techStack.map((tech) => (
						<div
							key={tech.name}
							className="group relative p-1 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-sm hover:shadow-xl"
						>
							<div className="bg-white h-full rounded-xl p-8 flex flex-col items-center text-center relative z-10">
								<div className="w-16 h-16 mb-6 transform group-hover:scale-110 transition-transform duration-300">
									{tech.logo}
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-3">
									{tech.name}
								</h3>
								<p className="text-gray-600 text-sm leading-relaxed">
									{tech.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default TechStack;
