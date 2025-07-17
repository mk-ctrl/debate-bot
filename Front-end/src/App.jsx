import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Signup from './pages/Signup'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ChatContainer from './pages/ChatContainer'
import Login from './pages/Login'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/chat'element={<ChatContainer/>} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
