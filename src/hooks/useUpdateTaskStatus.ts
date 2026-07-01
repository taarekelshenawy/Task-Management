import { useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../services/taskService';
import type { TaskProps } from '../types/tasks';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export default function useUpdateTaskStatus(
  projectId: string,
  searchValue: string,
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      taskId,
      newStatus,
    }: {
      taskId: string;
      oldStatus: Status;
      newStatus: Status;
    }) =>
      updateTask(taskId, {
        status: newStatus,
      }),

    onMutate: async ({ taskId, oldStatus, newStatus }) => {
      await queryClient.cancelQueries({
        queryKey: ['tasks', projectId],
      });

      const previousOld = queryClient.getQueryData<TaskProps[]>([
        'tasks',
        projectId,
        oldStatus,
        searchValue,
      ]);

      const previousNew = queryClient.getQueryData<TaskProps[]>([
        'tasks',
        projectId,
        newStatus,
        searchValue,
      ]);

      const movedTask = previousOld?.find((task) => task.id === taskId);

      if (!movedTask) {
        return { previousOld, previousNew };
      }

      queryClient.setQueryData<TaskProps[]>(
        ['tasks', projectId, oldStatus, searchValue],
        (old = []) => old.filter((task) => task.id !== taskId),
      );

      queryClient.setQueryData<TaskProps[]>(
        ['tasks', projectId, newStatus, searchValue],
        (old = []) => [
          ...old,
          {
            ...movedTask,
            status: newStatus,
          },
        ],
      );

      return {
        previousOld,
        previousNew,
        oldStatus,
        newStatus,
      };
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ['tasks', projectId, context?.oldStatus, searchValue],
        context?.previousOld,
      );

      queryClient.setQueryData(
        ['tasks', projectId, context?.newStatus, searchValue],
        context?.previousNew,
      );

      toast.error('Failed to update status');
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', projectId],
      });
    },
  });
  return mutation;
}
