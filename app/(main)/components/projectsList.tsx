"use client";
import ListBox from "@/app/components/listBox";
import { useRecoilState, useSetRecoilState } from "recoil";
import { currentProjectAtom, projectFilesAtom } from "../projectAtom";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Project {
  name: string;
}

export default function ProjectsList({
  currentProjectValue,
}: {
  currentProjectValue: string | undefined;
}) {
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectAtom);
  const setProjectFiles = useSetRecoilState(projectFilesAtom);
  const [projectsList, setProjectsList] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects/project-list", {
      method: "GET",
    })
      .then((res) => res.json())
      .then(({ projectsList }: { projectsList: Project[] }) => {
        setProjectsList(projectsList);
        if (projectsList.length > 0) {
          const selectedProject = projectsList.find(
            (project) => project.name === currentProjectValue
          );
          if (selectedProject) {
            setCurrentProject(selectedProject);
          } else {
            setCurrentProject(projectsList[0]);
          }
        }
      });
  }, []);
  const router = useRouter();
  const pathname = usePathname();
  const id = useSearchParams().get("id");
  useEffect(() => {
    if (currentProject.name !== "" && currentProject.name !== undefined) {
      fetch("/api/projects/set-current-project", {
        method: "POST",
        body: JSON.stringify({ currentProject }),
      })
        .then((res) => res.json())
        .then((data) => {
          setProjectFiles(data.files);
          const fileIds = data.files
            .filter(({ id }: { id: string }) => id == id)
            .map(({ fileId }: { fileId: string }) => `${fileId}`);
          if (!fileIds.includes(id)) {
            if (pathname.includes("/gear-detection")) {
              router.replace("/gear-detection");
            }
          }
        });
    }
  }, [currentProject]);

  if (projectsList.length === 0) return <></>;

  return (
    <ListBox
      items={projectsList}
      selected={currentProject}
      setSelected={setCurrentProject}
    />
  );
}
