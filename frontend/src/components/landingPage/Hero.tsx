import Image from "next/image";
import chatDemo from "@/../public/chat-demo.png";

export default function Hero() {
  const stats = [
    { value: "<50ms", label: "Latency" },
    { value: "100%", label: "TypeScript" },
    { value: "∞ Rooms", label: "Scalable" },
  ];
  return (
    <section className="relative overflow-hidden text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-indigo-400/30 rounded-full blur-3xl animate-pulse [animation-delay:1.5s]" />
        <div className="absolute inset-0 backdrop-blur-[2px] mix-blend-overlay" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-wider bg-white/10 px-4 py-2 rounded-full ring-1 ring-white/20 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live & Scalable
          </p>
          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-100 to-pink-100 drop-shadow-sm">
              Real-Time Chat,
            </span>
            <span className="block mt-2">Made Simple.</span>
          </h1>
          <p className="mt-5 text-lg text-gray-100/85 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Blazing-fast communication powered by Node.js, TypeScript,
            Socket.IO, and MongoDB. Built with Next.js & TailwindCSS for a
            seamless developer & user experience.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#stack"
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold bg-white text-indigo-700 shadow-lg shadow-indigo-900/20 ring-1 ring-white/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <span>Learn More</span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="/chat"
              className="relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold ring-1 ring-white/40 bg-white/10 backdrop-blur hover:bg-white hover:text-indigo-700 transition-all">
              <span>Try Demo</span>
              <span className="transition-transform group-hover:translate-x-1">
                ⚡
              </span>
            </a>
          </div>

          <ul className="mt-10 grid grid-cols-3 gap-3 max-w-md mx-auto md:mx-0 text-left text-sm">
            {stats.map((s) => (
              <li
                key={s.label}
                className="flex flex-col p-3 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition">
                <span className="text-base font-semibold">{s.value}</span>
                <span className="text-[11px] uppercase tracking-wide text-gray-200/70">
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 w-full relative">
          <div
            className="absolute -inset-4 bg-gradient-to-tr from-white/10 via-white/5 to-transparent rounded-3xl blur-2xl opacity-70 animate-pulse"
            aria-hidden="true"
          />
          <div className="relative group rounded-2xl ring-1 ring-white/20 bg-white/5 backdrop-blur overflow-hidden">
            <Image
              src={chatDemo}
              alt="Chat app interface preview"
              width={1200}
              height={783}
              className="relative w-full h-auto rounded-2xl shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_70%)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
