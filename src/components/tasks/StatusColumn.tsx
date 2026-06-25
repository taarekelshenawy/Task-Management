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

  const statusColor={
     'TO_DO':"bg-slate-md/20",
  'IN_PROGRESS':"bg-primary",
  'BLOCKED':"bg-[#BA1A1A]",
  'IN_REVIEW':'bg-[#4F5F7B]',
  'READY_FOR_QA':"bg-[#4F5F7B]",
  'REOPENED':"bg-[#4F5F7B]",
  'READY_FOR_PRODUCTION':"bg-[#4F5F7B]",
  'DONE':"bg-[#4F5F7B]",
  }

  return (
    <div className="rounded-xl p-3 w-72 shrink-0 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
       <div className="flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${status ? statusColor[status as keyof typeof statusColor] :""}`}></span>
        <span className="text-sm font-semibold">{status}</span>
        <span className={`w-5 h-5 rounded text-center bg-gray-400 text-white`}>{tasks.length}</span>
      </div>
        {/* <h2 className="text-sm font-semibold">{status}</h2> */}

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
