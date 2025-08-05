import { useState, useEffect, useRef } from 'react';
import storeRoom from '../zustand/room.zustand';
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from '../axios/axio'
const socket = io("http://localhost:4476");

// A mock socket object to simulate the API

// --- END MOCK SETUP ---

// FIX: Added the initialData object that was missing.
// This data provides the structure for the UI that isn't covered by the real-time messages.
const initialData = {
    pinnedMessage: "A key argument about job displacement has been raised by Team AGAINST.",
    // participants: [
    //     { id: 1, name: 'Alex Ray', role: 'Moderator', avatar: 'M', avatarColor: '7c3aed' },
    //     { id: 2, name: 'Sarah Jones', role: 'Debater', team: 'Red', isSpeaking: true, avatar: 'S', avatarColor: '16a34a' },
    //     { id: 3, name: 'Ben Carter', role: 'Debater', team: 'Red', isSpeaking: false, avatar: 'B', avatarColor: '16a34a' },
    //     { id: 4, name: 'David Chen', role: 'Debater', team: 'Blue', isSpeaking: false, avatar: 'D', avatarColor: 'dc2626' },
    //     { id: 5, name: 'Emily Rodriguez', role: 'Debater', team: 'Blue', isSpeaking: false, avatar: 'E', avatarColor: 'dc2626' },
    // ],
    polls: [
        { id: 1, question: "Who made a stronger opening statement?", options: [{ text: "Team FOR", votes: 35 }, { text: "Team AGAINST", votes: 65 }], status: 'Closed' },
        { id: 2, question: "Is AI a net positive for job creation?", options: [{ text: "Yes", votes: 40 }, { text: "No", votes: 50 }, { text: "Unsure", votes: 10 }], status: 'Live' }
    ],
    questions: [
        { id: 1, user: "Audience Member", text: "Question for Team FOR: What specific policies can ensure that the new jobs created by AI are accessible to those whose jobs are displaced?", isAnswered: true },
        { id: 2, user: "Audience Member", text: "For Team AGAINST: If AI development is restricted, won't we fall behind other nations economically and technologically?", isAnswered: false }
    ],
    evidence: [
        { id: 1, user: "Sarah Jones (FOR)", text: "Report on AI and Future of Work - WEF", type: 'link', url: '#' },
        { id: 2, user: "David Chen (AGAINST)", text: "Study on Algorithmic Bias - MIT", type: 'pdf', url: '#' }
    ]
};


// Helper component for SVG Icons
const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

// --- Components ---

const Sidebar = ({ topic, participants, onLeave }) => {
    const moderator = participants.find(p => p.role === 'Moderator');
    const teamFor = participants.filter(p => p.team === 'Red');
    const teamAgainst = participants.filter(p => p.team === 'Blue');
   

    return (
        <aside className="w-full md:w-1/4 xl:w-1/5 bg-gray-800/50 p-4 flex flex-col space-y-4 overflow-y-auto border-r border-gray-700 h-screen">
            <div>
                <h1 className="text-xl font-bold text-white">Debate Topic</h1>
                <p className="text-sm text-blue-400">{topic}</p>
            </div>

             <button onClick={onLeave} className="w-full border rounded-md p-2 bg-amber-300 text-gray-900 font-bold hover:bg-red-800 hover:text-white transition-colors">
                Leave Room
            </button>

            <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                <div className="text-3xl font-mono font-bold text-white tracking-wider">02:45</div>
                <div className="text-xs uppercase text-yellow-400 font-semibold">Round 1: Opening Statements</div>
            </div>

            <div className="flex-grow">
                <h2 className="text-lg font-semibold mb-2 text-white">Participants ({participants.length})</h2>
                <ParticipantSection title="Moderator" participants={[moderator]} color="purple-400" />
                <ParticipantSection title="Team Red" participants={teamFor} color="green-400" />
                <ParticipantSection title="Team Blue" participants={teamAgainst} color="red-400" />
                {/* <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Audience ({audience.length})</h3>
                    <div className="flex flex-wrap gap-2">
                        {audience.slice(0, 3).map(p => <ParticipantAvatar key={p.id} participant={p} size="w-8 h-8" />)}
                        {audience.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white">
                                +{audience.length - 3}
                            </div>
                        )}
                    </div>
                </div> */}
            </div>
        </aside>
    );
};

