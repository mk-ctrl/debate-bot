import React, { useState } from 'react';
import { Home, PlusSquare } from 'lucide-react';
import storeRoom from '../zustand/room.zustand';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from '../axios/axio';
import LogoutButton from '../assets/logoutButton';

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



export default function CreateRoomPage() {
    const [roomData,setRoomData]= useState({
        name:'',roomCode:'',topic:''
    })
    const create = storeRoom((state)=>state.create);
    const nav = useNavigate();
    const generateRoomCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const handleCreate = async () => {
        roomData.roomCode = generateRoomCode();
        console.log(roomData);
        if (roomData.roomCode.length === 6 && roomData.name.trim()) {
                    await create(roomData.roomCode,roomData.name,roomData.topic)
                    const result = await axiosInstance.post('/chat/room-create',roomData);
                    console.log(result);
                    toast.success(result.data.message);
                    nav('/debate-space');
                } else {
                    toast.error("Failed to Join Room");
                }
    };

    return (
        <PageContainer>
            <LogoutButton/>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Create a New Debate</h1>
            <div className="space-y-4">
                <InputField value={roomData.name} onChange={(e) => setRoomData((prev)=>({...prev,name:e.target.value}))} placeholder="Your Name" maxLength="20" />
                <InputField value={roomData.topic} onChange={(e) => setRoomData((prev)=>({...prev,topic:e.target.value.toUpperCase()}))} placeholder="Debate Topic" maxLength="100" />
                <PrimaryButton onClick={handleCreate} icon={PlusSquare}>Create & Join</PrimaryButton>
                <PrimaryButton onClick={()=> nav('/room-join')} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 !text-gray-800 dark:!text-gray-200" icon={Home}>Want to Join?</PrimaryButton>
            </div>
        </PageContainer>
    );
}