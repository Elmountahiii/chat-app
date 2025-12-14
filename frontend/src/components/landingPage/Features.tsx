import React from "react";
import { MessageSquareText, Fingerprint, Brain, Container } from "lucide-react";

const features = [
	{
		icon: <MessageSquareText />,
		title: "Real-Time Messaging",
		description:
			"Engage in fluid, instantaneous conversations. Our WebSocket-based architecture ensures that messages, typing indicators, and online statuses are delivered and updated across all clients without delay, creating a truly live chat experience.",
		imageSeed: "messaging-ui",
	},
	{
		icon: <Fingerprint />,
		title: "Secure Authentication",
		description:
			"Your privacy is paramount. We implement robust, JWT-based authentication to protect user accounts and data. Secure session management ensures that conversations remain private and accessible only to authorized users.",
		imageSeed: "authentication-flow",
	},
	{
		icon: <Brain />,
		title: "Scalable Backend",
		description:
			"Built on a resilient Express.js API and a flexible MongoDB database, our backend is engineered to handle a high volume of concurrent connections and messages, ensuring reliable performance as the user base grows.",
		imageSeed: "server-architecture",
	},
	{
		icon: <Container />,
		title: "Dockerized Deployment",
		description:
			"Simplify your deployment process. The entire application is containerized with Docker and Docker Compose, allowing for consistent, predictable, and hassle-free deployments across any environment, from local development to production.",
		imageSeed: "deployment-docker",
	},
];

function Features() {
	return (
		<section id="features" className="py-20 bg-white">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h3 className="text-3xl md:text-4xl font-bold text-gray-900">
						Everything You Need for a Modern Chat Experience
					</h3>
					<p className="text-gray-700 mt-4 max-w-2xl mx-auto">
						This project isn&apos;t just a chat app; it&apos;s a comprehensive
						showcase of modern web development principles, from real-time
						communication to secure, scalable infrastructure.
					</p>
				</div>

				<div className="space-y-24">
					{features.map((feature, index) => (
						<div
							key={index}
							className={`flex flex-col md:flex-row items-center gap-12 ${
								index % 2 !== 0 ? "md:flex-row-reverse" : ""
							}`}
						>
							{/* Image Content */}
							<div className="md:w-1/2 w-full">
								<div className="relative group">
									<div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
									<img
										src={`https://picsum.photos/seed/${feature.imageSeed}/800/600`}
										alt={`${feature.title} illustration`}
										className="relative rounded-xl shadow-2xl shadow-blue-500/10 w-full transform transition-transform duration-500 group-hover:scale-105"
									/>
								</div>
							</div>

							{/* Text Content */}
							<div className="md:w-1/2 w-full">
								<div className="flex items-center gap-4 mb-4">
									<div className="bg-blue-50 p-3 rounded-lg shadow-md text-blue-600">
										{feature.icon}
									</div>
									<h4 className="text-2xl font-bold text-gray-900">
										{feature.title}
									</h4>
								</div>
								<p className="text-gray-700 leading-relaxed">
									{feature.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Features;
