import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getSubscription, createSubscription, updateSubscription, deleteSubscription } from '../api/subscriptions'
import type { SubscriptionResponse, SubscriptionFrequency } from '../types/api'

const CURRENCIES = ['AUD', 'USD', 'EUR', 'GBP', 'JPY']

const FREQUENCY_LABELS: Record<SubscriptionFrequency, string> = {
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
}

const FREQUENCY_DESC: Record<SubscriptionFrequency, string> = {
  WEEKLY:  'Receive a summary email every week',
  MONTHLY: 'Receive a summary email every month',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SubscriptionPage() {
  const { userId } = useAuth()

  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saved, setSaved] = useState(false)

  const [frequency, setFrequency] = useState<SubscriptionFrequency>('MONTHLY')
  const [currency, setCurrency] = useState('AUD')

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const sub = await getSubscription(userId!)
      setSubscription(sub)
      setFrequency(sub.frequency)
      setCurrency(sub.currency)
    } catch (e: unknown) {
      // 404 means no subscription yet — that's fine
      const status = (e as { response?: { status?: number } }).response?.status
      if (status !== 404) setError('Failed to load subscription.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { load() }, [load])

  async function handleSave() {
    setSubmitting(true)
    setSaved(false)
    try {
      const payload = { frequency, currency }
      const result = subscription
        ? await updateSubscription(subscription.id, payload)
        : await createSubscription({ ...payload, userId: userId! })
      setSubscription(result)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save subscription.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!subscription) return
    setDeleting(true)
    try {
      await deleteSubscription(subscription.id)
      setSubscription(null)
      setFrequency('MONTHLY')
      setCurrency('AUD')
    } catch {
      setError('Failed to remove subscription.')
    } finally {
      setDeleting(false)
    }
  }

  const cls = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent bg-white'

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>

  return (
    <>
      <h1 className="text-xl font-bold text-gray-800 mb-2">Email subscription</h1>
      <p className="text-sm text-gray-500 mb-8">
        Configure how often you receive your financial summary by email.
      </p>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm max-w-md flex flex-col gap-6">

        {/* Frequency */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-gray-600">Frequency</p>
          <div className="flex flex-col gap-2">
            {(['WEEKLY', 'MONTHLY'] as SubscriptionFrequency[]).map((f) => (
              <label key={f} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                frequency === f ? 'border-teal bg-teal/5' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="frequency"
                  value={f}
                  checked={frequency === f}
                  onChange={() => setFrequency(f)}
                  className="mt-0.5 accent-teal"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{FREQUENCY_LABELS[f]}</p>
                  <p className="text-xs text-gray-400">{FREQUENCY_DESC[f]}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Currency */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={cls}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <p className="text-xs text-gray-400">Charts and values in the email will use this currency.</p>
        </div>

        {/* Next send */}
        {subscription && (
          <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
            <span className="text-gray-500">Next email</span>
            <span className="font-medium text-gray-700">
              {new Date(subscription.nextSendAt).toLocaleDateString('en-AU', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {subscription && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="border border-red-300 text-red-500 rounded-lg py-2 px-4 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-60"
            >
              {deleting ? 'Removing…' : 'Unsubscribe'}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={submitting}
            className="flex-1 bg-navy text-white rounded-lg py-2 text-sm font-medium hover:bg-teal transition-colors disabled:opacity-60"
          >
            {submitting ? 'Saving…' : subscription ? 'Update' : 'Subscribe'}
          </button>
        </div>

        {saved && (
          <p className="text-xs text-green text-center -mt-2">Subscription saved!</p>
        )}
      </div>
    </>
  )
}
