export interface Trip {
  id: string
  price: number
  isAdvertisement: boolean
  lat: number
  lng: number
  tripType: 'international' | 'local'
  status: 'active' | 'inactive'
  images: string[]
  startDate: string
  endDate: string
  companyName: { en: string; ar: string } | null
  companyRating: number | null
  countryName: { en: string; ar: string } | null
  location: string
  rating: number
  name: { en: string; ar: string }
  description: { en: string; ar: string }
}

export interface TripsResponse {
  success: boolean
  message: string
  data: {
    data: Trip[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

export type TripPayload = Omit<Trip, 'id'>
