import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Alerts from './pages/Alerts'
import Portfolio from './pages/Portfolio'

function ProtectedRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true'
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/alerts"     element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
        <Route path="/portfolio"  element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
