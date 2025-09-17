import { useAPI } from '@@/services/baseApi'
import type { TripPayload, TripsResponse } from '~/models/tripModel'

export const useTrips = (page: Ref<number>, limit: Ref<number>) => {
  return useAPI<TripsResponse>({
    url: () => `/trip?page=${page.value}&limit=${limit.value}`,
    type: 'GET',
    queryKey: 'trip',
    isLazy: true,
  })
}

export const useDeleteTrip = (id: string) => {
  return useAPI({
    url: `/trip/${id}`,
    type: 'DELETE',
    queryKey: 'trip',
    isLazy: true,
  })
}

export const useCreateTrip = (trip: TripPayload | FormData) => {
  return useAPI({
    url: '/trip',
    payload: trip,
    queryKey: 'trip',
    type: 'POST',
  })
}

export const useUpdateTrip = (id: string, trip: TripPayload | FormData) => {
  return useAPI({
    url: `/trip/${id}`,
    payload: trip,
    queryKey: 'trip',
    type: 'PUT',
  })
}
