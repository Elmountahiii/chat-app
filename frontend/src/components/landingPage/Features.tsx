import { MessageCircle, Lock, Zap } from "lucide-react";

export default function Features() {
  // Enhanced feature definitions with gradient accents
  const features = [
    {
      icon: MessageCircle,
      title: "Instant Messaging",
      desc: "Send and receive messages in real time without any delays.",
      grad: "from-indigo-500 to-purple-500",
    },
    {
      icon: Lock,
      title: "Secure Communication",
      desc: "Built with end-to-end security in mind for your privacy.",
      grad: "from-violet-500 to-fuchsia-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Powered by Socket.IO for seamless, low-latency messaging.",
      grad: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background pattern & glows */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-indigo-50" />
        <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,#6366f111,transparent_0)] [background-size:22px_22px]" />
        <div className="absolute -top-24 -left-16 w-72 h-72 bg-indigo-200/60 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] bg-pink-200/60 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold tracking-wider uppercase bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full ring-1 ring-indigo-200">
            Why choose us
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight">
            Feature-rich foundation
          </h2>
          <p className="mt-4 text-gray-600">
            Everything you need to build engaging real-time experiences.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative rounded-2xl p-px bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent hover:from-indigo-500/50 hover:via-purple-500/35 transition">
                <div className="h-full rounded-[inherit] bg-white backdrop-blur supports-[backdrop-filter]:bg-white/80 ring-1 ring-black/5 p-6 flex flex-col">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${f.grad} text-white shadow-lg shadow-indigo-900/10 ring-1 ring-white/30`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {f.desc}
                  </p>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
