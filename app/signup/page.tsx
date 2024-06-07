import MerinovLogoDark from "@/public/merinov-logo-dark.png";
import Image from "next/image";
import SignupForm from "./signupForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
    const session = await getServerSession()
    if (session) {
        redirect("/gear-detection")
    }
    return (
        <div className="relative flex flex-col items-center justify-center gap-[30px] size-full p-[10px] ">
            <Image
                className="absolute max-sm:top-0 max-sm:static max-sm:size-[90px] top-[10px] size-[100px] opacity-70"
                src={MerinovLogoDark}
                alt="Merinov Logo"
                width={125}
                height={125}
            />
            <div className="flex flex-col justify-center gap-[30px] w-full p-[10px] sm:max-w-md">
                <h1 className="text-xl font-semibold leading-tight text-dark text-center">
                    Register New Account
                </h1>
                <div className="bg-dark-gradient h-[1.5px]" />
                <SignupForm />
            </div>
        </div>
    );
}
