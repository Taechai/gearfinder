"use client";

import { EnvelopeIcon, KeyIcon, LinkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Input from "./inputText";
import CheckBox from "./checkBox";
import Button from "./button";
import { FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function loginForm() {
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (!response?.error) {
      router.push("/gear-detection");
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-stretch gap-[30px]"
      action="#"
    >
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
      <div className="flex items-center justify-between">
        <CheckBox labelText="Remember me" id="remember-me-checkbox" />
        <Link
          href="#"
          className="text-md text-dark font-bold hover:underline outline-none focus:underline transition-all"
        >
          Forgot password?
        </Link>
      </div>
      <Button btnType="submit">Sign in</Button>
      <p className="text-md font-extralight text-dark text-center">
        Don’t have an account yet?{" "}
        <Link
          href="/signup"
          className="font-semibold hover:underline outline-none focus:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
