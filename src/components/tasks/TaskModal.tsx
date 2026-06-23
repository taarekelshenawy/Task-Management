import { getInitials } from '../../utils/Helper';
import epicIcon from '../../assets/epicIcon.png';
import copyIcon from '../../assets/copyIcon.png';
import { useEffect, useState } from 'react';
import { getTaskDetails } from '../../services/taskService';
import type { CreateTaskPayload } from '../../types/tasks';

const statusStyles = {
  TO_DO: 'bg-gray-200 text-gray-700',
  'in progress': 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function TaskModal({ projectId, taskId }) {
  const [isMobile, setIsMobile] = useState(false);
  const [task, setTask] = useState<CreateTaskPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  //   const status = task?.status?.toLowerCase();

  useEffect(() => {
    if (!projectId || !taskId) return;

    const fetchTask = async () => {
      setLoading(true);
      setError(false);

      try {
        const data = await getTaskDetails(projectId, taskId);
        setTask(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [projectId, taskId]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    handleResize(); // أول render

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <div className="flex md:max-w-4xl w-full bg-white">
        {/* LEFT SIDE */}
        <div className="flex-2 p-7">
          {/* MOBILE HEADER */}
          {isMobile && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-primary font-bold w-19 text-center rounded h-5 bg-surface-high">
                <p>{task.task_id || '-'}</p>
              </p>

              <button className="text-lg font-bold">✕</button>
            </div>
          )}

          <div>
            {!isMobile && (
              <div className="flex items-center gap-2">
                <p className="text-primary font-bold w-19 text-center rounded h-5 bg-surface-high">
                  {task.task_id || '-'}
                </p>
                <div className="flex items-center">
                  <img src={epicIcon} />
                  <p className="ml-2">
                    {task.epic_id.epic_id} (Core UI Overhaul)
                  </p>
                </div>
              </div>
            )}

            <h1 className="font-bold text-3xl mt-3 max-sm:text-2xl">
              {task.title}
            </h1>
          </div>

          {isMobile && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {/* Assignee */}
              <div className="p-2 bg-surface-low flex flex-col gap-2">
                <p className="font-bold">Assignee</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-surface-high flex items-center justify-center">
                    {getInitials(task?.assignee?.name)}
                  </div>
                  <p className="text-sm">{task?.assignee?.name}</p>
                </div>
              </div>

              {/* Due Date */}
              <div className="p-2 bg-surface-low flex flex-col gap-1">
                <p className="text-xs text-gray-500">Due Date</p>
                {/* <p >22 Oct 2025</p> */}
                <p className="text-sm">{formatDate(task.due_date)}</p>
              </div>

              {/* Reporter */}
              <div className="p-2 bg-surface-low flex flex-col gap-2">
                <p className="font-bold">Reporter</p>
                <p className="text-sm">{task?.assignee?.name}</p>
              </div>

              {/* Created At */}
              <div className="p-2 bg-surface-low flex flex-col gap-1">
                <p className="text-xs text-gray-500">Created At</p>
                {/* <p >22 Oct 2025</p> */}
                <p className="text-sm">{formatDate(task.created_at)}</p>
              </div>
            </div>
          )}

          {/* DESCRIPTION (LAST in mobile) */}
          <div className={`flex flex-col gap-4 ${isMobile ? 'mt-6' : 'mt-16'}`}>
            <h3 className="font-bold text-secondary">Description</h3>
            <p className="font-medium leading-6">
              {task.description || 'No description'}
            </p>
          </div>

          {/* FOOTER */}
          {!isMobile && (
            <div className="mt-32 flex justify-between ">
              <div className="flex items-center gap-2">
                <img src={copyIcon} />
                <p>Copy link</p>
              </div>
              <button className="bg-surface-high w-18 h-7 cursor-pointer">
                close
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        {!isMobile && (
          <div className="bg-slate-lighter flex-1 p-7 flex flex-col gap-7">
            <span
              className={`px-2 py-1 text-xs rounded ${statusStyles[task.status]}`}
            >
              {task.status}
            </span>
            {task?.assignee?.name ? (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-surface-high flex items-center justify-center">
                  {getInitials(task?.assignee?.name)}
                </div>
                <p className="text-sm">{task?.assignee?.name}</p>
              </div>
            ) : (
              <p className="text-sm">Unassigned</p>
            )}
            {/* <div className="flex flex-col gap-4">
              <p className="font-bold">Assignee</p>
              <div className="flex items-center gap-3 bg-white p-2">
                <div className="w-7 h-7 rounded-full bg-surface-high flex justify-center items-center">
                  {getInitials('Mahmoud Taha')}
                </div>
                <div>
                  <p>Mahmoud Taha</p>
                  <p>Senior Frontend Engineer</p>
                </div>
              </div>
            </div> */}

            <div className="flex flex-col gap-4">
              <p>Reporter</p>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-surface-high flex justify-center items-center">
                  {getInitials(`${task?.assignee?.name}`)}
                </div>
                <div>
                  <p>{task?.assignee?.name}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <p>Due Date</p>
                <p>{new Date(task.due_date).toDateString()}</p>
              </div>
              <div className="flex justify-between">
                <p>Created At</p>
                <p>{new Date(task.created_at).toDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
