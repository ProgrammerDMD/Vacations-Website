"use server";
import { Product } from "@/app/api/CheckoutController";
import { EMPTY_VACATIONS_RESPONSE, PagesResponse, Vacation, VacationsResponse } from "../types/types";

export async function getVacationsByProducts(products: Product[]) : Promise<Vacation[]> {
    if (products.length == 0) return [];

    const vacations: Vacation[] = [];
    for (let product of products) {
        // Bottleneck as it's not in parallel, but I am time constrained.
        const vacationRequest = await fetch(`http://localhost:3001/vacation/${product.id}`, {
            method: "GET"
        });
        const vacation: Vacation = await vacationRequest.json();
        vacations.push(vacation);
    }

    return vacations;
}

export async function getVacationById(id: string) : Promise<Vacation | undefined> {
    if (!id) return;

    const vacationRequest = await fetch(`http://localhost:3001/vacation/${id}`, {
        method: "GET"
    });

    if (!vacationRequest.ok) return;
    const vacation: Vacation = await vacationRequest.json();

    return vacation;
}

export async function getVacationsByQuery(query: string, page: number, limit: number) : Promise<VacationsResponse> {
    if (page < 0 || limit <= 0) return EMPTY_VACATIONS_RESPONSE;

    const vacationsRequest = await fetch(`http://localhost:3001/vacations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            limit: limit,
            query: query,
            page: page
        })
    });

    if (!vacationsRequest.ok) return EMPTY_VACATIONS_RESPONSE;
    const vacations: Vacation[] = await vacationsRequest.json();

    const pagesRequest = await fetch(`http://localhost:3001/vacations/pages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            limit: limit,
            query: query
        })
    });

    if (!pagesRequest) return EMPTY_VACATIONS_RESPONSE;
    const pagesResponse: PagesResponse = await pagesRequest.json();
    
    return {
        items: vacations,
        ...pagesResponse
    }
}

export async function getVacations(page: number, limit: number) : Promise<VacationsResponse> {
    if (page < 0 || limit <= 0) return EMPTY_VACATIONS_RESPONSE;

    const vacationsRequest = await fetch(`http://localhost:3001/vacations?limit=${limit}&page=${page}`, {
        method: "GET"
    });

    if (!vacationsRequest.ok) return EMPTY_VACATIONS_RESPONSE;
    const vacations: Vacation[] = await vacationsRequest.json();

    const pagesRequest = await fetch(`http://localhost:3001/vacations/pages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            limit: limit
        })
    });

    if (!pagesRequest) return EMPTY_VACATIONS_RESPONSE;
    const pagesResponse: PagesResponse = await pagesRequest.json();
    
    return {
        items: vacations,
        ...pagesResponse
    }
}