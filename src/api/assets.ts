import client from './client'
import type { AssetResponse, CreateAssetRequest, UpdateAssetRequest } from '../types/api'

export const getAssets = (userId: string) =>
  client.get<AssetResponse[]>('/api/v1/assets', { params: { userId } }).then((r) => r.data)

export const createAsset = (data: CreateAssetRequest) =>
  client.post<AssetResponse>('/api/v1/assets', data).then((r) => r.data)

export const updateAsset = (id: string, data: UpdateAssetRequest) =>
  client.put<AssetResponse>(`/api/v1/assets/${id}`, data).then((r) => r.data)

export const deleteAsset = (id: string) =>
  client.delete(`/api/v1/assets/${id}`)
