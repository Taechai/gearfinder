import { validateProject } from "@/app/lib/utils";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
    const fileId = request.nextUrl.searchParams.get("id")

    if (isNaN(Number(fileId))) {
        return NextResponse.json({ message: "Invalid file ID provided." }, { status: 400 });
    }

    // Check if the user is logged in
    const token = await getToken({ req: request })
    if (!token) {
        return NextResponse.json({ message: "Unauthorized action. Please login to upload." }, { status: 401 })
    }

    // Get the current project and if it doesn't exist no action is taken
    const cookieStore = cookies()
    const currentProject = cookieStore.get("currentProject")
    if (!currentProject?.value) {
        return NextResponse.json({ message: "Invalid project name." }, { status: 400 });
    }

    // Check if the current project belongs to the current user
    const userId = Number(token.id)
    const projectId = await validateProject(userId, currentProject.value)
    if (!projectId) {
        return NextResponse.json({ message: "Unauthorized project access." }, { status: 403 });
    }

    // Check if the file belongs the the provided project
    const correspondingImg = await prisma.file.findFirst({
        where: {
            id: Number(fileId),
            projectId: projectId
        },
        select: {
            fileName: true,
            reconstructedImage: {
                select: { id: true }
            },
        }
    })

    if (!correspondingImg || !correspondingImg.reconstructedImage?.id) {
        return NextResponse.json({ message: `The file with ID ${fileId} either does not belong to the current project or its corresponding image has not yet been reconstructed.` }, { status: 403 })
    }

    // Select the corresponding annotations for the reconstructed image
    const reconstructedImgId = correspondingImg.reconstructedImage.id
    const annotations = await prisma.annotation.findMany({
        where: { imageId: reconstructedImgId }
    })

    return NextResponse.json({ annotations: annotations })
}