import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const storeRoom = create((
  persist(
    (set,get) => ({
      roomCode: null,
      name: null,         // current user's name (host or participant)
      score: null,
      isHost: false,
      topic: null,
      OnlineUsers: [],
      teamSide:null,
      
      join: (roomCode, currentUserName, users) => {
        set({ roomCode, name: currentUserName, OnlineUsers:users});

        // get().connectSocket()
      },
      create: (roomCode, hostName, topic, isHost = true) => {
        set({ roomCode, name: hostName, topic, isHost, OnlineUsers: [hostName] });
      },
      setTeam: (teamSide)=>{
        set({teamSide});
      },
      exit: () => {
        set({
          roomCode: null,
          name: null,
          score: null,
          isHost: false,
          topic: null,
          OnlineUsers: [],
          teamSide:null
        });
      },

    }),
    {
      name: 'room-store', // key for localStorage
    }
  )))



export default storeRoom;
