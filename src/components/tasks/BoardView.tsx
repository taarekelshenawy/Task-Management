import StatusColumn from './StatusColumn';
import { DndContext } from '@dnd-kit/core';
import { useParams } from 'react-router-dom';
import { STATUSES } from '../constants/constants';
import useGetAllTasks from '../../hooks/useGetAllTasks';
import useUpdateTaskStatus from '../../hooks/useUpdateTaskStatus';

type Status = (typeof STATUSES)[number];
export default function BoardView({ searchValue }: { searchValue: string }) {
  const limit = 100;
  const offset = 0;
  const { projectId } = useParams();
  const updateTaskStatusMutation = useUpdateTaskStatus(projectId!, searchValue);

  const queries = useGetAllTasks(projectId!, searchValue, limit, offset);
  const tasksByStatus = {
    TO_DO: queries[0].data ?? [],
    IN_PROGRESS: queries[1].data ?? [],
    BLOCKED: queries[2].data ?? [],
    IN_REVIEW: queries[3].data ?? [],
    READY_FOR_QA: queries[4].data ?? [],
    REOPENED: queries[5].data ?? [],
    READY_FOR_PRODUCTION: queries[6].data ?? [],
    DONE: queries[7].data ?? [],
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const oldStatus = active.data.current?.status as Status;
    const newStatus = over.id as Status;

    if (oldStatus === newStatus) return;

    updateTaskStatusMutation.mutate({
      taskId,
      oldStatus,
      newStatus,
    });
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
  );
}
