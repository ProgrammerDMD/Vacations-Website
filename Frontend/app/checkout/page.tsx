import Navbar from "@/app/components/Navbar";

export const POSITIVE_NUMBER = /^\d*$/;

export default async function CheckoutPage() {
    return (
        <div className="flex flex-col gap-4 p-4 items-center">
            <Navbar />
        </div>
    );
}