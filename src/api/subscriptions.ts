import client from './client'
import type { SubscriptionResponse, CreateSubscriptionRequest, UpdateSubscriptionRequest } from '../types/api'

export const getSubscription = (userId: string) =>
  client.get<SubscriptionResponse>(`/api/v1/summary-subscriptions/user/${userId}`).then((r) => r.data)

export const createSubscription = (data: CreateSubscriptionRequest) =>
  client.post<SubscriptionResponse>('/api/v1/summary-subscriptions', data).then((r) => r.data)

export const updateSubscription = (id: string, data: UpdateSubscriptionRequest) =>
  client.put<SubscriptionResponse>(`/api/v1/summary-subscriptions/${id}`, data).then((r) => r.data)

export const deleteSubscription = (id: string) =>
  client.delete(`/api/v1/summary-subscriptions/${id}`)
