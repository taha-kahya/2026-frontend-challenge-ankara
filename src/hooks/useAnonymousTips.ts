import { useQuery } from '@tanstack/react-query'
import { fetchAnonymousTips } from '../data'

export function useAnonymousTips() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['anonymousTips'],
    queryFn: fetchAnonymousTips,
    staleTime: 1000 * 60 * 5,
  })

  return {
    tips: data ?? [],
    isLoading,
    isError,
    error,
    isEmpty: !isLoading && !isError && (data?.length ?? 0) === 0,
  }
}
