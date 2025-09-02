export interface CountriesResponse {
  success: boolean;
  message: string;
  data: {
    data: Country[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface Country {
  id: string
  name: {
    en: string
    ar: string
  }
  tripType: string
  images: string[]
}

export type CountryPayload = Omit<Country, 'id'>
