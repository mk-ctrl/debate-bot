import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const storeRoom = create(
  persist(
    (set) => ({
      roomCode: null,
      name: null,         // current user's name (host or participant)
      score: null,
      isHost: false,
      topic: null,
      users: [],
      
      join: (roomCode, currentUserName, users) => {
        set({ roomCode, name: currentUserName, users });
      },

      create: (roomCode, hostName, topic, isHost = true) => {
        set({ roomCode, name: hostName, topic, isHost, users: [hostName] });
      },

      exit: () => {
        set({
          roomCode: null,
          name: null,
          score: null,
          isHost: false,
          topic: null,
          users: [],
        });
      },
    }),
    {
      name: 'room-store', // key for localStorage
    }
  )
);

export default storeRoom;
