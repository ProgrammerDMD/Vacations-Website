import { signIn } from "next-auth/react";
import { LoginSchemaType, RegisterSchemaType } from "@/app/types/types";

export async function login(values: LoginSchemaType) {
    const response = await signIn('credentials', { username: values.username, password: values.password, redirect: false });
    if (response?.error) return "Invalid credentials provided.";
}

export async function register(values: RegisterSchemaType) {
    const registerResponse = await fetch("http://localhost:3001/users", {
        method: "POST",
        body: JSON.stringify({
            username: values.username,
            name: values.name,
            password: values.password
        }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!registerResponse.ok) {
        return "Account already exists.";
    } else {
        await signIn('credentials', { username: values.username, password: values.password, redirect: true, callbackUrl: "http://localhost:3001/login" });
    }
}