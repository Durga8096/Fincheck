import React from 'react';
import '../index.css'

const Header = () => {
  return (
    <header className="bg-[#97A4A7] shadow-md">
      <div className="container mx-auto px-2 py-2 flex justify-between items-center">
      <a href="/">
  <span>
    <img className="w-42 h-16 cursor-pointer" src="logo.png" alt="Logo" />
  </span>
</a>
        <nav>
          <ul className="flex space-x-6">
            <li className="text-white text-lg font-bold hover:text-gray-600">Features</li>
            <li className="text-white text-lg font-bold hover:text-gray-600">About</li>
            <li className="text-white text-lg font-bold hover:text-gray-600">Contact</li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;

