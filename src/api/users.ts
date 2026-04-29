import client from './client'
import type { UserResponse } from '../types/api'

export const getUser = (id: string) =>
  client.get<UserResponse>(`/api/v1/users/${id}`).then((r) => r.data)

export const updateUser = (id: string, data: { email: string; fullName: string }) =>
  client.put<UserResponse>(`/api/v1/users/${id}`, data).then((r) => r.data)

export const changePassword = (id: string, data: { currentPassword: string; newPassword: string }) =>
  client.patch<void>(`/api/v1/users/${id}/password`, data)
