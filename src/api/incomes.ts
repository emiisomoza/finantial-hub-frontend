import client from './client'
import type { IncomeResponse, CreateIncomeRequest, UpdateIncomeRequest } from '../types/api'

export const getIncomes = (userId: string) =>
  client.get<IncomeResponse[]>('/api/v1/incomes', { params: { userId } }).then((r) => r.data)

export const createIncome = (data: CreateIncomeRequest) =>
  client.post<IncomeResponse>('/api/v1/incomes', data).then((r) => r.data)

export const updateIncome = (id: string, data: UpdateIncomeRequest) =>
  client.put<IncomeResponse>(`/api/v1/incomes/${id}`, data).then((r) => r.data)

export const deleteIncome = (id: string) =>
  client.delete(`/api/v1/incomes/${id}`)
