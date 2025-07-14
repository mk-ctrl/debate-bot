import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL:"http://localhost:4476",
    // withCredentials:true 
    // sends cookies and auth headers
})