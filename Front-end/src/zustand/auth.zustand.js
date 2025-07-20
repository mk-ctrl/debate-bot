import {create} from 'zustand';
import {persist} from 'zustand/middleware';

const globalAuth = create(
    persist(
        (set)=>({
            email:null,
            token:null,
            login: (email,token)=>{
                set({email,token});
                localStorage.setItem('token',token);
            },
            logout: ()=>{
                set({email:null,token:null});
                localStorage.removeItem('token');
            }
        }),
        {
            name: 'global-auth-store'
        }
    )
);

export default globalAuth;
