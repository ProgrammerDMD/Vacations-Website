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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCheckout } from "@/app/api/CheckoutController";
import { getVacationsByProducts } from "@/app/api/VacationsController";
import { Vacation } from "@/app/types/types";
import { useEffect, useState } from "react";
import { Euro, ShoppingBasket } from "lucide-react";

function CheckoutAlert({ price, quantity } : {
    price: number,
    quantity: number
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>Purchase</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>You will purchase {quantity} seats for a total of €{price}.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function Checkout() {
    const checkout = useCheckout();
    const [vacations, setVacations] = useState<Vacation[]>([]);
    const [details, setDetails] = useState<{ price: number, quantity: number }>({ price: 0, quantity: 0 });

    useEffect(() => {
        getVacationsByProducts(checkout.products).then(result => {
            setVacations(result);

            var counter: number = 0;
            var quantity: number = 0;
            for (let vacation of result) {
                const product = checkout.products.find(value => value.id === vacation.id);
                if (!product) return;

                quantity += product.quantity;
                counter += product.quantity * vacation.price;
            }

            setDetails({ price: counter, quantity: quantity });
        });
    }, [checkout.products]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex items-center justify-center cursor-pointer">
                    <ShoppingBasket />
                    <span className="absolute font-light text-sm mt-4 ml-4 bg-black text-white px-1 bg-opacity-70 rounded-sm">{checkout.products.length}</span>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Checkout</DialogTitle>
                    <DialogDescription>You have {checkout.products.length} products in your cart.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center gap-1">
                        {vacations.map((vacation) => {
                            const product = checkout.products.find(value => value.id === vacation.id);
                            if (!product) return;

                            const quantity = product.quantity;
                            const price = quantity * vacation.price;

                            return <div className="flex gap-1" key={vacation.id}>
                                <span>{quantity}x '{vacation.name}' for</span>
                                <span className="flex font-bold"><Euro />{price.toFixed(2)}</span>
                            </div>
                        })}
                    </div>
                    {details.price > 0 && <h1 className="flex gap-1">
                        <span>Your cart amounts to</span>
                        <span className="flex font-bold"><Euro />{details.price.toFixed(2)}</span>
                    </h1>}
                </div>
                {details.price > 0 &&
                    <DialogFooter>
                        <Button variant="outline" type="submit" onClick={() => {
                            checkout.clear();
                        }}>Clear</Button>
                        <CheckoutAlert price={details.price} quantity={details.quantity}  />
                    </DialogFooter>
                }
            </DialogContent>
        </Dialog>
    )
}