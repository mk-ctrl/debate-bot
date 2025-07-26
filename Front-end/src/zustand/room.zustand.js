import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {io} from 'socket.io-client'

const storeRoom = create((
  persist(
    (set,get) => ({
      roomCode: null,
      name: null,         // current user's name (host or participant)
      score: null,
      isHost: false,
      topic: null,
      OnlineUsers: [],
      
      join: (roomCode, currentUserName, users) => {
        set({ roomCode, name: currentUserName, OnlineUsers:users });

        get().connectSocket()
      },
      create: (roomCode, hostName, topic, isHost = true) => {
        set({ roomCode, name: hostName, topic, isHost, OnlineUsers: [hostName] });
      },
      exit: () => {
        set({
          roomCode: null,
          name: null,
          score: null,
          isHost: false,
          topic: null,
          OnlineUsers: [],
        });
      },
      connectSocket: ()=>{
        const socket = io("http://localhost:4476");
        socket.connect();
      },
      disconnectSocket: ()=>{

      }
    }),
    {
      name: 'room-store', // key for localStorage
    }
  )))



export default storeRoom;
