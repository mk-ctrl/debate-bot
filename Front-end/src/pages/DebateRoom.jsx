import { useState, useEffect, useRef } from 'react';
import storeRoom from '../zustand/room.zustand';
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const socket = io("http://localhost:4476");



function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null); // Ref for auto-scrolling
  let {name,exit} = storeRoom();
  const nav = useNavigate();
  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // useEffect to scroll to bottom whenever messages change
  useEffect(scrollToBottom, [messages]);

    useEffect(() => {
      socket.on('connect', () => {
        console.log("Connected to server");
        socket.emit("adduser", name); // send username to server
      });

      socket.on("message", ({ message, user }) => {
        const newMessage = {
          id: Date.now(),
          text: message,
          sender: user,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, newMessage]);
      });

  return () => {
    socket.off("connect");
    socket.off("message");
  };
}, []);

   const handleSendMessage = (e) => {
  e.preventDefault();
  if (newMessage.trim() === '') return;

  socket.emit("message", newMessage); // only emit to server
  setNewMessage(''); // clear input field
};

  const handleLeave = ()=>{
    exit();
    nav('/room-join');
    toast.success('Left Room');
  }

    

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <div>
           <h1 className="text-xl font-bold text-blue-400">Debate Topic: AI in Creative Arts</h1>
           <p className="text-sm text-gray-400">Logged in as: <span className="font-semibold">{name}</span></p>
        </div>
        <div>
          <button className="border rounded-sm p-2 bg-amber-300 hover:cursor-pointer hover:bg-red-800" onClick={handleLeave}>Leave Room</button>
        </div>
        
      </header>

      {/* Message List */}
      <main className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isMe = msg.sender === name;
            const isModerator = msg.sender === 'Moderator';
            
            // Moderator Message Style
            if(isModerator) {
              return (
                <div key={msg.id} className="text-center my-2">
                    <p className="text-sm text-yellow-400 bg-gray-700 rounded-full inline-block px-4 py-1">{msg.text}</p>
                </div>
              )
            }

            // User Message Style
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-lg lg:max-w-xl px-4 py-2 rounded-lg ${isMe ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  {!isMe && <p className="text-xs text-gray-400 font-bold">{msg.sender}</p>}
                  <p className="text-white">{msg.text}</p>
                  <p className={`text-xs text-right mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>{msg.timestamp}</p>
                </div>
              </div>
            );
          })}
          {/* Empty div to which we can scroll */}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Message Input Form */}
      <footer className="bg-gray-800 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your argument..."
            className="flex-grow bg-gray-700 p-3 rounded-l-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 px-6 rounded-r-md transition-colors"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}

export default ChatRoom;