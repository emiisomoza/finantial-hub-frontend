import { useState, useEffect, useCallback } from 'react'
import { getAssets, createAsset, updateAsset, deleteAsset } from '../api/assets'
import type { AssetResponse, CreateAssetRequest, UpdateAssetRequest } from '../types/api'

export function useAssets(userId: string) {
  const [assets, setAssets] = useState<AssetResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setAssets(await getAssets(userId))
    } catch {
      setError('Failed to load assets.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { load() }, [load])

  async function add(data: CreateAssetRequest) {
    const asset = await createAsset(data)
    setAssets((prev) => [...prev, asset])
  }

  async function update(id: string, data: UpdateAssetRequest) {
    const asset = await updateAsset(id, data)
    setAssets((prev) => prev.map((a) => (a.id === id ? asset : a)))
  }

  async function remove(id: string) {
    await deleteAsset(id)
    setAssets((prev) => prev.filter((a) => a.id !== id))
  }

  return { assets, loading, error, add, update, remove }
}
