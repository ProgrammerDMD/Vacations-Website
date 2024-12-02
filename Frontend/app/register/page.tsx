"use client";
import { login, register } from "@/app/api/AuthenticationController";
import { LoginSchema, LoginSchemaType, RegisterSchema, RegisterSchemaType } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
    const router = useRouter();
    const form = useForm<RegisterSchemaType>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: "",
            name: "",
            password: ""
        },
        criteriaMode: "all"
    });
    
    const { getValues, setError, clearErrors, formState } = form;

    function onSubmit(values: RegisterSchemaType) {
        register(values).then((value) => {
            if (value === undefined) {
                router.push("/");
            } else {
                setError("root.custom", {
                    type: "auth",
                    message: "Account already exists."
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
    }, [getValues("username"), getValues("password"), getValues("name")]);

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
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-60">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Mikey" {...field} />
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
                        <Button type="submit" disabled={formState.isSubmitting} onChange={() => form.clearErrors("root.custom")} >Register</Button>
                    </form>
                </Form>
            </div>
            <Link href="/login" className="text-gray-500 text-sm hover:underline">or login here</Link>
        </div>
    );
}