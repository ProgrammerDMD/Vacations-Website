import { getVacations, getVacationsByQuery } from "./api/VacationsController";
import Navbar from "./components/Navbar";
import PageNavigator from "./components/PageNavigator";
import VacationCard from "./components/VacationCard";
import { EMPTY_VACATIONS_RESPONSE, VacationsResponse } from "./types/types";

export const POSITIVE_NUMBER = /^\d*$/;

export default async function Home({ searchParams }: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { page = '0', query = '' } = await searchParams;
    const vacationsLimit = 10;

    var pageNumber = 0;
    if (page.match(POSITIVE_NUMBER)) {
        pageNumber = Number(page);
    }

    const response: VacationsResponse = query.length > 0 ? await getVacationsByQuery(decodeURIComponent(query), pageNumber, vacationsLimit) : await getVacations(pageNumber, vacationsLimit);
    console.log(response);
    if (pageNumber >= response.pages) pageNumber = response.pages - 1;

    return (
        <div className="flex flex-col gap-4 p-4 items-center">
            <Navbar />
            <div className="grid gap-6 w-full grid-cols-[repeat(auto-fill,minmax(275px,1fr))]">
                {response.items.length > 0 && (() => {
                    const items: any = [];
                    for (const vacation of response.items) {
                        items.push(<VacationCard key={vacation.id} vacation={{
                            ...vacation
                        }} />)
                    }
                    return items;
                })()}
            </div>
            <PageNavigator currentPage={pageNumber} maxPages={response.pages} />
        </div>
    );
}