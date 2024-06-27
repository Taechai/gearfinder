import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { hash } from "bcrypt";
import { validateEmail, validateFullName, validatePassword } from "@/app/lib/formValidation";

export async function POST(request: Request) {
    try {
        const { fullName, email, password, confirmPassword } = await request.json();

        // Validation
        if (!validateEmail(email) ||
            !validateFullName(fullName) ||
            !validatePassword(password) ||
            password !== confirmPassword) {
            return NextResponse.json({ message: "Validation error" }, { status: 400 })
        }

        const passwordHashed = await hash(password, 10)

        let dbError = ""
        await prisma.user.create({
            data: {
                fullName: fullName,
                email: email,
                passwordHash: passwordHashed,
            }
        }).catch((e) => {
            if (e.code == "P2002") {
                dbError = "This user already exists."
            }
            else {
                dbError = "Something went wrong on our end. Please try again in a few minutes."
            }

        })

        if (dbError) {
            return NextResponse.json({ message: dbError }, { status: 500 });
        }

        return NextResponse.json({ message: 'User created successfully.', userCreated: true })

    } catch (e) {
        return NextResponse.json({ message: 'Something went wrong on our end. Please try again in a few minutes.', error: e }, { status: 500 });
    }

}