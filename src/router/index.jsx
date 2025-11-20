import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from '../App'
import AdminLayout from '../layouts/AdminLayout'
import StudentLayout from '../layouts/StudentLayout'
import AdminLogin from '../pages/admin/AdminLogin'
import AdminDashboard from '../pages/admin/AdminDashboard'
import CreateQuiz from '../pages/admin/CreateQuiz'
import Monitor from '../pages/admin/Monitor'
import Join from '../pages/student/Join'
import Quiz from '../pages/student/Quiz'
import Result from '../pages/student/Result'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminLogin /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'create', element: <CreateQuiz /> },
      { path: 'monitor', element: <Monitor /> },
    ],
  },
  {
    path: '/student',
    element: <StudentLayout />,
    children: [
      { index: true, element: <Join /> },
      { path: 'quiz/:code', element: <Quiz /> },
      { path: 'result', element: <Result /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
