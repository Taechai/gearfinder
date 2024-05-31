import { EnvelopeIcon, KeyIcon, LinkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Input from "./inputText";
import CheckBox from "./checkBox";
import Button from "./button";

export default function loginForm() {
  return (
    <form className="flex flex-col items-stretch gap-[30px]" action="#">
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
          href="/create"
          className="font-semibold hover:underline outline-none focus:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
