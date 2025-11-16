import useSWR from 'swr'
import { authenticatedFetch } from '@/lib/auth'

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

const fetcher = async (url: string) => {
  const res = await authenticatedFetch(url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  const json = await res.json().catch(() => null)
  // normalize common shapes
  return json?.data || json?.user || json
}

export function useCurrentUser() {
  const { data, error, isLoading, mutate } = useSWR(`${apiBase}/auth/me`, fetcher, {
    revalidateOnFocus: false,
  })
  return { user: data, isLoading, error, mutate }
}

export function useUserProfile(handle?: string) {
  const key = handle ? `${apiBase}/user/by-username/${encodeURIComponent(handle)}` : null
  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
  })
  return { profile: data, isLoading, error, mutate }
}
