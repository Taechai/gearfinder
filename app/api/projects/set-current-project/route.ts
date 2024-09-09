import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { validateProject } from "@/app/lib/utils";

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
    const projectId = await validateProject(userId, currentProject.name)

    if (!projectId) {
        return NextResponse.json({ message: "Unauthorized project access." }, { status: 403 });
    }

    const files = await prisma.file.findMany({
        where: { projectId: projectId },
        select: {
            reconstructedImage: { select: { imagePath: true, annotations: { select: { id: true, className: true } } } },
            fileName: true,
            id: true
        }
    })

    // Getting unique project classes
    const annotationIds = files.flatMap(({ reconstructedImage }) =>
        reconstructedImage?.annotations.map(({ id }) => id) || []
    );
    const uniqueProjectClasses = (await prisma.annotation.findMany({
        select: { className: true },
        distinct: ['className'],
        where: { id: { in: annotationIds } },
        orderBy: { className: "asc" }
    })).map(({ className }) => className)


    // Storing the current project in the cookies
    const cookieStore = cookies()
    cookieStore.set("currentProject", currentProject.name, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 1 week,
    });
    return NextResponse.json({
        message: "Project switched succesfully",
        files: [...files.map(({ reconstructedImage, fileName, id }) => ({
            imagePath: reconstructedImage?.imagePath ?? "",
            fileName,
            fileId: id,
            state: reconstructedImage?.annotations.length == 0 ? "unassigned" : "annotated"
        }))],
        projectClasses: uniqueProjectClasses
    })
}