const ParticipantSection = ({ title, participants, color }) => (
    <div className="mb-4">
        <h3 className={`text-sm font-bold text-${color} uppercase mb-2`}>{title}</h3>
        <ul className="space-y-2">
            {participants.map(p => p && <ParticipantItem key={p.id} participant={p} />)}
        </ul>
    </div>
);

const ParticipantItem = ({ participant }) => (
    <li className={`flex items-center space-x-3 p-2 rounded-lg ${participant.isSpeaking ? 'bg-gray-700' : ''}`}>
        <ParticipantAvatar participant={participant} size="w-8 h-8" />
        <div className="flex-grow">
            <span className="font-medium text-white">{participant.name}</span>
            {/* {participant.isSpeaking && (
                // <div className="text-xs text-green-400 font-semibold flex items-center">
                //     <Icon path="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 7.5v-1.5a6 6 0 00-6-6.75m-6 6.75a6 6 0 016-6.75m6 6.75v-1.5m-12 7.5v-1.5" className="w-4 h-4 mr-2 animate-pulse" />
                //     Speaking...
                // </div>
            )} */}
        </div>
    </li>
);

const ParticipantAvatar = ({ participant, size }) => (
    <img 
        src={`https://placehold.co/40x40/${participant.avatarColor}/ffffff?text=${participant.avatar}`} 
        alt={participant.name} 
        className={`${size} rounded-full`}
        onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/40x40/cccccc/ffffff?text=?`; }}
    />
);

const MainContent = ({ messages, pinnedMessage, onSendMessage, currentUser, teamBlue, teamRed }) => {
    const messagesEndRef = useRef(null);
    // console.log("teamBlue",teamBlue);
    // console.log("teamRed",teamRed);
    // console.log("currentUser",currentUser);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <main className="flex-1 flex flex-col bg-gray-900 h-screen">
            {/* <div className="bg-blue-900/50 border-b border-blue-700 p-3 text-center text-sm sticky top-0 z-10">
                <Icon path="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" className="w-5 h-5 inline-block mr-2 text-blue-400" />
                <span className="font-semibold text-white">PINNED:</span> {pinnedMessage}
            </div> */}

            <div id="message-container" className="flex-1 p-4 space-y-6 overflow-y-auto">
                <div className="text-center text-xs text-gray-400 uppercase">Today</div>
                {messages.map(msg => (
                    <Message key={msg.id} message={msg} User={currentUser} teamBlue={teamBlue} teamRed={teamRed} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <MessageInput onSendMessage={onSendMessage} />
        </main>
    );
};

const Message = ({ message, User, teamBlue, teamRed }) => {
    const isMe = message.sender === User;
    const isModerator = message.sender === 'Moderator';
    // console.log("message is",message);
    // console.log("sender is",message.sender);
    if (isModerator) {
        return (
            <div className="text-center my-2">
                <p className="text-sm text-yellow-400 bg-gray-700 rounded-full inline-block px-4 py-1">{message.text}</p>
            </div>
        );
    }
    
    const teamColorClass = teamBlue.includes(message.sender) ? 'bg-blue-700' : teamRed.includes(message.sender) ? 'bg-red-700' : 'bg-gray-600';
    const nameColorClass = teamBlue.includes(message.sender) ? 'text-blue-300' : teamRed.includes(message.sender) ? 'text-red-300' : 'text-gray-300';

    return (
        <div className={`flex items-end gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
            {!isMe && (
    <img 
        src={`https://placehold.co/40x40/6b7280/ffffff?text=${(message.sender || '?')[0]}`} 
        alt={message.sender || 'Unknown'} 
        className="w-8 h-8 rounded-full" 
    />
)}
            <div className={`max-w-lg lg:max-w-xl px-4 py-2 rounded-lg ${isMe ? 'bg-blue-600' : teamColorClass}`}>
                {!isMe && <p className={`text-xs font-bold mb-1 ${nameColorClass}`}>{message.sender}</p>}
                <p className="text-white">{message.text}</p>
                <p className="text-xs text-gray-300/70 text-right mt-1">{message.timestamp}</p>
            </div>
        </div>
    );
};

