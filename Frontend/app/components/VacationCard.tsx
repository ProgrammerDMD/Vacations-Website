import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Equal, Euro, User } from "lucide-react";
import { DiscountType, Vacation } from "../types/types";
import { MoreDetails } from "./MoreDetails";

export default function VacationCard({ vacation, discount, discountAmount }: {
    vacation: Vacation,
    discount: DiscountType,
    discountAmount: number
}) {
    var shadow = "";
    var colorHex = "";
    var colorTailwind = "";
    if (discount === DiscountType.LIMITED) {
        colorHex = "#ef4444"; // Red
        colorTailwind = "text-red-500";
        shadow = "shadow-red-500";
    } else if (discount === DiscountType.NORMAL) {
        colorHex = "#3b82f6"; // Blue
        colorTailwind = "text-blue-500";
        shadow = "shadow-blue-500";
    }
    
    const newPrice = vacation.price - vacation.price * discountAmount;
    const discountText = discountAmount > 0 ? ", %" + (discountAmount * 100).toFixed(2) + " discount" : "";

    return (
        <Card className={`w-80 m-auto ${shadow}`}>
            <CardHeader>
                <CardTitle>{vacation.name}</CardTitle>
                <CardDescription>{vacation.location} ({vacation.quantity} seats)<span className="font-bold">{discountText}</span></CardDescription>
            </CardHeader>
            <CardContent>
                <p>{vacation.description}</p>
            </CardContent>
            <CardFooter className="flex-col gap-3 justify-center">
                <div className="flex gap-2">
                    {discountAmount > 0 ?
                        <>
                            <div className="flex">
                                <span className={`${colorTailwind}`}>1x</span><User color={colorHex} />
                            </div>
                            <Equal color={colorHex} />
                            <div className="flex">
                                <Euro color={colorHex} />
                                <span className={`${colorTailwind}`}><span className="line-through">{vacation.price.toFixed(2)}</span><span>, now </span><span className="font-bold">{newPrice.toFixed(2)}</span></span>
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
                <MoreDetails vacation={vacation} discount={discount} discountAmount={discountAmount} />
            </CardFooter>
        </Card>
    );
}