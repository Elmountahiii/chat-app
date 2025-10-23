import React from "react";
import { GitHubIcon, LinkedInIcon } from "./Icons";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary border-t border-secondary py-8">
      <div className="container mx-auto px-6 text-center text-dark-text">
        <div className="flex justify-center space-x-6 mb-4">
          <a
            href="https://github.com/elmountahiii"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark-text hover:text-accent transition-colors">
            <GitHubIcon className="w-6 h-6" />
          </a>
          <a
            href="https://linkedin.com/in/elmountahiii"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark-text hover:text-accent transition-colors">
            <LinkedInIcon className="w-6 h-6" />
          </a>
        </div>
        <p>&copy; {currentYear} Your Name. All Rights Reserved.</p>
        <p className="text-sm mt-2">
          This landing page is a showcase for a portfolio project.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
