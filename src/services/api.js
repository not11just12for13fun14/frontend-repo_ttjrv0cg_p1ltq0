import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
})

api.interceptors.request.use((config)=>{
  const token = localStorage.getItem('token')
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res)=>res,
  (error)=>{
    const msg = error?.response?.data?.detail || error.message
    return Promise.reject(new Error(msg))
  }
)

export default api
