import client from './client'
import type { SummaryResponse } from '../types/api'

export const getSummary = (userId: string, currency: string) =>
  client.get<SummaryResponse>(`/api/v1/summary/${userId}`, { params: { currency } }).then((r) => r.data)
