export enum Feature {
    BREAKFAST = 0,
    PRIVATE_PARKING = 1,
    FREE_WIFI = 2,
    PET_FRIENDLY = 3,
    FITNESS_CENTER = 4
}

export interface Vacation {
    id: string
    name: string
    description: string
    location: string
    price: number
    quantity: number
    created_at: number
    features: Feature[]
}

export interface PagesResponse {
    limit: number
    pages: number
}

export interface VacationsResponse {
    items: Vacation[]
    limit: number
    pages: number
}

export const EMPTY_VACATIONS_RESPONSE = {
    items: [

    ],
    limit: 0,
    pages: 0
}