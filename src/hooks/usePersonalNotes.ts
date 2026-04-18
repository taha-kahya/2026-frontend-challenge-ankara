import { useQuery } from '@tanstack/react-query'
import { fetchPersonalNotes } from '../data'

export function usePersonalNotes() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['personalNotes'],
    queryFn: fetchPersonalNotes,
    staleTime: 1000 * 60 * 5,
  })

  return {
    notes: data ?? [],
    isLoading,
    isError,
    error,
    isEmpty: !isLoading && !isError && (data?.length ?? 0) === 0,
  }
}
