import { z } from "zod";

export enum Feature {
    BREAKFAST = 0,
    PRIVATE_PARKING = 1,
    FREE_WIFI = 2,
    PET_FRIENDLY = 3,
    FITNESS_CENTER = 4
}

export interface Coupon {
    code: string
    product_id: string
    amount: number
    starts_at: number
    expires_at: number
}

export interface Discount {
    id: string
    product_id: string
    amount: number
    starts_at: number
    expires_at: number
}

export enum DiscountType {
    NONE, LIMITED, NORMAL
}

export enum LoyaltyType {
    NONE = "none", NORMAL = "normal"
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

export const LoginSchema = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters."
    }).max(16, {
        message: "Username must be at most 16 characters."
    }).regex(/^[0-9A-Za-z]{3,16}$/, {
        message: "Invalid characters used in the username."
    }),
    password: z.string().min(3, {
        message: "Password must be at least 3 characters."
    }).max(21, {
        message: "Password must be at most 21 characters."
    })
})

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters."
    }).max(16, {
        message: "Username must be at most 16 characters."
    }).regex(/^[0-9A-Za-z]{3,16}$/, {
        message: "Invalid characters used in the username."
    }),
    name: z.string().min(3, {
        message: "Name must be at least 3 characters."
    }).max(20, {
        message: "Name must be at most 20 characters."
    }),
    password: z.string().min(3, {
        message: "Password must be at least 3 characters."
    }).max(21, {
        message: "Password must be at most 21 characters."
    })
})

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;