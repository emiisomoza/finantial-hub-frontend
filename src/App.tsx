import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><Navigate to="/summary" replace /></ProtectedRoute>} />
          <Route path="/assets" element={<ProtectedRoute><div>Assets (coming soon)</div></ProtectedRoute>} />
          <Route path="/incomes" element={<ProtectedRoute><div>Incomes (coming soon)</div></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><div>Expenses (coming soon)</div></ProtectedRoute>} />
          <Route path="/summary" element={<ProtectedRoute><div>Summary (coming soon)</div></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><div>Subscription (coming soon)</div></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><div>Profile (coming soon)</div></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
