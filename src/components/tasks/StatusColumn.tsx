import TaskCard from './TaskCard';
import { useNavigate, useParams } from 'react-router-dom';
import type { TaskProps } from '../../types/tasks';
import { Link } from 'react-router-dom';
import { statusColor } from '../constants/constants';
import { useDroppable } from '@dnd-kit/core';

type StatusColumnProps = {
  status: string;
  tasks: TaskProps[];
};

export default function StatusColumn({ status, tasks }: StatusColumnProps) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  console.log(tasks);

  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className="rounded-xl p-3 w-72 shrink-0 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              statusColor[status as keyof typeof statusColor]
            }`}
          />

          <span className="text-sm font-semibold">{status}</span>

          <span className="w-5 h-5 rounded text-center bg-gray-400 text-white">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() =>
            navigate(
              `/project/${projectId}/tasks/new?status=${encodeURIComponent(
                status,
              )}`,
            )
          }
          className="text-lg font-bold text-blue-600 cursor-pointer"
        >
          +
        </button>
      </div>

      <div className="w-full h-13 border-2 border-dashed border-gray-400 rounded flex items-center justify-center cursor-pointer">
        <Link to={`/project/${projectId}/tasks/new`}>
          <span className="text-gray-500 font-medium">+ ADD NEW TASK</span>
        </Link>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {tasks?.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
