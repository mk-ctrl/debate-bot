import React from 'react';
import globalAuth from '../zustand/auth.zustand';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const nav = useNavigate();
    const logout = globalAuth((set)=> set.logout);
    const handleLogout = async () => {
    console.log("User logging out...");
    await logout();
    toast.success("Logout Successful");
    nav('/login') // Or just window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 z-50 flex items-center bg-red-500 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-red-600 transition-transform transform hover:scale-105"
    >
      {/* --- Logout Icon (Inline SVG) --- */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2" // Size and margin for the icon
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
};

export default LogoutButton;