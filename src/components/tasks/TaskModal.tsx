import { useEffect, useState } from 'react';
import { getTaskDetails } from '../../services/taskService';
import type { TaskDetailsProps } from '../../types/tasks';
import TaskDetails from './TaskDetails';

export default function TaskModal({
  projectId,
  taskId,
  setOpenModal,
}: {
  projectId: string;
  taskId: string;
  setOpenModal: (e: boolean) => void;
}) {
  const [task, setTask] = useState<TaskDetailsProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!projectId || !taskId) return;
    const fetchTask = async () => {
      setLoading(true);
      setError(false);

      try {
        const data = await getTaskDetails(projectId, taskId);
        setTask(data);
      } catch (error: unknown) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [projectId, taskId]);

  // ui loading and error
  if (loading) {
    return (
      <div className="z-50 fixed inset-0 flex items-center justify-center bg-black/40 text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="z-50 fixed inset-0 flex items-center justify-center bg-black/40 text-white">
        Failed to load task details
      </div>
    );
  }

  if (!task) {
    return (
      <div className="z-50 fixed inset-0 flex items-center justify-center bg-black/40 text-white">
        Task not found
      </div>
    );
  }

  return (
    <div className="z-50 px-6 py-4 flex flex-col justify-center items-center max-sm:justify-end max-sm:p-0 fixed top-0 inset-0 bg-black/35 ">
      <TaskDetails task={task} setTask={setTask} setOpenModal={setOpenModal} />
    </div>
  );
}