const MessageInput = ({ onSendMessage }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <div className="p-4 bg-gray-800/60 border-t border-gray-700">
            <form onSubmit={handleSend} className="bg-gray-700 rounded-lg flex items-center px-2">
                <textarea
                    rows="1"
                    placeholder="Type your message or argument..."
                    className="w-full bg-transparent p-2 text-gray-200 placeholder-gray-400 focus:outline-none resize-none"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(e);
                        }
                    }}
                />
                <button type="submit" disabled={!inputValue.trim()} className="p-2 text-blue-500 hover:text-blue-400 font-bold disabled:text-gray-500 disabled:cursor-not-allowed">
                    <Icon path="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" className="w-6 h-6" />
                </button>
            </form>
        </div>
    );
};

const RightPanel = ({ polls, questions, evidence }) => {
    const [activeTab, setActiveTab] = useState('polls');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'polls': return <PollsTab polls={polls} />;
            case 'qa': return <QATab questions={questions} />;
            case 'evidence': return <EvidenceTab evidence={evidence} />;
            default: return null;
        }
    };

    return (
        <aside className="hidden lg:flex w-1/4 xl:w-1/5 bg-gray-800/50 p-4 flex-col space-y-4 border-l border-gray-700 h-screen">
            <div className="flex border-b border-gray-700">
                <TabButton id="polls" activeTab={activeTab} setActiveTab={setActiveTab} label="Polls" />
                <TabButton id="qa" activeTab={activeTab} setActiveTab={setActiveTab} label="Q&A" />
                <TabButton id="evidence" activeTab={activeTab} setActiveTab={setActiveTab} label="Evidence" />
            </div>
            <div className="flex-grow overflow-y-auto">{renderTabContent()}</div>
        </aside>
    );
};

