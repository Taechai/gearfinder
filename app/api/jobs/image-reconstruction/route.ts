import { validateProject, checkJobStatus } from "@/app/lib/utils";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
    const { fileId } = await request.json()

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
    const isFileExist = await prisma.file.findFirst({
        where: {
            id: Number(fileId),
            projectId: projectId
        },
        select: {
            fileName: true,
        },
    })

    if (!isFileExist) {
        return NextResponse.json({ message: `The file with ID ${fileId} either does not belong to the current project.` }, { status: 403 })
    }

    // Check if the number of attempts to reconstruct the image
    const attemptsNumber = await prisma.imageReconstructionJob.groupBy({
        by: ['status'],
        where: {
            fileId: fileId,
            status: { in: ['failed', 'completed'] },
        },
        _count: {
            status: true,
        },
    });

    const totalCount = attemptsNumber.length > 0 ? attemptsNumber.map(({ _count }) => _count.status).reduce((prev, curr) => prev + curr) : 0

    if (totalCount >= 10) {
        return NextResponse.json({ message: `The file with ID ${fileId} reached the number of allowed attempts.` }, { status: 403 })
    }
    console.log("HEEEERE 1")
    // Check if there was a job in progress
    const jobInProgress = await prisma.imageReconstructionJob.findFirst(
        {
            select: { status: true },
            where: { fileId: fileId },
            orderBy: { createdAt: "desc" },
            // take: 1
        }
    )

    if (jobInProgress && jobInProgress.status == "failed") {
        // Creating the image reconstruction job
        const newJob = await prisma.imageReconstructionJob.create({
            data: { fileId: fileId },
        })

        // Wait for the job to complete
        await checkJobStatus(newJob.id);
    }
    console.log("HEEEERE 2")

    const file = await prisma.file.findFirst({
        where: {
            id: fileId,
            projectId: projectId,
        },
        select: {
            reconstructedImage: { select: { imagePath: true, annotations: { select: { id: true, className: true } } } },
            fileName: true,
            id: true,
            // Select the most recent image reconstruction job
            imageReconstructionJob: {
                orderBy: {
                    createdAt: 'desc',  // Assuming 'createdAt' is the timestamp field
                },
                select: {
                    status: true,
                },
                take: 1
            },
        }
    })

    return NextResponse.json({
        message: "Uploaded Sucessfull",
        file: {
            imagePath: file?.reconstructedImage?.imagePath ?? "",
            fileName: file?.fileName,
            fileId: file?.id,
            state: (file?.reconstructedImage?.annotations.length == 0 || file?.reconstructedImage?.annotations == undefined) ? "unassigned" : "annotated",
            imageReconstructionJobStatus: file?.imageReconstructionJob[0].status
        }
    })

}