import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export const Menu = () => {
  const navLinks = [
    { to: "/items", text: "items" },
    { to: "/about", text: "sobre" },
  ];

    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-end md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white hover:text-yellow-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
  
          <div className={`md:flex justify-center items-center ${isOpen ? "block" : "hidden"} md:block`}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative group px-4 py-3 block md:inline-block text-lg font-bold uppercase tracking-wide transition duration-300 ease-in-out ${
                    isActive
                      ? "text-yellow-300"
                      : "text-white hover:text-yellow-300"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.text}
                <span className="absolute left-1/2 -bottom-1 w-0 h-1 bg-yellow-300 transition-all duration-300 ease-in-out transform -translate-x-1/2 group-hover:w-6"></span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    );
  };