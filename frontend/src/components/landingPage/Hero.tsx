import React from "react";
import Link from "next/link";
import { GitHub } from "./Icons";
import { ArrowRight, Terminal, Code2, Database } from "lucide-react";

function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
      {/* Simple Dot Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-50 text-slate-600 text-sm font-medium mb-6 border border-slate-200">
              <Terminal className="w-4 h-4" />
              Portfolio Project
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              Real-Time Chat <br className="hidden lg:block" />
              <span className="text-blue-600">Application</span>
            </h1>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              A robust full-stack implementation exploring modern web
              technologies. Built with{" "}
              <span className="font-semibold text-slate-900">Next.js</span>,{" "}
              <span className="font-semibold text-slate-900">Express</span>, and{" "}
              <span className="font-semibold text-slate-900">Socket.io</span> to
              demonstrate scalable architecture and real-time concurrency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-medium py-3 px-6 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Try Live Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://github.com/Elmountahiii/chat-app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 font-medium py-3 px-6 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <GitHub className="w-5 h-5" />
                View Source
              </a>
            </div>
          </div>

          {/* Right Content - Simplified Visual */}
          <div className="lg:w-1/2 w-full">
            <div className="relative rounded-xl bg-slate-50 border border-slate-200 p-2 shadow-sm">
              {/* Technical Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white rounded-t-lg">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                </div>
                <div className="ml-auto flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Code2 className="w-3 h-3" /> TypeScript
                  </span>
                  <span className="flex items-center gap-1">
                    <Database className="w-3 h-3" /> MongoDB
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white rounded-b-lg p-6 min-h-[320px] flex flex-col">
                {/* Clean Chat Representation */}
                <div className="space-y-4 font-sans">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">
                      JS
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg rounded-tl-none text-sm text-slate-600 max-w-[85%]">
                      <p>How does the real-time sync work under the hood?</p>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                      ME
                    </div>
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg rounded-tr-none text-sm text-slate-700 max-w-[85%]">
                      <p>
                        I&apos;m using Socket.io namespaces to handle separate
                        chat rooms efficiently.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">
                      JS
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg rounded-tl-none text-sm text-slate-600 max-w-[85%]">
                      <p>Nice! And how are you handling state?</p>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                      ME
                    </div>
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg rounded-tr-none text-sm text-slate-700 max-w-[85%]">
                      <p>
                        Zustand for the client-side store, with optimistic updates
                        for the UI.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input placeholder */}
                <div className="mt-auto pt-6">
                  <div className="h-10 bg-slate-50 rounded border border-slate-100 w-full flex items-center px-4">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse"></div>
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
