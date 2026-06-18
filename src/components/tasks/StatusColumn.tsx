import { useEffect, useState } from 'react';
import { fetchTasks } from '../../services/taskService';
import TaskCard from './TaskCard';
import { useNavigate, useParams } from 'react-router-dom';
import type { TaskProps } from '../../types/tasks';

export default function StatusColumn({ status }: { status: string }) {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) return;

    fetchTasks(projectId, status).then(setTasks);
  }, [projectId, status]);

  return (
    <div className="bg-gray-100 rounded-xl p-3 w-72 shrink-0 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">{status}</h2>

        <button
          onClick={() =>
            navigate(
              `/project/${projectId}/tasks/new?status=${encodeURIComponent(status)}`,
            )
          }
          className="text-lg font-bold text-blue-600 hover:text-blue-800"
        >
          +
        </button>
      </div>
      <div className="w-full h-13 border-2 border-dashed border-gray-400 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 transition">
        <span className="text-gray-500 font-medium">+ ADD NEW TASK</span>
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
