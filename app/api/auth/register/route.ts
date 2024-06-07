import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { hash } from "bcrypt";
export async function POST(request: Request) {
    try {
        const {fullName, email, password, confirmPassword} = await request.json();

        // // Validate email and password
        
        // Email Validation
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(email)) {
        //     return NextResponse.json({ message: "Invalid email format!" }, { status: 400 });
        // }

        // Password validation
        if (password !== confirmPassword) return NextResponse.json({message: "Passwords do not match!"}, {status: 400})


        const passwordHashed = await hash(password, 10)

        await prisma.user.create({
            data:{
                fullName: fullName,
                email: email,
                passwordHash: passwordHashed,
            }
        })

        return NextResponse.json({message: 'User created successfully', userCreated: true})

    } catch (e) {
        return NextResponse.json({ message: 'An error occurred', error: e }, { status: 500 });
    }

}