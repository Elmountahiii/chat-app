import React from "react";

type Tech = { name: string; desc: string; badge?: string };

const backend: Tech[] = [
  { name: "Node.js", desc: "Event-driven runtime", badge: "Runtime" },
  { name: "TypeScript", desc: "Typed JavaScript", badge: "Language" },
  { name: "Socket.IO", desc: "Real-time transport", badge: "RT" },
  { name: "MongoDB", desc: "Document database", badge: "DB" },
  { name: "Express.js", desc: "HTTP framework", badge: "API" },
];

const frontend: Tech[] = [
  { name: "Next.js", desc: "Full‑stack React framework", badge: "App" },
  { name: "TailwindCSS", desc: "Utility-first styling", badge: "UI" },
  { name: "TypeScript", desc: "Type safety shared", badge: "Shared" },
  { name: "Socket.IO Client", desc: "Live updates", badge: "RT" },
];

function TechCard({ tech }: { tech: Tech }) {
  return (
    <div className="group relative rounded-xl p-px bg-gradient-to-br from-indigo-500/30 via-transparent to-transparent hover:from-indigo-500/60 transition">
      <div className="rounded-[inherit] h-full bg-white/80 dark:bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/60 ring-1 ring-black/5 dark:ring-white/10 p-4 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
            {tech.name}
          </h3>
          {tech.badge && (
            <span className="text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full bg-indigo-600 text-white/90 shadow-sm">
              {tech.badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-600/90 dark:text-gray-300 leading-relaxed">
          {tech.desc}
        </p>
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-transparent" />
      </div>
    </div>
  );
}

export default function Stack() {
  return (
    <section id="stack" className="relative py-24">
      {/* background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950" />
        <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(circle_at_1px_1px,#6366f1_1px,transparent_0)] [background-size:32px_32px]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[40rem] h-40 bg-gradient-to-r from-indigo-500/20 via-fuchsia-400/20 to-pink-400/20 blur-3xl rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block text-xs font-semibold tracking-wider uppercase bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full ring-1 ring-indigo-200/60 dark:ring-indigo-400/30">
            Tech Stack
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300">
            Built with modern, scalable tools
          </h2>
          <p className="mt-4 text-sm md:text-base text-gray-600 dark:text-gray-300">
            A cohesive stack enabling real-time, secure, and performant chat
            experiences.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Backend */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              Backend
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {backend.map((t) => (
                <TechCard key={t.name} tech={t} />
              ))}
            </div>
          </div>
          {/* Frontend */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
              Frontend
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {frontend.map((t) => (
                <TechCard key={t.name} tech={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
