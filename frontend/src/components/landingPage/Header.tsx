import React from "react";
import Link from "next/link";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            ChatApp
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
            Features
          </a>
          <a
            href="#tech-stack"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
            Tech Stack
          </a>
          <a
            href="#architecture"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
            Architecture
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors hidden sm:block">
            Log in
          </Link>
          <Link
            href="/auth/register"
            className="bg-blue-600 text-white text-sm font-semibold py-2.5 px-5 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
