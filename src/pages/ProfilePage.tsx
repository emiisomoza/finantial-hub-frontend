import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getUser, updateUser, changePassword } from '../api/users'
import type { UserResponse } from '../types/api'

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { userId } = useAuth()

  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Profile form
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [profileSubmitting, setProfileSubmitting] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null)

  // Password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const u = await getUser(userId!)
      setUser(u)
      setFullName(u.fullName)
      setEmail(u.email)
    } catch {
      setLoadError('Failed to load profile.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { load() }, [load])

  async function handleProfileSave() {
    setProfileSubmitting(true)
    setProfileMsg(null)
    try {
      const updated = await updateUser(userId!, { email, fullName })
      setUser(updated)
      setProfileMsg({ ok: true, text: 'Profile updated!' })
    } catch {
      setProfileMsg({ ok: false, text: 'Failed to update profile.' })
    } finally {
      setProfileSubmitting(false)
    }
  }

  async function handlePasswordChange() {
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ ok: false, text: 'New passwords do not match.' })
      return
    }
    setPasswordSubmitting(true)
    setPasswordMsg(null)
    try {
      await changePassword(userId!, { currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordMsg({ ok: true, text: 'Password changed successfully!' })
    } catch {
      setPasswordMsg({ ok: false, text: 'Failed to change password. Check your current password.' })
    } finally {
      setPasswordSubmitting(false)
    }
  }

  const inputCls = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent'

  const field = (label: string, el: React.ReactNode) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      {el}
    </div>
  )

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>
  if (loadError) return <p className="text-red-500 text-sm">{loadError}</p>
  if (!user) return null

  return (
    <>
      <h1 className="text-xl font-bold text-gray-800 mb-8">Profile</h1>

      <div className="flex flex-col gap-6 max-w-md">

        {/* Profile info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
          <p className="text-sm font-semibold text-gray-700">Personal information</p>

          {field('Full name', (
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
          ))}

          {field('Email', (
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          ))}

          <div className="flex items-center justify-between pt-2">
            {profileMsg && (
              <p className={`text-xs ${profileMsg.ok ? 'text-green' : 'text-red-500'}`}>{profileMsg.text}</p>
            )}
            <button
              onClick={handleProfileSave}
              disabled={profileSubmitting}
              className="ml-auto bg-navy text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-teal transition-colors disabled:opacity-60"
            >
              {profileSubmitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
          <p className="text-sm font-semibold text-gray-700">Change password</p>

          {field('Current password', (
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputCls} />
          ))}

          {field('New password', (
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} />
          ))}

          {field('Confirm new password', (
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} />
          ))}

          <div className="flex items-center justify-between pt-2">
            {passwordMsg && (
              <p className={`text-xs ${passwordMsg.ok ? 'text-green' : 'text-red-500'}`}>{passwordMsg.text}</p>
            )}
            <button
              onClick={handlePasswordChange}
              disabled={passwordSubmitting}
              className="ml-auto bg-navy text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-teal transition-colors disabled:opacity-60"
            >
              {passwordSubmitting ? 'Changing…' : 'Change password'}
            </button>
          </div>
        </div>

        {/* Account info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-700 mb-1">Account</p>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Role</span>
            <span className="text-gray-700 font-medium">{user.role}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Member since</span>
            <span className="text-gray-700">
              {new Date(user.createdAt).toLocaleDateString('en-AU', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </span>
          </div>
        </div>

      </div>
    </>
  )
}
