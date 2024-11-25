"use client";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

export const MAX_PAGES_PER_INTERVAL = 10;

export default function PageNavigator({ currentPage, maxPages }: {
    currentPage: number,
    maxPages: number
}) {
    const params = useSearchParams();
    const totalIntervals = maxPages / MAX_PAGES_PER_INTERVAL;
    const currentInterval = Math.floor(currentPage * totalIntervals / maxPages);
    const previousPage = currentPage - 1;
    const nextPage = currentPage + 1;

    return (
        <div className="my-auto">
            <Pagination>
                <PaginationContent>
                    {previousPage >= 0 &&
                        <PaginationItem>
                            <PaginationPrevious href={params.get("query") ? `/?page=${previousPage}&query=${encodeURIComponent(params.get("query") as string)}` : `/?page=${previousPage}` } isActive={false} />
                        </PaginationItem>
                    }
                    {(() => {
                        const items: any = [];
                        for (let i = currentInterval * MAX_PAGES_PER_INTERVAL - 1; i < currentInterval * MAX_PAGES_PER_INTERVAL + MAX_PAGES_PER_INTERVAL + 1 && i < maxPages; i++) {
                            items.push(
                                <PaginationItem key={`page-${i}`}>
                                    <PaginationLink href={params.get("query") ? `/?page=${i}&query=${encodeURIComponent(params.get("query") as string)}` : `/?page=${i}` } isActive={currentPage == i}>{i + 1}</PaginationLink>
                                </PaginationItem>
                            );
                        }

                        // Remove the non-existent page
                        if (currentInterval == 0) items.shift();
                        return items;
                    })()}
                    {nextPage < maxPages &&
                        <PaginationItem>
                            <PaginationNext href={params.get("query") ? `/?page=${nextPage}&query=${encodeURIComponent(params.get("query") as string)}` : `/?page=${previousPage}` } />
                        </PaginationItem>}
                </PaginationContent>
            </Pagination>
        </div>
    );
}