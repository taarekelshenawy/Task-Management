export default function ProjectCounts({ project }) {
  return (
    <div
      key={project.project_name}
      className="flex items-center justify-between min-w-72 rounded-lg p-4"
    >
      <div className="flex items-center gap-16">
        <p className="font-semibold text-slate-dark">{project.project_name}</p>

        <p className="text-sm font-bold">{project.tasks_count} Tasks</p>
      </div>
    </div>
  );
}
