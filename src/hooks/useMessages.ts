import { useQuery } from '@tanstack/react-query'
import { fetchMessages } from '../data'

export function useMessages() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    staleTime: 1000 * 60 * 5,
  })

  return {
    messages: data ?? [],
    isLoading,
    isError,
    error,
    isEmpty: !isLoading && !isError && (data?.length ?? 0) === 0,
  }
}
