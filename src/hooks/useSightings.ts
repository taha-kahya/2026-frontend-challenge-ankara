import { useQuery } from '@tanstack/react-query'
import { fetchSightings } from '../data'

export function useSightings() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['sightings'],
    queryFn: fetchSightings,
    staleTime: 1000 * 60 * 5,
  })

  return {
    sightings: data ?? [],
    isLoading,
    isError,
    error,
    isEmpty: !isLoading && !isError && (data?.length ?? 0) === 0,
  }
}
