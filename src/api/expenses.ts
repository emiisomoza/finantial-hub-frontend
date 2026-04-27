import client from './client'
import type { ExpenseResponse, CreateExpenseRequest, UpdateExpenseRequest } from '../types/api'

export const getExpenses = (userId: string) =>
  client.get<ExpenseResponse[]>('/api/v1/expenses', { params: { userId } }).then((r) => r.data)

export const createExpense = (data: CreateExpenseRequest) =>
  client.post<ExpenseResponse>('/api/v1/expenses', data).then((r) => r.data)

export const updateExpense = (id: string, data: UpdateExpenseRequest) =>
  client.put<ExpenseResponse>(`/api/v1/expenses/${id}`, data).then((r) => r.data)

export const deleteExpense = (id: string) =>
  client.delete(`/api/v1/expenses/${id}`)
