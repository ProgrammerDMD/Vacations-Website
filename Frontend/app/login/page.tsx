"use client";
import { login } from "@/app/api/AuthenticationController";
import { LoginSchema, LoginSchemaType } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
    const router = useRouter();
    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: "",
            password: ""
        },
        criteriaMode: "all"
    });
    
    const { getValues, setError, clearErrors, formState } = form;

    function onSubmit(values: LoginSchemaType) {
        login(values).then((value) => {
            if (value === undefined) {
                router.push("/");
            } else {
                setError("root.custom", {
                    type: "auth",
                    message: "Invalid credentials provided."
                });
            }
        }).catch((reason) => {
            console.log(reason);
            setError("root.custom", {
                type: "auth",
                message: "An unknown error occurred."
            });
        });
    }

    useEffect(() => {
        clearErrors("root.custom");
    }, [getValues("username"), getValues("password")]);

    return (
        <div className="w-screen h-screen flex items-center justify-center flex-col gap-2 bg-gray-50">
            <div className="w-fit shadow p-4 rounded-md bg-white">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="w-60">
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="mikey" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-60">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {!!formState.errors.root && <p className="text-destructive">{formState.errors.root.custom?.message}</p>}
                        <Button type="submit" disabled={formState.isSubmitting} onChange={() => form.clearErrors("root.custom")} >Login</Button>
                    </form>
                </Form>
            </div>
            <Link href="/register" className="text-gray-500 text-sm hover:underline">or register here</Link>
        </div>
    );
}