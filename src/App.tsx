import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import AssetsPage from './pages/AssetsPage'
import IncomesPage from './pages/IncomesPage'
import ExpensesPage from './pages/ExpensesPage'

function Protected({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Protected><Navigate to="/summary" replace /></Protected>} />
          <Route path="/summary"      element={<Protected><div>Summary (coming soon)</div></Protected>} />
          <Route path="/assets"       element={<Protected><AssetsPage /></Protected>} />
          <Route path="/incomes"      element={<Protected><IncomesPage /></Protected>} />
          <Route path="/expenses"     element={<Protected><ExpensesPage /></Protected>} />
          <Route path="/subscription" element={<Protected><div>Subscription (coming soon)</div></Protected>} />
          <Route path="/profile"      element={<Protected><div>Profile (coming soon)</div></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
