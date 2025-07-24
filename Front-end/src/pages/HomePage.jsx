import React, { useState, useEffect } from 'react';
import { ArrowRight, PlusSquare, Sun, Moon } from 'lucide-react';
import storeRoom from '../zustand/room.zustand.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axios/axio.js';

// =================================================================
// --- Re-usable UI Components (Normally in a separate file) ---
// =================================================================

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof localStorage !== 'undefined') {
        const theme = localStorage.getItem('theme');
        return theme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

const PrimaryButton = ({ children, onClick, className = '', icon: Icon, disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex items-center justify-center text-base font-semibold text-white py-3 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed ${className}`}
    >
        {Icon && <Icon className="mr-2 h-5 w-5" />}
        {children}
    </button>
);

const InputField = ({ value, onChange, placeholder, type = "text", maxLength }) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 text-base p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
    />
);

const PageContainer = ({ children }) => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 flex flex-col items-center justify-center transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
            {children}
        </div>
    </div>
);


export default function HomePage() {
    const nav = useNavigate();
    const [error, setError] = useState('');
    const join = storeRoom((state)=>state.join);
    const [roomData,setRoomData] = useState({
        name:'',
        roomCode:'',
    })
    const handleJoin = async () => {
        if (roomData.roomCode.length === 6 && roomData.name.trim()) {
            // await join(roomData.roomCode,roomData.name,false)
            const result = await axiosInstance.post('/chat/room-join',roomData);
            const {roomCode,user,host,message,username} = result.data
            await join(roomCode,username,user)
            
            toast.success(message);
            nav('/debate-space');
        } else {
            setError("Please enter your name and a 6-character room code.");
            toast.error("Failed to Join Room");
        }
    };

    return (
        <PageContainer>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Debate Platform</h1>
                <ThemeToggle />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Join an existing debate room or create a new one.</p>
            <div className="space-y-4">
                <InputField value={roomData.name } onChange={(e)=> setRoomData((prev)=>({...prev,name:e.target.value}))} placeholder="Enter Your Name" maxLength="20" />
                <InputField value={roomData.roomCode } onChange={(e)=> setRoomData((prev)=>({...prev,roomCode:e.target.value.toUpperCase()}))} placeholder="Enter Room Code" maxLength="6" />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <PrimaryButton onClick={handleJoin} icon={ArrowRight}>Join Room</PrimaryButton>
                <PrimaryButton onClick={()=> nav('/room-create')} className="bg-gray-600 hover:bg-gray-700" icon={PlusSquare}>Create Room</PrimaryButton>
            </div>
        </PageContainer>
    );
}