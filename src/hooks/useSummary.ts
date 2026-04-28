import { useState, useEffect, useCallback } from 'react'
import { getSummary } from '../api/summary'
import type { SummaryResponse } from '../types/api'

export function useSummary(userId: string, currency: string) {
  const [summary, setSummary] = useState<SummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      setSummary(await getSummary(userId, currency))
    } catch {
      setError('Failed to load summary.')
    } finally {
      setLoading(false)
    }
  }, [userId, currency])

  useEffect(() => { load() }, [load])

  return { summary, loading, error }
}
