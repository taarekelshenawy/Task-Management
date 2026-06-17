// export type Task = {
//   id: string;
//   title: string;
//   status: string;
// };
import type { TaskProps } from "../../types/tasks";

export default function TaskCard({ task }:{task:TaskProps}) {

  const initials = task.assignee.name
    ? task.assignee.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'UN';

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border hover:shadow-md transition">
      {/* Title */}
      <p className="text-sm font-medium">{task.title}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        {/* Date */}
        <span>
          {task.due_date
            ? new Date(task.due_date).toLocaleDateString()
            : 'No date'}
        </span>

        {/* Avatar initials */}
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white font-semibold">
          {initials}
        </div>
      </div>
    </div>
  );
}
