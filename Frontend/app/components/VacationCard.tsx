import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Equal, Euro, User } from "lucide-react";
import { Vacation } from "../types/types";

export default function VacationCard({ vacation }: {
    vacation: Vacation
}) {
    return (
        <Card className="w-72 m-auto">
            <CardHeader>
                <CardTitle>{vacation.name}</CardTitle>
                <CardDescription>{vacation.location}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{vacation.description}</p>
            </CardContent>
            <CardFooter className="flex-col gap-3 justify-center">
                <div className="flex gap-2">
                    <div className="flex">
                        <span>1x</span><User />
                    </div>
                    <Equal />
                    <div className="flex">
                        <Euro />
                        <span>{Math.trunc(vacation.price)}</span>
                    </div>
                </div>
                <Button>More details</Button>
            </CardFooter>
        </Card>
    );
}