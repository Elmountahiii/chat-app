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
    color: "bg-blue-500",
  },
  {
    icon: <Users className="w-6 h-6 text-white" />,
    title: "Friend System",
    description:
      "Connect with others. Send friend requests, accept invites, and manage your social circle effortlessly.",
    color: "bg-indigo-500",
  },
  {
    icon: <Fingerprint className="w-6 h-6 text-white" />,
    title: "Secure Authentication",
    description:
      "Robust JWT-based auth system ensures your conversations and data remain private and secure.",
    color: "bg-purple-500",
  },
  {
    icon: <Brain className="w-6 h-6 text-white" />,
    title: "Scalable Backend",
    description:
      "Engineered with Express.js and MongoDB to handle high concurrency and data volume efficiently.",
    color: "bg-pink-500",
  },
  {
    icon: <Container className="w-6 h-6 text-white" />,
    title: "Dockerized",
    description:
      "Fully containerized environment using Docker and Docker Compose for consistent deployment anywhere.",
    color: "bg-orange-500",
  },
  {
    icon: <Zap className="w-6 h-6 text-white" />,
    title: "High Performance",
    description:
      "Optimized frontend with Next.js and efficient backend logic for a snappy, responsive user experience.",
    color: "bg-yellow-500",
  },
];

function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Packed with Modern Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            A comprehensive showcase of full-stack development capabilities,
            from real-time sockets to containerization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div
                className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 shadow-md`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
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
