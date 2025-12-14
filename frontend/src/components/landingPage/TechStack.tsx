import React from "react";
import {
	DockerLogo,
	ExpressJsLogo,
	MongoDbLogo,
	NextjsLogo,
	NodejsLogo,
	SocketIoLogo,
} from "./Icons";

const techStack = [
	{
		name: "Next.js",
		logo: <NextjsLogo />,
		description:
			"For building a fast, server-rendered React frontend that provides an excellent user experience and is optimized for performance.",
	},
	{
		name: "MongoDB",
		logo: <MongoDbLogo />,
		description:
			"Chosen for its flexible, schema-less data model, which is perfect for storing diverse chat messages and user profiles efficiently.",
	},
	{
		name: "Node.js",
		logo: <NodejsLogo />,
		description:
			"The runtime environment for our backend, enabling fast, event-driven I/O that is ideal for a real-time chat application.",
	},
	{
		name: "Express.js",
		logo: <ExpressJsLogo />,
		description:
			"A minimal and powerful Node.js framework used to build the robust and scalable REST API that powers the application's backend.",
	},
	{
		name: "Socket.IO",
		logo: <SocketIoLogo />,
		description:
			"Facilitates real-time, bidirectional communication between the client and server, enabling instant messaging capabilities.",
	},
	{
		name: "Docker",
		logo: <DockerLogo />,
		description:
			"Containerizes the application, ensuring a consistent and reproducible environment for both development and deployment.",
	},
];

function TechStack() {
	return (
		<section className="py-20 bg-gray-50">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h3 className="text-3xl md:text-4xl font-bold text-gray-900">
						Built With the Best
					</h3>
					<p className="text-gray-700 mt-4 max-w-2xl mx-auto">
						This project is powered by a carefully selected stack of modern,
						scalable, and robust technologies to ensure a premium user
						experience.
					</p>
				</div>
				<div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{techStack.map((tech) => (
						<div
							key={tech.name}
							className="group relative transition-transform transform hover:-translate-y-2"
						>
							<div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-300"></div>

							<div className="relative bg-white p-8 rounded-xl h-full flex flex-col items-center text-center shadow-lg border border-gray-200">
								<div className="text-gray-700 w-16 h-16 mb-6 flex items-center justify-center">
									{tech.logo}
								</div>
								<h4 className="text-xl font-bold text-gray-900 mb-3">
									{tech.name}
								</h4>
								<p className="text-gray-700 text-sm leading-relaxed flex-grow">
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
