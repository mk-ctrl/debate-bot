import {create} from 'zustand';
import {persist} from 'zustand/middleware';

const storeRoom = create(
    persist(
        (set)=>({
            roomCode:null,
            name:null,
            score:null,
            debateTopic:null,
            isHost:null,
            join : (roomCode,name,isHost)=>{
                set({roomCode,name,isHost});
            },
            create : (roomCode,name,isHost=true)=>{
                set({roomCode,name,isHost})
            },
            exit: ()=>{
            }
        })
    )
);
export default storeRoom;