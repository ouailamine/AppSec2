import React from "react";

const NavBar = () => {
  return (
    <nav className="bg-gray-600 p-2 items-center">
      <div className="flex space-x-6">
        <a
          href={route("plannings.index")}
          className="block px-4 py-2 text-white hover:bg-blue-600 rounded-lg transition-colors duration-200 font-bold"
        >
          Recherche un planning
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
