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
      team_red:[],
      team_blue:[],
      
      join: (roomCode, currentUserName, users,team_red,team_blue,topic) => {
        set({ roomCode, name: currentUserName, OnlineUsers:users,team_red,team_blue,topic});

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
