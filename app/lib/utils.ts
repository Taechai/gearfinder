import prisma from "@/app/lib/prisma";

export const validateProject = async (userId: number, projectName: string) => {
    const userProjects = await prisma.user.findFirst({
        where: { id: userId },
        select: {
            projectsOwned: {
                where: { projectName: projectName },
                select: { projectName: true, id: true }
            },
            accessibleProjects: {
                where: { projectName: projectName },
                select: { projectName: true, id: true }
            }
        }
    })
    // const isValidProject = userProjects!.projectsOwned.length > 0 || userProjects!.accessibleProjects.length > 0;

    if (!userProjects) return false;

    const ownedProjectId = userProjects.projectsOwned[0]?.id;
    const accessibleProjectId = userProjects.accessibleProjects[0]?.id;

    return ownedProjectId ?? accessibleProjectId ?? false;

}