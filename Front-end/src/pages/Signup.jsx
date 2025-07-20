import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify';
import { axiosInstance } from '../axios/axio'
import globalAuth from '../zustand/auth.zustand'
const Signup = () => {
    const [formData, setFormData] = useState({
        email:"",
        password:""
    })
    const signup = globalAuth((set)=> set.login);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            const result = await axiosInstance.post('/user/checkUser',formData);
            toast.success(result.data.message);
            await signup(result.data.email,result.data.token)
            // navigate('/')
            console.log(result.data);
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong!";
                        toast.error(errorMessage);
        }
        
    }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        
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
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account? <a href="/login" className="text-blue-600 underline">Login</a>
        </p>
      </div>
    </div>
  )
}

export default Signup
