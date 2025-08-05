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
      users:[],
      setUsers: (arr) => set({ users: arr }),
      setTeamRed: (arr) => set({ team_red: arr }),
      setTeamBlue: (arr) => set({ team_blue: arr }),

      setRoomFromServer: (room) => {
        if (!room) return;
        set({
          users: Array.isArray(room.users) ? room.users : get().users,
          team_red: Array.isArray(room.team_red) ? room.team_red : get().team_red,
          team_blue: Array.isArray(room.team_blue) ? room.team_blue : get().team_blue,
          roomCode: room.code ?? get().roomCode,
          topic: room.topic ?? get().topic,
        });
      },

      removeUserFromRoom: (username) => set(state => ({
        users: state.users.filter(u => u !== username),
        team_red: state.team_red.filter(u => u !== username),
        team_blue: state.team_blue.filter(u => u !== username),
      })),
      

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
          teamSide:null,
          team_red:[],
          team_blue:[],
        });
      },

    }),
    {
      name: 'room-store', // key for localStorage
    }
  )))



export default storeRoom;
