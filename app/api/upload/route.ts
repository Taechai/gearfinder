import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import path from 'path';
import fs from 'fs';
import prisma from "@/app/lib/prisma";
import { v4 as uuidv4 } from 'uuid';

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

    // Save file metadata
    try {
        const userId = token.id
        await prisma.project.create({
            data: {
                projectName: projectName as string,
                ownerId: Number(userId),
                files: {
                    create: {
                        filePath: filePath,
                        fileName: file.name
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
                    await prisma.file.create({
                        data: { filePath: filePath, projectId: projectInfo.id, fileName: file.name }
                    })
                }
            } else {
                throw error
            }
        })


        // Save file 
        const fileStream = fs.createWriteStream(filePath)
        const fileArrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(fileArrayBuffer);
        fileStream.write(fileBuffer);
        fileStream.end();

        console.log("\nCreated Successfully\n")
    } catch (error) {
        console.log("An Error Occured:")
        console.log(file.name)
        return NextResponse.json({ message: "An error occured" }, { status: 400 });
    }


    return NextResponse.json({ message: "Uploaded Sucessfull" })
}

// Do not forget to limit the size of the uploaded files
// Checking the user's first connection should be done once a time, and then update the token in the middleware
// The middleware should be run on all the requests, I have a problem when I do that, the css seem to be deactivated
// If a user changes the selected file, there should be loading of the new annotations for the selected file


// Need to fix the error I have in: ./app/(main)/ml-setup/[fileId]/page.tsx [FIXED]