"use client";
import ListBox from "@/app/components/listBox";
import { useRecoilState } from "recoil";
import { currentProjectAtom } from "../projectAtom";
import { useEffect, useState } from "react";

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
          console.log("Selected project:", selectedProject);
          if (selectedProject) {
            setCurrentProject(selectedProject);
          } else {
            setCurrentProject(projectsList[0]);
          }
        }
      });
  }, []);

  useEffect(() => {
    if (currentProject.name !== "" && currentProject.name !== undefined) {
      fetch("/api/projects/set-current-project", {
        method: "POST",
        body: JSON.stringify({ currentProject }),
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
