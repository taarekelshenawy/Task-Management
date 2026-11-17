type Project = {
  project_name: string;
  tasks_count: number;
};

type ProjectProps = {
  project: Project;
};

export default function ProjectCounts({ project }: ProjectProps) {
  return (
    <div
      key={project.project_name}
      className="flex items-center justify-between rounded-lg"
    >
      <div className="flex items-center justify-between w-full gap-16 max-sm:text-[10px] font-bold">
        <p className=" text-slate-dark">{project.project_name}</p>

        <p>{project.tasks_count} Tasks</p>
      </div>
    </div>
  );
}
