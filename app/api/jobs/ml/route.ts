import { validateProject } from "@/app/lib/utils";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";


export async function POST(request: NextRequest) {
    const { datasetDistribution, augmentationParams } = await request.json()

    // Verify if user is logged in
    const token = await getToken({ req: request })
    if (!token) {
        return NextResponse.json({ message: "Unauthorized action. Please login to upload." }, { status: 401 })
    }

    // Verify if the project name given is valide
    const cookieStore = cookies()
    const currentProject = cookieStore.get("currentProject")
    if (!currentProject?.value) {
        return NextResponse.json({ message: "Invalid project name." }, { status: 400 });
    }

    // Verify if the user have access to that project
    const userId = Number(token.id)
    const projectId = await validateProject(userId, currentProject.value)
    if (!projectId) {
        return NextResponse.json({ message: "Unauthorized project access." }, { status: 403 });
    }

    // Verify if a ML Job is in progress
    const jobsInProgress = await prisma.machineLearningJob.findMany({
        where: { projectId: projectId },
        select: { id: true }
    })
    if (jobsInProgress.length > 0) {
        return NextResponse.json(
            { message: "A machine learning job is already in progress for this project. Please wait until it is completed before starting a new one." },
            { status: 401 }
        );

    }

    // Insert the Machine Learning Job into the database
    const job = await prisma.machineLearningJob.create({
        data: {
            datasetDistribution,
            augmentationParams,
            projectId
        }
    })

    return NextResponse.json({ message: "Created the ML Job Successfully", job })
}