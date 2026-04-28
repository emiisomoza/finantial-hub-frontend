import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAssets } from '../hooks/useAssets'
import Modal from '../components/ui/Modal'
import type { AssetResponse, AssetType, ValuationMode } from '../types/api'

// ── Form state ────────────────────────────────────────────────────────────────

interface FormState {
  type: AssetType
  name: string
  symbol: string
  quantity: string
  valuationMode: ValuationMode
  manualUnitValue: string
  currency: string
}

const EMPTY_FORM: FormState = {
  type: 'STOCK',
  name: '',
  symbol: '',
  quantity: '',
  valuationMode: 'MARKET_PRICE',
  manualUnitValue: '',
  currency: 'AUD',
}

function assetToForm(a: AssetResponse): FormState {
  return {
    type: a.type,
    name: a.name,
    symbol: a.symbol ?? '',
    quantity: String(a.quantity),
    valuationMode: a.valuationMode,
    manualUnitValue: a.manualUnitValue != null ? String(a.manualUnitValue) : '',
    currency: a.currency,
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function AssetCard({ asset, onEdit, onDelete }: {
  asset: AssetResponse
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-800 text-sm">{asset.name}</p>
          {asset.symbol && <p className="text-xs text-gray-400 mt-0.5">{asset.symbol}</p>}
        </div>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0">
          {asset.type.replace('_', ' ')}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Qty</span>
        <span className="font-medium text-gray-700">{asset.quantity}</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Valuation</span>
        <span className="font-medium text-gray-700">
          {asset.valuationMode === 'MANUAL'
            ? `${asset.currency} ${asset.manualUnitValue}`
            : 'Market price'}
        </span>
      </div>

      <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-50 transition-colors"
          title="Edit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-colors"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
      <span className="text-sm font-medium">Add asset</span>
    </button>
  )
}

function AssetForm({ form, onChange, onSubmit, onCancel, submitting }: {
  form: FormState
  onChange: (f: FormState) => void
  onSubmit: () => void
  onCancel: () => void
  submitting: boolean
}) {
  const field = (label: string, el: React.ReactNode) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      {el}
    </div>
  )

  const input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
    />
  )

  const select = (props: React.SelectHTMLAttributes<HTMLSelectElement>, children: React.ReactNode) => (
    <select
      {...props}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent bg-white"
    >
      {children}
    </select>
  )

  return (
    <div className="flex flex-col gap-4">
      {field('Type', select(
        { value: form.type, onChange: (e) => onChange({ ...form, type: e.target.value as AssetType }) },
        <>
          <option value="STOCK">Stock</option>
          <option value="CRYPTO">Crypto</option>
          <option value="REAL_ESTATE">Real Estate</option>
          <option value="CASH">Cash</option>
          <option value="OTHER">Other</option>
        </>
      ))}

      {field('Name', input({
        type: 'text', required: true, placeholder: 'e.g. Apple Inc.',
        value: form.name, onChange: (e) => onChange({ ...form, name: e.target.value }),
      }))}

      {field('Symbol (optional)', input({
        type: 'text', placeholder: 'e.g. AAPL',
        value: form.symbol, onChange: (e) => onChange({ ...form, symbol: e.target.value }),
      }))}

      {field('Quantity', input({
        type: 'number', required: true, min: 0, step: 'any', placeholder: '0',
        value: form.quantity, onChange: (e) => onChange({ ...form, quantity: e.target.value }),
      }))}

      {field('Valuation', select(
        { value: form.valuationMode, onChange: (e) => onChange({ ...form, valuationMode: e.target.value as ValuationMode }) },
        <>
          <option value="MARKET_PRICE">Market price</option>
          <option value="MANUAL">Manual</option>
        </>
      ))}

      {form.valuationMode === 'MANUAL' && field('Unit value', input({
        type: 'number', required: true, min: 0, step: 'any', placeholder: '0.00',
        value: form.manualUnitValue, onChange: (e) => onChange({ ...form, manualUnitValue: e.target.value }),
      }))}

      {field('Currency', input({
        type: 'text', required: true, maxLength: 3, placeholder: 'AUD',
        value: form.currency,
        onChange: (e) => onChange({ ...form, currency: e.target.value.toUpperCase() }),
      }))}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-600 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 bg-navy text-white rounded-lg py-2 text-sm font-medium hover:bg-teal transition-colors disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AssetsPage() {
  const { userId } = useAuth()
  const { assets, loading, error, add, update, remove } = useAssets(userId!)

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<AssetResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  function openEdit(asset: AssetResponse) {
    setEditingId(asset.id)
    setForm(assetToForm(asset))
    setShowForm(true)
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const payload = {
        type: form.type,
        name: form.name,
        symbol: form.symbol || undefined,
        quantity: Number(form.quantity),
        valuationMode: form.valuationMode,
        manualUnitValue: form.valuationMode === 'MANUAL' ? Number(form.manualUnitValue) : undefined,
        currency: form.currency,
      }
      if (editingId) {
        await update(editingId, payload)
      } else {
        await add(payload)
      }
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
      <h1 className="text-xl font-bold text-gray-800 mb-6">Assets</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {assets.map((a) => (
          <AssetCard
            key={a.id}
            asset={a}
            onEdit={() => openEdit(a)}
            onDelete={() => setDeleteTarget(a)}
          />
        ))}
        <AddCard onClick={openAdd} />
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingId ? 'Edit asset' : 'Add asset'}
      >
        <AssetForm
          form={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          submitting={submitting}
        />
      </Modal>

      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete asset"
      >
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteTarget(null)}
            className="flex-1 border border-gray-300 text-gray-600 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  )
}
