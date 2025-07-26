import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Signup from './pages/Signup'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectRoute from './assets/protectedRoute/protectRoute';
import CreateRoomPage from './pages/CreateRoom';
import Login from './pages/Login'
import DashboardPage from './pages/dash';
import HomePage from './pages/HomePage';
import ChatRoom from './pages/DebateRoom';
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
            <HomePage/>
          </ProtectRoute>
        }/>
        <Route path='/room-create'element={
          <ProtectRoute>
            <CreateRoomPage/>
          </ProtectRoute>
        }/>
        <Route path='/debate-space'element={
          <ProtectRoute>
            <ChatRoom/>
          </ProtectRoute>
        }/>
        
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
