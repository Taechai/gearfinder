"use client";

import { EnvelopeIcon, KeyIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Input from "./inputText";
import CheckBox from "./checkBox";
import Button from "./button";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    form: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!validateEmail(email)) {
      setErrors({ email: "Invalid email format", password: "", form: "" });
      return;
    }

    if (password.length < 8) {
      setErrors({
        email: "",
        password: "Password must be at least 8 characters long",
        form: "",
      });
      return;
    }

    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      rememberMe: formData.get("remember-me"),
      redirect: false,
      // callbackUrl: "/gear-map",
    });
    if (!response?.error) {
      router.push("/gear-detection");
      router.refresh();
    } else {
      setErrors({ email: "", password: "", form: "Invalid email or password" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-stretch gap-[30px]"
      action="#"
    >
      <div>
        <Input
          Icon={EnvelopeIcon}
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          otherTwClass={
            (errors.email || errors.form) && "ring-error-main/80 ring-[1px]"
          }
          required
        />
        {errors.email && (
          <p className="text-md text-error-main mt-[5px] ml-[10px]">
            {errors.email}
          </p>
        )}
      </div>
      <div>
        <Input
          Icon={KeyIcon}
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          otherTwClass={
            (errors.password || errors.form) && "ring-error-main/80 ring-[1px]"
          }
          required
        />
        {errors.password && (
          <p className="text-md text-error-main mt-[5px] ml-[10px]">
            {errors.password}
          </p>
        )}
        {errors.form && (
          <p className="text-md text-error-main mt-[5px] ml-[10px]">
            {errors.form}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <CheckBox labelText="Remember me" id="remember-me" />
        <Link
          href="#"
          className="text-md text-dark font-bold hover:underline outline-none focus:underline transition-all"
        >
          Forgot password?
        </Link>
      </div>
      <Button
        btnType="submit"
        otherTwClass={"w-full"}
        // onClick={(e) => {
        //   e.preventDefault();
        // }}
      >
        Sign in
      </Button>
      {/* <p className="text-sm text-error-main">Incorrect email or password !!</p> */}
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
