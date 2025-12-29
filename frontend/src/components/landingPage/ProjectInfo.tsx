import React from "react";
import { Server, Database, Globe, ArrowRightLeft, Layers } from "lucide-react";

function ProjectInfo() {
  return (
    <section id="architecture" className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Architecture Diagram */}
          <div className="lg:w-1/2 w-full relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-2xl opacity-10"></div>
            
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 relative overflow-hidden z-10">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

              <div className="flex flex-col space-y-12 relative z-10">
                {/* Frontend */}
                <div className="flex justify-center">
                  <div className="bg-white border border-blue-100 p-6 rounded-2xl text-center w-56 shadow-lg shadow-blue-500/5 hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="font-bold text-slate-900 mb-1">
                      Next.js Client
                    </div>
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Frontend</div>
                  </div>
                </div>

                {/* Connection Line */}
                <div className="absolute top-[32%] left-1/2 -translate-x-1/2 h-20 w-px border-l-2 border-dashed border-slate-300 z-0"></div>
                
                <div className="flex justify-center -my-6 relative z-10">
                   <div className="bg-slate-50 border border-slate-200 text-slate-500 text-xs font-mono px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                       <ArrowRightLeft className="w-3 h-3" />
                       HTTP / WS
                   </div>
                </div>

                {/* Backend */}
                <div className="flex justify-center">
                  <div className="bg-white border border-indigo-100 p-6 rounded-2xl text-center w-56 shadow-lg shadow-indigo-500/5 hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                        <Server className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="font-bold text-slate-900 mb-1">Express API</div>
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Backend</div>
                  </div>
                </div>

                 {/* Connection Line */}
                <div className="absolute top-[68%] left-1/2 -translate-x-1/2 h-20 w-px border-l-2 border-dashed border-slate-300 z-0"></div>

                 <div className="flex justify-center -my-6 relative z-10">
                   <div className="bg-slate-50 border border-slate-200 text-slate-500 text-xs font-mono px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                       Mongoose
                   </div>
                </div>

                {/* Database */}
                <div className="flex justify-center">
                  <div className="bg-white border border-emerald-100 p-6 rounded-2xl text-center w-56 shadow-lg shadow-emerald-500/5 hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                        <Database className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="font-bold text-slate-900 mb-1">MongoDB</div>
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Database</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:w-1/2 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
                <Layers className="w-4 h-4" />
                System Architecture
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Robust & Scalable <br/> <span className="text-indigo-600">Architecture</span>
            </h2>
            <p className="text-slate-600 mb-10 text-lg leading-relaxed">
              Designed with separation of concerns in mind, ensuring
              maintainability and scalability. The application leverages modern
              patterns to deliver a seamless experience.
            </p>

            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">
                    Frontend Layer
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Next.js provides server-side rendering for performance and
                    SEO, while Tailwind CSS ensures a responsive, modern design.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
                  <Server className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">
                    Backend Layer
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Node.js and Express handle business logic and API routes.
                    Socket.io manages real-time bidirectional communication.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <Database className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">
                    Data Layer
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
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
