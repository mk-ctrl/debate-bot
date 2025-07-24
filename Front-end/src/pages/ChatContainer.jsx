import React, { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../axios/axio';
import LogoutButton from '../assets/logoutButton';
import globalAuth from '../zustand/auth.zustand';
// --- Helper Component for Individual Chat Bubbles ---
const MessageBubble = ({ message }) => {
  const { text, sender, timestamp } = message;
  const email = globalAuth((set)=> set.email);
  // Determine if the message was sent by the current user or received
  const isSent = sender === email;

  // Dynamic classes for styling based on the sender
  const bubbleClasses = isSent
    ? 'bg-blue-600 text-white self-end'
    : 'bg-gray-200 text-gray-800 self-start';
  
  const containerClasses = isSent ? 'flex justify-end' : 'flex justify-start';

  return (
    <div className={`w-full ${containerClasses} mb-2`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl shadow ${bubbleClasses}`}>
        <p className="text-sm break-words">{text}</p>
        <p className={`text-xs mt-1 opacity-75 ${isSent ? 'text-right' : 'text-left'}`}>
          {timestamp}
        </p>
        <p className={`text-xs mt-1 opacity-75 ${isSent ? 'text-right' : 'text-left'}`}>
          Sent by {email}
        </p>
      </div>
    </div>
  );
};

// --- Main Chat Container Component ---
const ChatContainer = () => {
  // const [user,setUser] = useState("");
  const email = globalAuth((set)=> set.email);
  // --- State Management ---
  // A ref to the message list container for auto-scrolling
  const messagesEndRef = useRef(null);
  
  // State for the list of messages
  const [messages, setMessages] = useState([]);

  // State for the current message being typed in the input
  const [newMessage, setNewMessage] = useState('');

  // --- Auto-Scrolling Effect ---
  // This effect runs whenever the 'messages' state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Event Handlers ---
  const handleSendMessage = async (e) => {
    // Prevent the form from refreshing the page
    e.preventDefault();

    // Don't send empty messages
    if (newMessage.trim() === '') return;

    // Create a new message object
    const messageToSend = {
      id: messages.length + 1,
      text: newMessage,
      sender: email,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    //sending message to backend
    // Add the new message to the state
    setMessages([...messages, messageToSend]);
    // Clear the input field
    setNewMessage('');
    const result = await axiosInstance.post('/chat/message',{newMessage});
    const aiReply = {
      id: messages.length + 1,
      text: result.data.reply,
      sender: 'Ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev,aiReply])

  };

  return (
    // Main container with a modern, centered layout
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <LogoutButton/>
      <div className="flex flex-col w-full max-w-3xl h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-200">
        
        {/* --- Chat Header --- */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <img 
              src="https://placehold.co/40x40/7e22ce/ffffff?text=JD" 
              alt="Jane Doe" 
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Jane Doe</h2>
              <p className="text-sm text-green-500">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Placeholder for action icons */}
            <button className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0M8.464 15.536a5 5 0 010-7.072" /></svg>
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
          </div>
        </div>

        {/* --- Message List --- */}
        <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {/* Empty div at the end of the list to act as a scroll target */}
          <div ref={messagesEndRef} />
        </div>

        {/* --- Message Input Form --- */}
        <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="flex-shrink-0 bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {/* Send Icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ChatContainer;