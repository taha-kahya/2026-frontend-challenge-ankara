import { useQuery } from '@tanstack/react-query'
import { fetchCheckins } from '../data'

export function useCheckins() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['checkins'],
    queryFn: fetchCheckins,
    staleTime: 1000 * 60 * 5,
  })

  return {
    checkins: data ?? [],
    isLoading,
    isError,
    error,
    isEmpty: !isLoading && !isError && (data?.length ?? 0) === 0,
  }
}
