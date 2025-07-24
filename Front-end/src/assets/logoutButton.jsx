import React from 'react';
import globalAuth from '../zustand/auth.zustand';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const nav = useNavigate();
    const logout = globalAuth((set)=> set.logout);
  /**
   * Handles the logout logic.
   * In a real application, you would:
   * 1. Clear authentication tokens (from localStorage or cookies).
   * 2. Call a logout endpoint on your backend API.
   * 3. Redirect the user to the login page.
   * For this example, we'll just log to the console and simulate a refresh.
   */

  const handleLogout = async () => {
    console.log("User logging out...");
    await logout();
    toast.success("Logout Successful");
    nav('/login') // Or just window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      // --- Styling with Tailwind CSS ---
      // position: fixed to keep it on top of all content
      // top-4 right-4: positions it in the top-right corner with some margin
      // z-50: a high z-index ensures it appears above other elements
      // flex items-center: to align the icon and text
      // bg-red-500 hover:bg-red-600: colors for the button
      // text-white font-bold: text styling
      // py-2 px-4: padding
      // rounded-full: makes the button a pill shape
      // shadow-lg: adds a nice drop shadow
      // transition-transform transform hover:scale-105: adds a subtle zoom effect on hover
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
      
      {/* --- Button Text --- */}
      {/* The text is hidden on small screens (sm:) to save space, showing only the icon */}
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
};

export default LogoutButton;