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
import { Coupon, LoyaltyType, Vacation } from "@/app/types/types";
import { useEffect, useState } from "react";
import { Euro, ShoppingBasket } from "lucide-react";
import { create } from "zustand";
import { completeCheckout } from "@/app/api/TransactionsController";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { getCoupon, getLoyalty } from "@/app/api/DiscountsController";

interface PurchaseState {
    dialogOpen: boolean
    alertOpen: boolean
    purchasing: boolean
    addingCoupon: boolean
    setDialogOpen: (value: boolean) => void
    setAlertOpen: (value: boolean) => void
    setPurchasing: (value: boolean) => void
    setAddingCoupon: (value: boolean) => void
}

export const usePurchaseState = create<PurchaseState>((set) => ({
    dialogOpen: false,
    alertOpen: false,
    purchasing: false,
    addingCoupon: false,
    discountAmount: {},
    setDialogOpen: (value: boolean) => set({ dialogOpen: value }),
    setAlertOpen: (value: boolean) => set({ alertOpen: value }),
    setPurchasing: (value: boolean) => set({ purchasing: value }),
    setAddingCoupon: (value: boolean) => set({ addingCoupon: value }),
}));

function isCouponValid(coupon: Coupon): boolean {
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= coupon.starts_at && currentTime <= coupon.expires_at;
}

function CheckoutAlert({ price, quantity }: {
    price: number,
    quantity: number,
}) {
    const checkout = useCheckout();
    const state = usePurchaseState();
    const router = useRouter();
    return (
        <AlertDialog open={state.alertOpen}>
            <AlertDialogTrigger asChild>
                <Button disabled={state.addingCoupon} onClick={() => state.setAlertOpen(true)}>Purchase</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>You will purchase {quantity} seats for a total of €{price.toFixed(2)}.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={state.purchasing || state.addingCoupon} onClick={() => state.setAlertOpen(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={state.purchasing || state.addingCoupon} onClick={() => {
                        state.setPurchasing(true);
                        completeCheckout(checkout.products, price).then(value => {
                            if (value) {
                                toast("Checkout completed", {
                                    description: `You bought x${quantity} seats for ${price.toFixed(2)}.`,
                                });
                                router.refresh();
                                checkout.clear();
                            } else {
                                toast("Checkout failed", {
                                    description: `You can't purchase this many amount of seats.`,
                                });
                            }
                            state.setPurchasing(false);
                            state.setAlertOpen(false);
                            state.setDialogOpen(false);
                        }).catch(reason => {
                            console.log(reason);
                            state.setPurchasing(false);
                            state.setAlertOpen(false);
                            state.setDialogOpen(false);
                            toast("Checkout failed", {
                                description: `An unknown error occurred during transaction.`,
                            });
                        })
                    }}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function Checkout({ discountAmount }: {
    discountAmount: Record<string, number>
}) {
    const checkout = useCheckout();
    const [vacations, setVacations] = useState<Vacation[]>([]);
    const [details, setDetails] = useState<{ price: number, quantity: number }>({ price: 0, quantity: 0 });
    const state = usePurchaseState();

    useEffect(() => {
        getLoyalty().then(value => {
            checkout.setLoyalty(value);
        });
    }, [])

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

                if (checkout.loyalty === LoyaltyType.NORMAL) {
                    discountAmount[vacation.id] += 0.05;
                }

                if (discountAmount[vacation.id] > 0) {
                    counter -= discountAmount[vacation.id] * vacation.price * product.quantity;
                    continue;
                }

                const coupon = checkout.coupons.find(coupon => coupon.product_id === vacation.id);
                if (coupon) {
                    counter -= product.quantity * vacation.price * coupon.amount;
                }
            }

            setDetails({ price: counter, quantity: quantity });
        });
    }, [checkout]);

    return (
        <Dialog open={state.dialogOpen}
            onOpenChange={(isOpen) => {
                state.setDialogOpen(isOpen);
            }}>
            <DialogTrigger asChild onClick={() => state.setDialogOpen(true)}>
                <div className="flex items-center justify-center cursor-pointer">
                    <ShoppingBasket />
                    <span className="absolute font-light text-sm mt-4 ml-4 bg-black text-white px-1 bg-opacity-70 rounded-sm">{checkout.products.length}</span>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[fit]">
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
                            const coupon = checkout.coupons.find(coupon => coupon.product_id === vacation.id);

                            if (discountAmount[vacation.id] > 0 || coupon !== undefined) {
                                var discountedPrice = price - vacation.price * discountAmount[vacation.id] * product.quantity;
                                if (coupon) discountedPrice = price - vacation.price * product.quantity * coupon.amount;

                                return <div className="flex gap-1 text-base" key={vacation.id}>
                                    <span>{quantity}x '{vacation.name}' for</span>
                                    <span className="flex font-bold"><Euro />{discountedPrice.toFixed(2)},</span>
                                    <span>was {price.toFixed(2)}</span>
                                </div>
                            }

                            return <div className="flex gap-1 text-base" key={vacation.id}>
                                <span>{quantity}x '{vacation.name}' for</span>
                                <span className="flex font-bold"><Euro />{price.toFixed(2)}</span>
                            </div>
                        })}
                        { details.price > 1000 && <span className="font-bold">Free transport included</span> }
                        { details.price > 0 && checkout.loyalty == LoyaltyType.NORMAL && <span className="font-bold">5% discount for being loyal</span> }
                    </div>
                </div>
                {details.price > 0 &&
                    <DialogFooter className="gap-1">
                        <Button disabled={state.addingCoupon} variant="outline" type="submit" onClick={() => {
                            checkout.clear();
                        }}>Clear</Button>
                        <Input id="coupon" disabled={state.addingCoupon} type="text" placeholder="Add a coupon" onKeyDown={(event) => {
                            const element = document.getElementById("coupon") as HTMLInputElement;
                            const value = element.value.trim();

                            if (event.key == "Enter" && value.length > 0) {
                                element.value = "";
                                if (checkout.coupons.find(coupon => coupon.code === value)) {
                                    toast("Coupon already applied", {
                                        description: `There is already a coupon applied with this code.`
                                    });
                                    return;
                                }
                                state.setAddingCoupon(true);
                                getCoupon(value).then(coupon => {
                                    const vacation = vacations.find(vacation => vacation.id === coupon?.product_id);
                                    if (!coupon || !vacation) {
                                        toast("Coupon not found", {
                                            description: <span>Coupon <span className="font-bold">{value}</span> wasn't found.</span>
                                        });
                                    } else if (!isCouponValid(coupon)) {
                                        toast("Coupon is expired", {
                                            description: <span>Coupon <span className="font-bold">{value}</span> is expired.</span>
                                        });
                                    } else if (discountAmount[vacation.id] > 0) {
                                        toast("Can't apply coupon", {
                                            description: `There's already a discount applied.`
                                        });
                                    } else {
                                        toast("Coupon added", {
                                            description: <span><span className="font-bold">{(coupon.amount * 100).toFixed(2)}%</span> discount for <span className="font-bold">'{vacation.name}'</span></span>
                                        });
                                        checkout.addCoupon(coupon);
                                    }
                                    state.setAddingCoupon(false);
                                })
                            }
                        }} />
                        <CheckoutAlert price={details.price} quantity={details.quantity} />
                    </DialogFooter>
                }
            </DialogContent>
        </Dialog>
    )
}