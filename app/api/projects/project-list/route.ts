import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
    const token = await getToken({ req: request });
    if (!token) {
        return NextResponse.json({ message: "Unauthorized action. Please login to upload." }, { status: 401 });
    }
    const userId = Number(token.id);
    const projectsList = await prisma.user.findFirst({
        where: { id: userId },
        select: {
            projectsOwned: { select: { projectName: true } },
            accessibleProjects: { select: { projectName: true } }
        }
    });

    if (!projectsList) {
        return NextResponse.json({ message: "No projects found for the user." }, { status: 404 });
    }

    const projects = [
        ...projectsList.projectsOwned,
        ...projectsList.accessibleProjects
    ];

    return NextResponse.json({ projectsList: projects.map(({ projectName }) => ({ name: projectName })) });
}
