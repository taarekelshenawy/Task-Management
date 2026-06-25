import { useState } from 'react';
import type { TaskProps } from '../../types/tasks';
import { getInitials } from '../../utils/Helper';
import TaskModal from './TaskModal';
import { useParams } from 'react-router-dom';

export default function TaskCard({ task }: { task: TaskProps }) {
  const [openModal, setOpenModal] = useState(false);
  const { projectId } = useParams();
  console.log('openModal', openModal);
  return (
    <>
      <div
        onClick={() => setOpenModal(true)}
        className="bg-white cursor-pointer flex flex-col gap-5 p-3 rounded-lg shadow-sm  hover:shadow-md transition"
      >
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
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-primary text-white font-semibold">
            {getInitials(task.assignee.name)}
          </div>
        </div>
      </div>
      {openModal ? (
        <TaskModal
          projectId={projectId!}
          taskId={task.id}
          setOpenModal={setOpenModal}
        />
      ) : (
        ''
      )}
    </>
  );
}
