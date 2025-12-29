import React from "react";
import { Docker, Expressjs, MongoDB, Nextjs, Nodejs, SocketIO } from "./Icons";

const techStack = [
  {
    name: "Next.js",
    logo: <Nextjs />,
    description: "React Framework",
  },
  {
    name: "Node.js",
    logo: <Nodejs />,
    description: "Runtime Env",
  },
  {
    name: "Express.js",
    logo: <Expressjs />,
    description: "Web Framework",
  },
  {
    name: "Socket.IO",
    logo: <SocketIO />,
    description: "Real-time Engine",
  },
  {
    name: "MongoDB",
    logo: <MongoDB />,
    description: "NoSQL Database",
  },
  {
    name: "Docker",
    logo: <Docker />,
    description: "Containerization",
  },
];

function TechStack() {
  return (
    <section id="tech-stack" className="py-24 bg-white border-y border-slate-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Powered by Modern Tech
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Built on a rock-solid foundation of industry-standard technologies.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-5xl mx-auto">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="group flex flex-col items-center justify-center p-6 w-36 md:w-44 rounded-3xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 cursor-default hover:-translate-y-1"
            >
              <div className="w-16 h-16 mb-4 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110 drop-shadow-sm">
                {tech.logo}
              </div>
              <h3 className="font-bold text-slate-700 group-hover:text-slate-900 mb-1 transition-colors">
                {tech.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium group-hover:text-blue-500 transition-colors">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TechStack;
