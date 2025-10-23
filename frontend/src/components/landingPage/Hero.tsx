import React from "react";


function Hero() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-light-text leading-tight mb-4">
          Real-Time Chat, <br /> Built for Performance.
        </h2>
        <p className="text-lg md:text-xl text-dark-text max-w-3xl mx-auto mb-8">
          A full-stack, real-time chat application showcasing a modern web
          development workflow with Next.js, Express, MongoDB, and seamless
          deployment using Docker.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://github.com/your-username/chatapp"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/20">
            View on GitHub
          </a>
          <a
            href="#"
            className="bg-secondary text-light-text font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-gray-200 hover:shadow-xl">
            Live Demo
          </a>
        </div>
        <div className="mt-16 max-w-4xl mx-auto">
          <img
            src="https://picsum.photos/seed/chatapp/1200/600"
            alt="Chat Application Screenshot"
            className="rounded-xl shadow-2xl shadow-blue-500/10 border-4 border-secondary"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
