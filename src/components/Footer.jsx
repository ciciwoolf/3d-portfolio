import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-black-100 border-t border-white-10">
      <div className="container mx-auto py-8 md:p-8 lg:p-12 flex flex-col justify-between items-center">
        <div className="p-2">
          <p className="text-white-50">© {new Date().getFullYear()} Christine Woolf</p>
        </div>
        <div className="p-2">
          <p className="text-white-50">
            <a
              href="https://artstation.com/oleaf/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 transition-colors flex items-center gap-2"
              aria-label="See oleaf's 3D models"
            >
              3D Model created by{' '}
              <span className="underline">Olha Kovtun </span>
            </a>
          </p>
        </div>

        <div className="flex items-center p-2">
          <a
            href="https://www.linkedin.com/in/christinewoolf/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-400 transition-colors flex items-center gap-2"
            aria-label="Connect on LinkedIn"
          >
            <span>Let's Connect</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
