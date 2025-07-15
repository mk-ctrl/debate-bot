import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Signup from './pages/Signup'
import ChatContainer from './pages/ChatContainer'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path='/chat'element={<ChatContainer/>} />
      </Routes>
    </div>
  )
}

export default App