const TabButton = ({ id, activeTab, setActiveTab, label }) => (
    <button onClick={() => setActiveTab(id)} className={`flex-1 p-2 text-sm font-semibold border-b-2 transition-colors duration-200 ${activeTab === id ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>
        {label}
    </button>
);

const PollsTab = ({ polls }) => (
    <div className="space-y-4">
        {polls.map(poll => (
            <div key={poll.id} className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-white text-sm">{poll.question}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${poll.status === 'Live' ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-600 text-gray-300'}`}>{poll.status}</span>
                </div>
                <div className="space-y-2">
                    {poll.options.map(opt => (
                        <div key={opt.text} className="text-xs">
                            <div className="flex justify-between mb-1 text-gray-300">
                                <span>{opt.text}</span>
                                <span>{opt.votes}%</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${opt.votes}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const QATab = ({ questions }) => (
    <div className="space-y-3">
        {questions.map(q => (
            <div key={q.id} className={`p-3 rounded-lg ${q.isAnswered ? 'bg-green-900/30' : 'bg-gray-700/50'}`}>
                <p className="text-sm text-gray-200">{q.text}</p>
                <div className="text-xs text-gray-400 mt-1 flex justify-between items-center">
                    <span>- {q.user}</span>
                    {q.isAnswered && <span className="text-green-400 font-bold">Answered</span>}
                </div>
            </div>
        ))}
    </div>
);

const EvidenceTab = ({ evidence }) => (
    <ul className="space-y-3">
        {evidence.map(e => (
            <li key={e.id} className="bg-gray-700/50 p-3 rounded-lg flex items-center space-x-3">
                <Icon path={e.type === 'link' ? "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" : "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"} className="w-6 h-6 text-blue-400 flex-shrink-0" />
                <div className="flex-grow">
                    <a href={e.url} className="text-sm text-blue-300 hover:underline">{e.text}</a>
                    <p className="text-xs text-gray-400">Shared by {e.user}</p>
                </div>
            </li>
        ))}
    </ul>
);

// --- Main App Component ---
export default function NewDebate() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { roomCode, name, topic, OnlineUsers, teamSide, team_red, team_blue, exit } = storeRoom();
  const nav = useNavigate();

  // Build participants from team_red + team_blue (keeps your requested source)
  const participants = [
    ...team_red.map((n, i) => ({
      id: `r-${i}-${n}`,
      name: n,
      team: 'Red',
      avatar: n[0]?.toUpperCase() || '?',
      avatarColor: '16a34a',
      isSpeaking: false
    })),
    ...team_blue.map((n, i) => ({
      id: `b-${i}-${n}`,
      name: n,
      team: 'Blue',
      avatar: n[0]?.toUpperCase() || '?',
      avatarColor: 'dc2626',
      isSpeaking: false
    }))
  ];

  const { pinnedMessage, polls, questions, evidence } = initialData;

  // message socket listeners (kept)
  useEffect(() => {
    if (!name || !roomCode) return;

    socket.on('connect', () => {
      console.log("Connected to socket server");
      socket.emit("adduser", name);
    });

    socket.on("message", (incoming) => {
      const newMessage = {
        id: incoming.id ?? Date.now() + Math.random(),
        text: incoming.message ?? incoming.msg ?? '',
        sender: incoming.user ?? incoming.user ?? 'Unknown',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, newMessage]);
    });

    return () => {
      socket.off("connect");
      socket.off("message");
    };
  }, [name, roomCode]);

  // room-updated listener & join-room emit
  useEffect(() => {
    if (!name || !roomCode) return;

    // Tell server to add this socket to the socket.io room
    socket.emit('join-room', { roomCode, username: name });

    const handleRoomUpdated = (room) => {
      console.log('room-updated received', room);
      // update zustand from server authoritative room
      storeRoom.getState().setRoomFromServer(room);
      // optional: update messages or UI if needed
    };

    socket.on('room-updated', handleRoomUpdated);

    return () => {
      socket.off('room-updated', handleRoomUpdated);
      // leave room on cleanup
      socket.emit('leave-room', { roomCode, username: name });
    };
  }, [name, roomCode]);

  const handleSendMessage = (text) => {
    if (text.trim() === '') return;
    socket.emit("message", { msg: text, user: name });
    setNewMessage('');
  };

  const handleLeave = async () => {
    try {
      const res = await axiosInstance.post('/chat/room-exit', { roomCode, username: name });
      const updatedRoom = res.data.room;

      // update local store with authoritative server state
      if (updatedRoom) {
        storeRoom.getState().setRoomFromServer(updatedRoom);
      }

      // local cleanup
      exit();
      nav('/room-join');
      toast.success('Left Room');
    } catch (err) {
      console.error('Leave error', err);
      toast.error('Could not leave room');
      // optionally still nav:
      exit();
      nav('/room-join');
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#111827", color: "#d1d5db" }} className="antialiased">
      <div className="flex flex-col md:flex-row w-full bg-gray-900 text-gray-300">
        <Sidebar topic={topic} participants={participants} onLeave={handleLeave} />
        <MainContent
          messages={messages}
          pinnedMessage={pinnedMessage}
          onSendMessage={handleSendMessage}
          currentUser={name}
          teamBlue={team_blue}
          teamRed={team_red}
        />
        <RightPanel
          polls={polls}
          questions={questions}
          evidence={evidence}
        />
      </div>
    </div>
  );
}