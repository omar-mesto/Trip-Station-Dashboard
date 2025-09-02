// companyModel.ts
export interface Company {
  id: string
  name: {
    en: string
    ar: string
  }
  rating: number
  contact: {
    whatsapp: string
    facebook: string
    website: string
    instagram: string
  }
}

export interface CompaniesResponse {
  success: boolean
  message: string
  data: {
    data: Company[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

export type CompanyPayload = Omit<Company, 'id'>
