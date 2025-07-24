import React, { useState, useEffect, useRef } from 'react';
import { Users, Crown, LogOut, Send, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import storeRoom from '../zustand/room.zustand';


const MOCK_PLAYER_NAME = 'You';
const MOCK_ROOM_DATA = {
    topic: 'Is TypeScript the future of web development?',
    hostId: 'user-remote-456',
    players: [
        {  name: 'Mirun', color: '#db2777', isHost: true },
        {  name: 'Bob', color: '#059669', isHost: false },
    ],
};

const MOCK_MESSAGES = [
    {
        id: 'msg1',
        type: 'system',
        text: 'Room created with topic: "Is TypeScript the future of web development?"',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
        id: 'msg2',
        type: 'text',
        text: 'I think TypeScript offers amazing type safety, which prevents a lot of runtime errors.',
        senderId: 'user-remote-456',
        senderName: 'Alice',
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
    },
];
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

const UserAvatar = ({ name, color }) => {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`} style={{ backgroundColor: color }}>
            {initial}
        </div>
    );
};

const PrimaryButton = ({ children, onClick, className = '', icon: Icon, disabled = false, onMouseDown, onMouseUp, onTouchStart, onTouchEnd }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
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

const AudioPlayer = ({ src, duration }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const updateProgress = () => {
            setProgress((audio.currentTime / audio.duration) * 100);
        };
        const onEnded = () => {
            setIsPlaying(false);
            setProgress(0);
        };
        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', onEnded);
        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);
    
    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    return (
        <div className="flex items-center gap-3 w-64">
            <audio ref={audioRef} src={src} preload="metadata"></audio>
            <button onClick={togglePlay} className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{formatTime(duration)}</span>
        </div>
    );
};

// ... (ThemeToggle, UserAvatar, PrimaryButton, InputField remain same)

export default function DebateRoom() {
    
    const { name, users, roomCode } = storeRoom(); // from Zustand
    const nav = useNavigate();
    const [roomData, setRoomData] = useState(MOCK_ROOM_DATA);
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const playerExists = roomData.players.some(p => p.name === name);
        if (!playerExists) {
            const newPlayer = {
                name: name || MOCK_PLAYER_NAME,
                color: '#4f46e5',
                isHost: false,
            };
            setRoomData(prevData => ({
                ...prevData,
                players: [...prevData.players, newPlayer]
            }));
        }
    }, [name]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleLeave = () => {
        nav('/home'); // if you're navigating pages via Zustand
    };

    const sendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: `msg_${Date.now()}`,
                text: newMessage.trim(),
                type: 'text',
                senderName:name,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, newMsg]);
            setNewMessage('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col md:flex-row p-2 md:p-4 gap-4 transition-colors">
            {/* Left Panel */}
            <div className="w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
                <div className='flex justify-between items-start'>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Debate Room</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Code: {roomCode}</p>
                    </div>
                    <ThemeToggle />
                </div>
                <div className="my-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Topic:</p>
                    <p className="text-gray-600 dark:text-gray-300">{roomData.topic}</p>
                </div>
                <div className="flex-1 overflow-y-auto pr-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center"><Users className="mr-2" /> Participants ({roomData.players.length})</h3>
                    <div className="space-y-3">
                        {roomData.players.map(player => (
                            <div key={player.id} className="flex items-center">
                                <UserAvatar name={player.name} color={player.color} />
                                <span className="ml-3 font-medium text-gray-700 dark:text-gray-300 truncate">{player.name}</span>
                                {player.isHost && <Crown className="ml-auto text-yellow-500" title="Host" />}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Your name: {name}</p>
                    <PrimaryButton onClick={handleLeave} className="bg-red-600 hover:bg-red-700" icon={LogOut}>Leave Room</PrimaryButton>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full md:w-2/3 lg:w-3/4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col p-4">
                <div className="flex-1 mb-4 overflow-y-auto pr-2">
                    {messages.map(msg => {
                        const isYou = msg.name === name;
                        const player = roomData.players.find(p => p.id === msg.senderId);

                        if (msg.type === 'system') {
                            return <div key={msg.id} className="my-3 text-center text-xs text-gray-500 dark:text-gray-400"><p>{msg.text}</p></div>;
                        }

                        return (
                            <div key={msg.id} className={`flex items-start gap-3 my-4 ${isYou ? 'flex-row-reverse' : ''}`}>
                                <UserAvatar name={isYou ? name : player?.name} color={isYou ? '#4f46e5' : player?.color} />
                                <div className={`flex flex-col ${isYou ? 'items-end' : 'items-start'}`}>
                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{isYou ? 'You' : msg.senderName}</span>
                                    <div className={`p-3 rounded-lg max-w-xl ${isYou ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-bl-none'}`}>
                                        <p className="text-base">{msg.text}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <InputField
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                    />
                    <PrimaryButton onClick={sendMessage} className="!w-auto px-5" icon={Send} />
                </div>
            </div>
        </div>
    );
}
