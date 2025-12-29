import React from "react";
import { GitHub, LinkedIn } from "./Icons";
import { MessageCircle, Heart } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
               <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                ChatApp
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-sm mb-8">
              A modern, scalable real-time messaging platform built to demonstrate the power of full-stack development with Next.js and Socket.io.
            </p>
            <div className="flex gap-4">
               <a
                href="https://github.com/Elmountahiii"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all hover:shadow-md"
                aria-label="GitHub"
              >
                <GitHub className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/elmountahiii"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all hover:shadow-md"
                aria-label="LinkedIn"
              >
                <LinkedIn className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Product</h4>
            <ul className="space-y-4">
              {['Features', 'Tech Stack', 'Architecture'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-slate-500 hover:text-blue-600 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {currentYear} Elmountahiii. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" /> by Elmountahiii
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
