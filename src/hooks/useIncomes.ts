import { useState, useEffect, useCallback } from 'react'
import { getIncomes, createIncome, updateIncome, deleteIncome } from '../api/incomes'
import type { IncomeResponse, CreateIncomeRequest, UpdateIncomeRequest } from '../types/api'

export function useIncomes(userId: string) {
  const [incomes, setIncomes] = useState<IncomeResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setIncomes(await getIncomes(userId))
    } catch {
      setError('Failed to load incomes.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { load() }, [load])

  async function add(data: CreateIncomeRequest) {
    const income = await createIncome(data)
    setIncomes((prev) => [...prev, income])
  }

  async function update(id: string, data: UpdateIncomeRequest) {
    const income = await updateIncome(id, data)
    setIncomes((prev) => prev.map((i) => (i.id === id ? income : i)))
  }

  async function remove(id: string) {
    await deleteIncome(id)
    setIncomes((prev) => prev.filter((i) => i.id !== id))
  }

  return { incomes, loading, error, add, update, remove }
}
