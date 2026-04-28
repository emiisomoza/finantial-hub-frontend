import { useState, useEffect, useCallback } from 'react'
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../api/expenses'
import type { ExpenseResponse, CreateExpenseRequest, UpdateExpenseRequest } from '../types/api'

export function useExpenses(userId: string) {
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setExpenses(await getExpenses(userId))
    } catch {
      setError('Failed to load expenses.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { load() }, [load])

  async function add(data: CreateExpenseRequest) {
    const expense = await createExpense(data)
    setExpenses((prev) => [...prev, expense])
  }

  async function update(id: string, data: UpdateExpenseRequest) {
    const expense = await updateExpense(id, data)
    setExpenses((prev) => prev.map((e) => (e.id === id ? expense : e)))
  }

  async function remove(id: string) {
    await deleteExpense(id)
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  return { expenses, loading, error, add, update, remove }
}
