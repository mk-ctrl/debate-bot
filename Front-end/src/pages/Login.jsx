import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import globalAuth from '../zustand/auth.zustand';
import { axiosInstance } from '../axios/axio'

const Login = () => {
    const nav = useNavigate();
    const [formData, setFormData] = useState({
        email:"",
        password:""
    })
    const login = globalAuth((set)=> set.login);
    
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            console.log(formData)
            const result = await axiosInstance.post('/user/login',formData);
            console.log(result.data.email);
            toast.success(result.data.message);
            await login(formData.email,result.data.token)
            nav('/room-join')
            console.log(result.data.message);
            console.log(result.data.token)
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong!";
            toast.error(errorMessage);
        }
        
    }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e)=> setFormData(
                prev => (
                    {...prev,[e.target.name]:e.target.value}
                )
                )}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••"
              value={formData.password}
              onChange={
                (e)=> setFormData(
                   prev => ({
                        ...prev,
                        [e.target.name]:e.target.value
                    })    
                )
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={handleSubmit}
            
          >
            Login In
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Don't have an account? <a href="/" className="text-blue-600 underline">SignUp</a>
        </p>
      </div>
    </div>
  )
}

export default Login