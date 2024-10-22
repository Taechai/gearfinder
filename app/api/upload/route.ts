import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import path from 'path';
import fs from 'fs';
import prisma from "@/app/lib/prisma";
import { v4 as uuidv4 } from 'uuid';
import { checkJobStatus } from "@/app/lib/utils";

const uploadDir = path.join(process.cwd(), 'app/api/upload/uploaded-files');

// Ensure the upload directory exists
fs.mkdirSync(uploadDir, { recursive: true });


export async function POST(request: NextRequest) {
    const res = await request.formData()

    const token = await getToken({ req: request })
    if (!token) {
        return NextResponse.json({ message: "Unauthorized action. Please login to upload." }, { status: 401 })
    }

    const file = await res.get("file")
    const projectName = await res.get("projectName")

    if (!file || !projectName) {
        return NextResponse.json({ message: "File or Project Name is not provided" }, { status: 400 })
    }

    if (!(file instanceof File)) {
        return NextResponse.json({ message: "Invalid file format" }, { status: 400 });
    }


    const uniqueFileName = `${uuidv4()}.${file.name.split(".").pop()}`;
    const filePath = path.join(uploadDir, uniqueFileName)

    let fileId: number = -1

    // Save file metadata
    try {
        const userId = token.id
        const projectCreationResult = await prisma.project.create({
            data: {
                projectName: projectName as string,
                ownerId: Number(userId),
                files: {
                    create: {
                        filePath: filePath,
                        fileName: file.name
                    }
                }
            },
            include: {
                files: {
                    select: {
                        id: true
                    }
                }
            }
        }).catch(async (error: { code: string; }) => {
            if (error.code == 'P2002') {
                const projectInfo = await prisma.project.findFirst({
                    where: {
                        projectName: projectName as string,
                        ownerId: Number(userId)
                    },
                    select: { id: true }
                })
                if (projectInfo) {
                    const fileCreationResult = await prisma.file.create({
                        data: { filePath: filePath, projectId: projectInfo.id, fileName: file.name, },
                    })
                    fileId = fileCreationResult.id
                }
            } else {
                throw error
            }
        })

        if (projectCreationResult != undefined) {
            fileId = projectCreationResult.files[0].id
        }

        // Save file 
        const fileStream = fs.createWriteStream(filePath)
        const fileArrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(fileArrayBuffer);
        fileStream.write(fileBuffer);
        fileStream.end();

        // Create image reconstruction job
        const newJob = await prisma.imageReconstructionJob.create({
            data: { fileId: fileId },
        })

        // Wait for the job to complete
        const job = await checkJobStatus(newJob.id);

        return NextResponse.json({ message: "Uploaded Sucessfull", jobStatus: job?.status })
    } catch (error) {
        console.log()
        console.log(error)
        console.log()

        return NextResponse.json({ message: "An error occured" }, { status: 400 });
    }
}

// Do not forget to limit the size of the uploaded files
// Checking the user's first connection should be done once a time, and then update the token in the middleware
// The middleware should be run on all the requests, I have a problem when I do that, the css seem to be deactivated
// If the user is in /ml-setup/fileId and he switches the project - Handle this
// The file's stated (annotated / unassigned) should not be based on the annotations presence, it should rely only if changes for the file are saved or not. Sometimes the image won't contain any label and it's normal.
// sideScanFileBrowser: Need to display color based on state (Unassigned / Annotated)


// Need to change the way i get project classes (should be directly selecting unique classes from the database) [DONE]
// Need to bring the classes based on all the available classes in the server, once the project is loaded, the classes are loaded also. [DONE]
// When a new class is added, the project classes have to be updated, just locally. When the project is going to be loaded again it gonna bring the new added classes. [DONE]
// If a user changes the selected file, there should be loading of the new annotations for the selected file [DONE]
// Need to fix the error I have in: ./app/(main)/ml-setup/[fileId]/page.tsx [FIXED]