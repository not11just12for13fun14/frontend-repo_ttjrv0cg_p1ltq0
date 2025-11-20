import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function StudentLayout(){
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold text-slate-800">UniQuiz</Link>
          <nav className="text-sm">
            <Link to="/student" className="text-slate-600 hover:text-slate-900">Join Quiz</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}
