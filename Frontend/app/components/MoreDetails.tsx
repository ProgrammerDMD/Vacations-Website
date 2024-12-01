"use client";
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
import { DiscountType, Vacation } from "../types/types";
import { Dog, Dumbbell, Equal, Euro, SquareParking, User, Utensils, Wifi } from "lucide-react";
import { useCheckout } from "@/app/api/CheckoutController";
import { toast } from "sonner";

const FEATURES_ICONS = [
    <Utensils key="breakfast" />,
    <SquareParking key="parking" />,
    <Wifi key="wifi" />,
    <Dog key="pets" />,
    <Dumbbell key="gym" />
]

export function MoreDetails({ vacation, discount, discountAmount }: {
    vacation: Vacation,
    discount: DiscountType,
    discountAmount: number
}) {
    var backgroundColor = "";
    if (discount === DiscountType.LIMITED) {
        backgroundColor = "bg-red-500";
    } else if (discount === DiscountType.NORMAL) {
        backgroundColor = "bg-blue-500";
    }

    const checkout = useCheckout();
    const newPrice = vacation.price - vacation.price * discountAmount;
    const discountText = discountAmount > 0 ? ", %" + (discountAmount * 100).toFixed(2) + " discount" : "";

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className={backgroundColor}>More details</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{vacation.name}</DialogTitle>
                    <DialogDescription>{vacation.location} ({vacation.quantity} seats)<span className="font-bold">{discountText}</span></DialogDescription>
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
                    <h1 className="font-bold">Price</h1>
                    <div className="flex gap-2">
                        {discountAmount > 0 ?
                            <>
                                <div className="flex">
                                    <span>1x</span><User />
                                </div>
                                <Equal />
                                <div className="flex">
                                    <Euro />
                                    <span><span className="line-through">{vacation.price.toFixed(2)}</span><span>, now </span><span className="font-bold">{newPrice.toFixed(2)}</span></span>
                                </div>
                            </> :
                            <>
                                <div className="flex">
                                    <span>1x</span><User />
                                </div>
                                <Equal />
                                <div className="flex">
                                    <Euro />
                                    <span>{vacation.price.toFixed(2)}</span>
                                </div>
                            </>
                        }
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={() => {
                        checkout.addProduct(vacation.id, 1);
                        toast("Added to cart", {
                            description: `x1 '${vacation.name}' for €${discountAmount > 0 ? newPrice.toFixed(2) : vacation.price.toFixed(2) }`,
                            action: {
                                label: "Undo",
                                onClick: () => checkout.removeProduct(vacation.id, 1)
                            }
                        });
                    }}>Add to cart</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
