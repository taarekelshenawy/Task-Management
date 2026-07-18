export function getInitials(name: string): string {
  if (!name) return '';

  const words = name.trim().split(' ').filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (words[0][0] + words[1][0]).toUpperCase();
}

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

import { updateTask } from '../services/taskService';
import { toast } from 'react-toastify';
import type { TaskDetailsProps } from '../types/tasks';

type Member = {
  id: string;
  project_id: string;
  user_id: string;
  role?: string;
  email: string;
  member_id: string;
  metadata: { name: string };
};

export async function handleTaskUpdate(
  taskId: string,
  setTask: React.Dispatch<React.SetStateAction<TaskDetailsProps | null>>,
  value: string | null,
  field: string,
  members?: Member[],
) {
  try {
    await updateTask(taskId, {
      [field]: value,
    });

    setTask((prev) => {
      
      if (!prev) return prev;

      if (field === 'assignee_id') {
        const selectedMember = members?.find((m) => m.user_id === value);

        return {
          ...prev,
          assignee: selectedMember
            ? {
                id: selectedMember.user_id,
                name: selectedMember.metadata.name,
              }
            : null,
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });

    toast.success(`task ${field} updated`);
  } catch {
    toast.error(`Failed to update ${field}`);
  }
}
