import axios from 'axios'

export const ADMIN_TOKEN_KEY = 'pema_admin_token'

export const PemaInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach admin JWT for admin API calls (except login)
PemaInstance.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config
  const url = config.url ?? ''
  if (url.includes('admin/') && !url.includes('admin/login')) {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY)
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401 for admin routes, clear token so UI can redirect to login
PemaInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== 'undefined' && err?.config?.url?.includes('admin/') && !err?.config?.url?.includes('admin/login') && err?.response?.status === 401) {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY)
    }
    return Promise.reject(err)
  }
)
