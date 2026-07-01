
import StatusColumn from './StatusColumn';
import { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { updateTaskStatus } from '../../services/taskService';
import { fetchTasks } from '../../services/taskService';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { STATUSES } from '../constants/constants';
import type { TaskProps } from '../../types/tasks';
import { toast } from 'react-toastify';


type Status = (typeof STATUSES)[number];
export default function BoardView({searchValue}:{searchValue:string}) {
//   const [searchValue, setSearchValue] = useState('');
  const LIMIT = 100;
  const OFFSET = 0;
     const { projectId } = useParams();

  const [tasksByStatus, setTasksByStatus] = useState<
    Record<Status, TaskProps[]>
  >({
    TO_DO: [],
    IN_PROGRESS: [],
    BLOCKED: [],
    IN_REVIEW: [],
    READY_FOR_QA: [],
    REOPENED: [],
    READY_FOR_PRODUCTION: [],
    DONE: [],
  });
  useEffect(() => {
    async function loadTasks() {
      if (!projectId) return;
      try {
        const [
          todo,
          inProgress,
          blocked,
          inReview,
          readyForQa,
          reopened,
          readyForProduction,
          done,
        ] = await Promise.all([
          fetchTasks(projectId, 'TO_DO', searchValue, LIMIT, OFFSET),
          fetchTasks(projectId, 'IN_PROGRESS', searchValue, LIMIT, OFFSET),
          fetchTasks(projectId, 'BLOCKED', searchValue, LIMIT, OFFSET),
          fetchTasks(projectId, 'IN_REVIEW', searchValue, LIMIT, OFFSET),
          fetchTasks(projectId, 'READY_FOR_QA', searchValue, LIMIT, OFFSET),
          fetchTasks(projectId, 'REOPENED', searchValue, LIMIT, OFFSET),
          fetchTasks(
            projectId,
            'READY_FOR_PRODUCTION',
            searchValue,
            LIMIT,
            OFFSET,
          ),
          fetchTasks(projectId, 'DONE', searchValue, LIMIT, OFFSET),
        ]);

        setTasksByStatus({
          TO_DO: todo,
          IN_PROGRESS: inProgress,
          BLOCKED: blocked,
          IN_REVIEW: inReview,
          READY_FOR_QA: readyForQa,
          REOPENED: reopened,
          READY_FOR_PRODUCTION: readyForProduction,
          DONE: done,
        });
      } catch (error) {
        console.error(error);
      }
    }

    loadTasks();
  }, [projectId, searchValue]);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    const previousTasks = tasksByStatus;

    if (!over) return;

    const taskId = active.id as string;
    const oldStatus = active.data.current?.status as Status;
    const newStatus = over.id as Status;

    if (oldStatus === newStatus) return;
    const movedTask = tasksByStatus[oldStatus].find(
      (task) => task.id === taskId,
    );

    if (!movedTask) return;

    setTasksByStatus((prev) => ({
      ...prev,

      [oldStatus]: prev[oldStatus].filter((task) => task.id !== taskId),

      [newStatus]: [
        ...prev[newStatus],
        {
          ...movedTask,
          status: newStatus,
        },
      ],
    }));

    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error: unknown) {
      setTasksByStatus(previousTasks);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  return (
   <div className="flex gap-4 overflow-x-auto max-sm:hidden">
             <DndContext onDragEnd={handleDragEnd}>
               {STATUSES.map((status) => (
                 <StatusColumn
                   key={status}
                   status={status}
                   tasks={tasksByStatus[status]}
                 />
               ))}
             </DndContext>
           </div>
  )
}
