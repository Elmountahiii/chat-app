import React from "react";
import { Server, Database, Globe, ArrowRightLeft } from "lucide-react";

function ProjectInfo() {
  return (
    <section id="architecture" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Architecture Diagram */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

              <div className="flex flex-col space-y-8 relative z-10">
                {/* Frontend */}
                <div className="flex justify-center">
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-center w-48 shadow-sm">
                    <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-bold text-gray-900">
                      Next.js Client
                    </div>
                    <div className="text-xs text-gray-500">Frontend</div>
                  </div>
                </div>

                {/* Connection */}
                <div className="flex justify-center items-center h-12 relative">
                  <div className="absolute h-full w-0.5 bg-gray-200"></div>
                  <div className="bg-white px-2 py-1 rounded border border-gray-200 text-xs font-mono text-gray-500 z-10 flex items-center gap-1">
                    <ArrowRightLeft className="w-3 h-3" /> HTTP / WS
                  </div>
                </div>

                {/* Backend */}
                <div className="flex justify-center">
                  <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl text-center w-48 shadow-sm">
                    <Server className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                    <div className="font-bold text-gray-900">Express API</div>
                    <div className="text-xs text-gray-500">Backend</div>
                  </div>
                </div>

                {/* Connection */}
                <div className="flex justify-center items-center h-12 relative">
                  <div className="absolute h-full w-0.5 bg-gray-200"></div>
                  <div className="bg-white px-2 py-1 rounded border border-gray-200 text-xs font-mono text-gray-500 z-10">
                    Mongoose
                  </div>
                </div>

                {/* Database */}
                <div className="flex justify-center">
                  <div className="bg-green-50 border border-green-100 p-6 rounded-xl text-center w-48 shadow-sm">
                    <Database className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-bold text-gray-900">MongoDB</div>
                    <div className="text-xs text-gray-500">Database</div>
                  </div>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-0 opacity-20"></div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:w-1/2 w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Robust & Scalable Architecture
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Designed with separation of concerns in mind, ensuring
              maintainability and scalability. The application leverages modern
              patterns to deliver a seamless experience.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Frontend Layer
                  </h4>
                  <p className="text-gray-600 mt-1">
                    Next.js provides server-side rendering for performance and
                    SEO, while Tailwind CSS ensures a responsive, modern design.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Server className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Backend Layer
                  </h4>
                  <p className="text-gray-600 mt-1">
                    Node.js and Express handle business logic and API routes.
                    Socket.io manages real-time bidirectional communication.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Database className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Data Layer
                  </h4>
                  <p className="text-gray-600 mt-1">
                    MongoDB stores user data and chat history in a flexible
                    document format, allowing for easy schema evolution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectInfo;
