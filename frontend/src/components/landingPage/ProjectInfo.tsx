import React from "react";

function ProjectInfo() {
	return (
		<section className="py-20 bg-white">
			<div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
				<div className="md:w-1/2">
					<img
						src="https://picsum.photos/seed/chatapp-arch/600/500"
						alt="Project Architecture"
						className="rounded-xl shadow-2xl shadow-blue-500/20 w-full"
					/>
				</div>
				<div className="md:w-1/2">
					<h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Project Architecture
					</h3>
					<p className="text-gray-700 mb-6">
						This application is designed with a clean separation of concerns,
						featuring a Next.js frontend for a dynamic user experience and a
						powerful Express.js backend API.
					</p>
					<ul className="space-y-4">
						<li className="flex items-start">
							<span className="text-blue-600 font-bold mr-3 text-2xl">›</span>
							<p className="text-gray-700">
								<strong className="text-gray-900">Frontend:</strong> A
								server-side rendered React application built with Next.js and
								styled with Tailwind CSS for a fast, responsive, and modern UI.
							</p>
						</li>
						<li className="flex items-start">
							<span className="text-blue-600 font-bold mr-3 text-2xl">›</span>
							<p className="text-gray-700">
								<strong className="text-gray-900">Backend:</strong> A RESTful
								API built with Express.js and Node.js, handling business logic,
								authentication, and database interactions.
							</p>
						</li>
						<li className="flex items-start">
							<span className="text-blue-600 font-bold mr-3 text-2xl">›</span>
							<p className="text-gray-700">
								<strong className="text-gray-900">Database:</strong> MongoDB is
								used as the database, providing a flexible and scalable NoSQL
								solution for storing user and message data.
							</p>
						</li>
						<li className="flex items-start">
							<span className="text-blue-600 font-bold mr-3 text-2xl">›</span>
							<p className="text-gray-700">
								<strong className="text-gray-900">Real-Time Engine:</strong>{" "}
								WebSockets are implemented for bidirectional communication,
								enabling instant message delivery.
							</p>
						</li>
					</ul>
				</div>
			</div>
		</section>
	);
}

export default ProjectInfo;
