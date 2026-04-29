import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useSummary } from '../hooks/useSummary'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

const CURRENCIES = ['AUD', 'USD', 'EUR', 'GBP', 'JPY']

// ── KPI card ──────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, accent }: {
  label: string
  value: string
  sub?: string
  accent?: string
}) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col gap-1 ${accent ?? ''}`}>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

// ── Savings rate ring ─────────────────────────────────────────────────────────

function SavingsRing({ rate }: { rate: number }) {
  const pct = Math.min(Math.max(rate * 100, 0), 100)
  const r = 36
  const circumference = 2 * Math.PI * r
  const dash = (pct / 100) * circumference

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col items-center gap-2">
      <p className="text-xs font-medium text-gray-500">Savings rate</p>
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="48" cy="48" r={r} fill="none"
          stroke="#67C090" strokeWidth="10"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 48 48)"
        />
        <text x="48" y="53" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1f2937">
          {pct.toFixed(1)}%
        </text>
      </svg>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SummaryPage() {
  const { userId } = useAuth()
  const [currency, setCurrency] = useState('AUD')
  const { summary, loading, error } = useSummary(userId!, currency)

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>
  if (error)   return <p className="text-red-500 text-sm">{error}</p>
  if (!summary) return null

  const barData = [
    { name: 'Income',   value: summary.monthlyIncome,   fill: '#67C090' },
    { name: 'Expenses', value: summary.monthlyExpenses,  fill: '#f87171' },
    { name: 'Savings',  value: summary.monthlySavings,   fill: '#215B63' },
  ]

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Summary</h1>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal bg-white"
        >
          {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="col-span-2 sm:col-span-3">
          <KpiCard
            label="Total assets value"
            value={`${currency} ${fmt(summary.totalAssetsValue)}`}
            sub={summary.unpricedAssetsCount > 0
              ? `${summary.unpricedAssetsCount} asset(s) without market price`
              : undefined}
          />
        </div>
        <KpiCard label="Monthly income"   value={`${currency} ${fmt(summary.monthlyIncome)}`} />
        <KpiCard label="Monthly expenses" value={`${currency} ${fmt(summary.monthlyExpenses)}`} />
        <KpiCard label="Monthly savings"  value={`${currency} ${fmt(summary.monthlySavings)}`} />
        <SavingsRing rate={summary.savingsRate} />
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <p className="text-sm font-medium text-gray-700 mb-4">Monthly breakdown ({currency})</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} barSize={48}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value) => [`${currency} ${fmt(Number(value))}`]}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Historical trend charts are sent to your email — configure frequency in the Email tab.
      </p>
    </>
  )
}
