import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Feature, Vacation } from "../types/types";
import { Dog, Dumbbell, SquareParking, Utensils, Wifi } from "lucide-react";

const FEATURES_ICONS = [
    <Utensils key="breakfast" />,
    <SquareParking key="parking" />,
    <Wifi key="wifi" />,
    <Dog key="pets" />,
    <Dumbbell key="gym" />
]

export function MoreDetails({ vacation }: {
    vacation: Vacation
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>More details</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{vacation.name}</DialogTitle>
                    <DialogDescription>{vacation.location}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-1">
                    <p>{vacation.description}</p>
                    <h1 className="font-bold">Commodities</h1>
                    <div className="flex gap-2">
                        {(() => {
                            const items: any = [];
                            for (const feature of vacation.features) {
                                if (FEATURES_ICONS.at(feature) !== undefined) items.push(FEATURES_ICONS.at(feature));
                            }
                            return items;
                        })()}
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Add to cart</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
