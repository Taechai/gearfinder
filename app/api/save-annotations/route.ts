import { validateProject } from "@/app/lib/utils";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(request: NextRequest
) {
    const { fileId, annotations } = await request.json()

    const token = await getToken({ req: request })
    if (!token) {
        return NextResponse.json({ message: "Unauthorized action. Please login to upload." }, { status: 401 })
    }
    const cookieStore = cookies()
    const currentProject = cookieStore.get("currentProject")
    if (!currentProject?.value) {
        return NextResponse.json({ message: "Invalid project name." }, { status: 400 });
    }

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

    const reconstructedImageId = correspondingImg.reconstructedImage.id;
    const existingAnnotations = await prisma.annotation.findMany({
        where: { imageId: reconstructedImageId },
        select: { id: true }
    })
    const existingAnnotationIds = existingAnnotations.map(({ id }) => id)
    const incomingAnnotationIds = annotations.map(({ id }: { id: string }) => id)

    // Prepare data for createMany
    const annotationsToCreate = annotations.filter(({ id }: { id: string }) => !existingAnnotationIds.includes(id)).map((annotation: any) => ({
        id: annotation.id,
        boundingBox: {
            x: annotation.x,
            y: annotation.y,
            width: annotation.width,
            height: annotation.height,
        },
        className: "Fishing Gear",
        coordinate: {
            x: "Not Available",
            y: "Not Available",
        },
        imageId: reconstructedImageId
    }))

    // Prepare data for update
    const annotationsToUpdate = annotations.filter(({ id }: { id: string }) => existingAnnotationIds.includes(id)).map((annotation: any) => ({
        where: { id: annotation.id },
        data: {
            boundingBox: {
                x: annotation.x,
                y: annotation.y,
                width: annotation.width,
                height: annotation.height,
            },
            className: "Fishing Gear",
            coordinate: {
                x: "Not Available",
                y: "Not Available",
            }
        },
    }))

    // Prepare data for deleteMany
    const annotationsToDelete = existingAnnotationIds.filter(id => !incomingAnnotationIds.includes(id));

    // Create annotations
    if (annotationsToCreate.length > 0) {
        await prisma.annotation.createMany({
            data: annotationsToCreate
        })
    }

    // Update annotations
    for (const updateOperation of annotationsToUpdate) {
        await prisma.annotation.update(updateOperation)
    }

    // Delete annotations
    if (annotationsToDelete) {
        await prisma.annotation.deleteMany({
            where: { id: { in: annotationsToDelete } }
        })
    }

    return NextResponse.json({ message: "Saved annotations successfully" })
}