import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin(){
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@university.edu')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      nav('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white border rounded-xl p-6 shadow-sm mt-12">
      <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full border rounded px-3 py-2"/>
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Password</label>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full border rounded px-3 py-2"/>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded py-2">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
