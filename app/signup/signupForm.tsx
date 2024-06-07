'use client'

import { EnvelopeIcon, KeyIcon, UserIcon } from "@heroicons/react/20/solid";
import Input from "../components/inputText";
import Button from "../components/button";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {

    const router = useRouter()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: formData.get('full-name'),
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirm-password')
            })
        })

        if (!response.ok) {
            const errorResult = await response.json();
            console.error('Registration failed:', errorResult.message);
            // Display the error message to the user
            // alert(`Error: ${errorResult.message}`);
            return;
        }

        const { userCreated } = await response.json();

        // Redirecting
        if (userCreated) {
            router.replace("/login");
        }
    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-stretch gap-[30px]" action="#">
            <Input
                Icon={UserIcon}
                id="full-name"
                name="full-name"
                type="text"
                placeholder="Last Name / First Name"
                required
            />
            <Input
                Icon={EnvelopeIcon}
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
            />

            <Input
                Icon={KeyIcon}
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
            />
            <Input
                Icon={KeyIcon}
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="Confirm Password"
                required
            />
            <Button btnType="submit">Sign up</Button>
        </form>
    );
}
