import client from './client'
import type { LoginRequest, LoginResponse, RegisterRequest, UserResponse } from '../types/api'

export const login = (data: LoginRequest) =>
  client.post<LoginResponse>('/api/v1/auth/login', data).then((r) => r.data)

export const register = (data: RegisterRequest) =>
  client.post<UserResponse>('/api/v1/users', data).then((r) => r.data)
