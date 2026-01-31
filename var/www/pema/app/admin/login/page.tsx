'use client'

import { PemaInstance, ADMIN_TOKEN_KEY } from '@/api/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await PemaInstance.post<{ token: string; email: string }>('admin/login', {
        email: email.trim(),
        password,
      })
      sessionStorage.setItem(ADMIN_TOKEN_KEY, res.data.token)
      router.replace('/admin')
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { detail?: string | string[] } }; message?: string }
      const status = e?.response?.status
      const detail = e?.response?.data?.detail
      let msg: string
      if (typeof detail === 'string' && detail) msg = detail
      else if (Array.isArray(detail) && detail.length > 0 && typeof detail[0] === 'string') msg = detail[0]
      else if (status === 401) msg = 'You are not an authorised admin user. Only admin users can sign in here.'
      else if (e?.message && !e.message.startsWith('Request failed with status code')) msg = e.message
      else msg = 'Sign in failed. Please check your email and password and try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-softSand/30 px-4">
      <div className="w-full max-w-sm rounded-xl border border-[#3233331A] bg-white p-6 shadow-lg">
        <div className="mb-2 flex items-center gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 font-crimson text-xs text-amber-800">
          <span aria-hidden>🔒</span>
          <span>Restricted to authorised administrators only.</span>
        </div>
        <h1 className="font-ivyOra text-xl text-pemaBlue mb-1">Admin sign in</h1>
        <p className="font-crimson text-sm text-slateGray mb-6">Sign in to manage bookings and payments</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block font-crimson text-sm text-slateGray mb-1">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded border border-[#3233331A] px-3 py-2 font-crimson text-sm text-slateGray focus:border-pemaBlue focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block font-crimson text-sm text-slateGray mb-1">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded border border-[#3233331A] px-3 py-2 font-crimson text-sm text-slateGray focus:border-pemaBlue focus:outline-none"
            />
          </div>
          {error && (
            <p className="font-crimson text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-pemaBlue py-2.5 font-crimson text-sm text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
