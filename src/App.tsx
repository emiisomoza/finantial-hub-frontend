import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/summary" replace />} />
        <Route path="/login" element={<div>Login (coming soon)</div>} />
        <Route path="/assets" element={<div>Assets (coming soon)</div>} />
        <Route path="/incomes" element={<div>Incomes (coming soon)</div>} />
        <Route path="/expenses" element={<div>Expenses (coming soon)</div>} />
        <Route path="/summary" element={<div>Summary (coming soon)</div>} />
        <Route path="/subscription" element={<div>Subscription (coming soon)</div>} />
        <Route path="/profile" element={<div>Profile (coming soon)</div>} />
      </Routes>
    </BrowserRouter>
  )
}
