import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: {
            _count: {
                select: { projectsOwned: true },
            },
        },
    });

    const projectsCount = user?._count.projectsOwned

    if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    return NextResponse.json({ message: "Success", firstConnection: projectsCount == 0 })
}
