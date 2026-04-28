import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useExpenses } from '../hooks/useExpenses'
import Modal from '../components/ui/Modal'
import type { ExpenseResponse, ExpenseCategory, ExpenseFrequency } from '../types/api'

// ── Form state ────────────────────────────────────────────────────────────────

interface FormState {
  category: ExpenseCategory
  description: string
  frequency: ExpenseFrequency
  amount: string
  currency: string
  startsAt: string
  endsAt: string
}

const EMPTY_FORM: FormState = {
  category: 'RENT',
  description: '',
  frequency: 'MONTHLY',
  amount: '',
  currency: 'AUD',
  startsAt: '',
  endsAt: '',
}

function expenseToForm(e: ExpenseResponse): FormState {
  return {
    category: e.category,
    description: e.description,
    frequency: e.frequency,
    amount: String(e.amount),
    currency: e.currency,
    startsAt: e.startsAt,
    endsAt: e.endsAt ?? '',
  }
}

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  RENT: 'Rent', MORTGAGE: 'Mortgage', GROCERIES: 'Groceries', UTILITIES: 'Utilities',
  TRANSPORT: 'Transport', INSURANCE: 'Insurance', HEALTH: 'Health',
  ENTERTAINMENT: 'Entertainment', EDUCATION: 'Education',
  SUBSCRIPTIONS: 'Subscriptions', TAX: 'Tax', OTHER: 'Other',
}

const FREQUENCY_LABELS: Record<ExpenseFrequency, string> = {
  MONTHLY: 'Monthly', WEEKLY: 'Weekly', FORTNIGHTLY: 'Fortnightly',
  YEARLY: 'Yearly', ONE_TIME: 'One-time',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ExpenseCard({ expense, onEdit, onDelete }: {
  expense: ExpenseResponse
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-800 text-sm">{expense.description}</p>
          <p className="text-xs text-gray-400 mt-0.5">{CATEGORY_LABELS[expense.category]}</p>
        </div>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0">
          {FREQUENCY_LABELS[expense.frequency]}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Amount</span>
        <span className="font-semibold text-red-500">
          {expense.currency} {Number(expense.amount).toLocaleString()}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">From</span>
        <span className="text-gray-700">{expense.startsAt}</span>
      </div>

      <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
        <button onClick={onEdit} className="p-1.5 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-50 transition-colors" title="Edit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-colors" title="Delete">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function AddCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-4 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-teal hover:text-teal transition-colors min-h-[160px]"
    >
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
      <span className="text-sm font-medium">Add expense</span>
    </button>
  )
}

function ExpenseForm({ form, onChange, onSubmit, onCancel, submitting }: {
  form: FormState
  onChange: (f: FormState) => void
  onSubmit: () => void
  onCancel: () => void
  submitting: boolean
}) {
  const cls = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent'

  const field = (label: string, el: React.ReactNode) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      {el}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      {field('Category', (
        <select value={form.category} onChange={(e) => onChange({ ...form, category: e.target.value as ExpenseCategory })} className={`${cls} bg-white`}>
          {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      ))}

      {field('Description', (
        <input type="text" required placeholder="e.g. Monthly rent" value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })} className={cls} />
      ))}

      {field('Frequency', (
        <select value={form.frequency} onChange={(e) => onChange({ ...form, frequency: e.target.value as ExpenseFrequency })} className={`${cls} bg-white`}>
          {Object.entries(FREQUENCY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      ))}

      {field('Amount', (
        <input type="number" required min={0} step="any" placeholder="0.00" value={form.amount}
          onChange={(e) => onChange({ ...form, amount: e.target.value })} className={cls} />
      ))}

      {field('Currency', (
        <input type="text" required maxLength={3} placeholder="AUD" value={form.currency}
          onChange={(e) => onChange({ ...form, currency: e.target.value.toUpperCase() })} className={cls} />
      ))}

      {field('Starts at', (
        <input type="date" required value={form.startsAt}
          onChange={(e) => onChange({ ...form, startsAt: e.target.value })} className={cls} />
      ))}

      {field('Ends at (optional)', (
        <input type="date" value={form.endsAt}
          onChange={(e) => onChange({ ...form, endsAt: e.target.value })} className={cls} />
      ))}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-600 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="button" onClick={onSubmit} disabled={submitting}
          className="flex-1 bg-navy text-white rounded-lg py-2 text-sm font-medium hover:bg-teal transition-colors disabled:opacity-60">
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ExpensesPage() {
  const { userId } = useAuth()
  const { expenses, loading, error, add, update, remove } = useExpenses(userId!)

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ExpenseResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function openAdd() { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true) }
  function openEdit(e: ExpenseResponse) { setEditingId(e.id); setForm(expenseToForm(e)); setShowForm(true) }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const payload = {
        category: form.category,
        description: form.description,
        frequency: form.frequency,
        amount: Number(form.amount),
        currency: form.currency,
        startsAt: form.startsAt,
        endsAt: form.endsAt || undefined,
      }
      editingId ? await update(editingId, payload) : await add(payload)
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    await remove(deleteTarget.id)
    setDeleteTarget(null)
  }

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>
  if (error)   return <p className="text-red-500 text-sm">{error}</p>

  return (
    <>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Expenses</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {expenses.map((e) => (
          <ExpenseCard key={e.id} expense={e} onEdit={() => openEdit(e)} onDelete={() => setDeleteTarget(e)} />
        ))}
        <AddCard onClick={openAdd} />
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit expense' : 'Add expense'}>
        <ExpenseForm form={form} onChange={setForm} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} submitting={submitting} />
      </Modal>

      <Modal isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Delete expense">
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete <strong>{deleteTarget?.description}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteTarget(null)}
            className="flex-1 border border-gray-300 text-gray-600 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleDelete}
            className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </Modal>
    </>
  )
}
