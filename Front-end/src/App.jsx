import React from 'react'
import { Routes,Route } from 'react-router-dom'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectRoute from './assets/protectedRoute/protectRoute';
// #PAGES#
import CreateRoomPage from './pages/CreateRoom';
import Signup from './pages/Signup'
import Login from './pages/Login'
import DashboardPage from './pages/dash';
import RoomJoin from './pages/RoomJoin';
import ChatRoom from './pages/DebateRoom';
import NewDebate from './pages/NewDebate';
// #PAGES#
const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard' element={
          <ProtectRoute>
            <DashboardPage/>
          </ProtectRoute>
        }/>
        <Route path='/room-join'element={
          <ProtectRoute>
            <RoomJoin/>
          </ProtectRoute>
        }/>
        <Route path='/room-create'element={
          <ProtectRoute>
            <CreateRoomPage/>
          </ProtectRoute>
        }/>
        <Route path='/debate-space'element={
          <ProtectRoute>
            {/* <ChatRoom/> */}
            <NewDebate/>
          </ProtectRoute>
        }/>
        
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
