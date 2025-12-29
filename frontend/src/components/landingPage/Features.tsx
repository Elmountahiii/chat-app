import React from "react";
import {
  MessageSquareText,
  Fingerprint,
  Brain,
  Container,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: <MessageSquareText className="w-6 h-6 text-white" />,
    title: "Real-Time Messaging",
    description:
      "Instant message delivery powered by Socket.io. Experience fluid conversations with typing indicators and live status updates.",
    className: "md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-transparent",
    iconBg: "bg-white/20",
    textClass: "text-blue-50"
  },
  {
    icon: <Users className="w-6 h-6 text-indigo-600" />,
    title: "Friend System",
    description:
      "Connect with others. Send friend requests, accept invites, and manage your social circle.",
    className: "bg-white border-slate-100",
    iconBg: "bg-indigo-50",
    textClass: "text-slate-600"
  },
  {
    icon: <Fingerprint className="w-6 h-6 text-emerald-600" />,
    title: "Secure Authentication",
    description:
      "Robust JWT-based auth system ensures your conversations and data remain private and secure.",
    className: "bg-white border-slate-100",
    iconBg: "bg-emerald-50",
    textClass: "text-slate-600"
  },
  {
    icon: <Brain className="w-6 h-6 text-white" />,
    title: "Scalable Backend",
    description:
      "Engineered with Express.js and MongoDB to handle high concurrency and data volume efficiently.",
    className: "md:col-span-2 bg-slate-900 text-white border-transparent",
    iconBg: "bg-white/10",
    textClass: "text-slate-400"
  },
  {
    icon: <Container className="w-6 h-6 text-orange-600" />,
    title: "Dockerized",
    description:
      "Fully containerized environment using Docker and Docker Compose for consistent deployment.",
    className: "bg-white border-slate-100",
    iconBg: "bg-orange-50",
    textClass: "text-slate-600"
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-600" />,
    title: "High Performance",
    description:
      "Optimized frontend with Next.js and efficient backend logic for a snappy, responsive user experience.",
    className: "md:col-span-2 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100",
    iconBg: "bg-white",
    textClass: "text-amber-900/80"
  },
];

function Features() {
  return (
    <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
             <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Packed with Modern Features
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            A comprehensive showcase of full-stack development capabilities,
            from real-time sockets to containerization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border ${feature.className}`}
            >
              <div
                className={`w-12 h-12 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 backdrop-blur-sm`}
              >
                {feature.icon}
              </div>
              <h3 className={`text-xl font-bold mb-3 ${feature.className?.includes('text-white') ? 'text-white' : 'text-slate-900'}`}>
                {feature.title}
              </h3>
              <p className={`leading-relaxed ${feature.textClass}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
