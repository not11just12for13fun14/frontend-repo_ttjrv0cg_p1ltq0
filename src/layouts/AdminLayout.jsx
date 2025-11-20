import React from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()

  const onLogout = () => {
    logout()
    nav('/admin')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/admin/dashboard" className="font-semibold text-slate-800">UniQuiz Admin</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/admin/dashboard" className={linkCls(loc.pathname.includes('/dashboard'))}>Dashboard</Link>
            <Link to="/admin/create" className={linkCls(loc.pathname.includes('/create'))}>Create Quiz</Link>
            <Link to="/admin/monitor" className={linkCls(loc.pathname.includes('/monitor'))}>Monitor</Link>
            {user ? (
              <button onClick={onLogout} className="bg-slate-800 text-white px-3 py-1.5 rounded">Logout</button>
            ) : (
              <Link to="/admin" className="bg-blue-600 text-white px-3 py-1.5 rounded">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}

function linkCls(active){
  return `px-2 py-1 rounded ${active ? 'text-blue-600 font-medium' : 'text-slate-600 hover:text-slate-900'}`
}
