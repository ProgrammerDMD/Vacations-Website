"use server";
import { EMPTY_VACATIONS_RESPONSE, PagesResponse, Vacation, VacationsResponse } from "../types/types";

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