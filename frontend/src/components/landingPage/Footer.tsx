import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-auto">
      {/* background + glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-950 to-black" />
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,#6366f122,transparent_0)] [background-size:28px_28px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3 items-start">
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-gray-200">
              Real-Time Chat App
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-gray-400">
              Demo showcasing a modern, scalable real-time stack.
            </p>
            <p className="mt-4 text-[11px] text-gray-500">
              &copy; {year} All rights reserved.
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Explore
            </span>
            <a
              href="#features"
              className="text-gray-400 hover:text-gray-200 transition">
              Features
            </a>
            <a
              href="#stack"
              className="text-gray-400 hover:text-gray-200 transition">
              Stack
            </a>
            <a
              href="/chat"
              className="text-gray-400 hover:text-gray-200 transition">
              Demo
            </a>
          </nav>

          <div className="flex flex-col gap-3 md:items-end">
            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Connect
            </span>
            <div className="flex gap-3">
              <a
                href="https://github.com/elmountahiii"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group relative inline-flex items-center justify-center w-10 h-10 rounded-lg ring-1 ring-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition">
                <Github className="w-5 h-5" />
                <span className="absolute -bottom-6 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition">
                  GitHub
                </span>
              </a>
              <a
                href="https://www.linkedin.com/in/elmountahiii"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group relative inline-flex items-center justify-center w-10 h-10 rounded-lg ring-1 ring-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition">
                <Linkedin className="w-5 h-5" />
                <span className="absolute -bottom-6 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition">
                  LinkedIn
                </span>
              </a>
            </div>
            <div className="mt-4 text-[11px] text-gray-500">
              <span className="mr-1">Built with</span>
              <span className="font-medium text-gray-300">
                Next.js, TS & Socket.IO
              </span>
            </div>
          </div>
        </div>

        {/* divider + bottom note */}
        <div className="mt-10 pt-6 border-t border-white/10 text-[11px] text-gray-500 flex flex-col sm:flex-row gap-2 justify-between">
          <span>Performance-focused. Developer-friendly.</span>
          <span className="text-gray-600">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}