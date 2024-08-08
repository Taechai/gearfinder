import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
    const { currentProject } = await request.json()

    const token = await getToken({ req: request });
    if (!token) {
        return NextResponse.json({ message: "Unauthorized action. Please login to upload." }, { status: 401 });
    }

    if (currentProject.name == undefined) {
        return NextResponse.json({ message: "Invalid project name." }, { status: 400 });
    }

    const userId = Number(token.id)
    const userProjects: any = await prisma.user.findFirst({
        where: { id: userId },
        select: {
            projectsOwned: {
                where: { projectName: currentProject.name },
                select: { projectName: true }
            },
            accessibleProjects: {
                where: { projectName: currentProject.name },
                select: { projectName: true }
            }
        }
    })

    const isValidProject = userProjects.projectsOwned.length > 0 || userProjects.accessibleProjects.length > 0;
    if (!isValidProject) {
        return NextResponse.json({ message: "Unauthorized project access." }, { status: 403 });
    }

    const cookieStore = cookies()
    cookieStore.set("currentProject", currentProject.name, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 1 week,
    });
    return NextResponse.json({ message: "Uploaded Sucessfull" })
}