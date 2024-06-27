"use client";

import { EnvelopeIcon, KeyIcon, UserIcon } from "@heroicons/react/20/solid";
import Input from "../components/inputText";
import Button from "../components/button";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  validateEmail,
  validateFullName,
  validatePassword,
} from "@/app/lib/formValidation";

const errorsInit = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  form: "",
};

export default function SignupForm() {
  const router = useRouter();
  const [errors, setErrors] = useState({ ...errorsInit });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const fullName = formData.get("full-name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirm-password")?.toString() || "";

    // Validation
    if (!validateFullName(fullName)) {
      setErrors({
        ...errorsInit,
        fullName: "Both the first and last names should be provided.",
      });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ ...errorsInit, email: "Invalid email format." });
      return;
    }

    if (!validatePassword(password)) {
      setErrors({
        ...errorsInit,
        password: `
        Your password must meet the following criteria:<br/>
        - At least 8 characters long<br/>
        - Contains at least one uppercase letter<br/>
        - Contains at least one lowercase letter<br/>
        - Contains at least one digit<br/>
        - Contains at least one special character (e.g., !@#$%^&*)
    `,
      });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({
        ...errorsInit,
        confirmPassword: "Passwords do not match.",
      });
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
        confirmPassword,
      }),
    });

    if (!response.ok) {
      const { message } = await response.json();
      console.error("Registration failed:", message);
      setErrors({
        ...errorsInit,
        form:
          response.status === 500
            ? message
            : "Something went wrong on our end. Please try again in a few minutes.",
      });
      // alert(`Error: ${errorResult.message}`);
      return;
    }

    const { userCreated } = await response.json();

    // Redirecting
    if (userCreated) {
      router.replace("/login");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-stretch gap-[30px]"
      //   action="#"
    >
      <div>
        <Input
          Icon={UserIcon}
          id="full-name"
          name="full-name"
          type="text"
          placeholder="Last Name / First Name"
          otherTwClass={
            (errors.fullName || errors.form) && "ring-error-main/80 ring-[1px]"
          }
          required
        />
        {errors.fullName && (
          <p className="text-md text-error-main mt-[5px] ml-[10px]">
            {errors.fullName}
          </p>
        )}
      </div>
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
          <p
            className="text-md text-error-main mt-[5px] ml-[10px]"
            dangerouslySetInnerHTML={{ __html: errors.password }}
          />
        )}
      </div>
      <div>
        <Input
          Icon={KeyIcon}
          id="confirm-password"
          name="confirm-password"
          type="password"
          placeholder="Confirm Password"
          otherTwClass={
            (errors.confirmPassword || errors.form) &&
            "ring-error-main/80 ring-[1px]"
          }
          required
        />
        {errors.confirmPassword && (
          <p className="text-md text-error-main mt-[5px] ml-[10px]">
            {errors.confirmPassword}
          </p>
        )}
        {errors.form && (
          <p className="text-md text-error-main mt-[5px] ml-[10px]">
            {errors.form}
          </p>
        )}
      </div>
      <Button btnType="submit">Sign up</Button>
    </form>
  );
}
