import { useQueries } from '@tanstack/react-query';
import { STATUSES } from '../components/constants/constants';
import { fetchTasks } from '../services/taskService';

export default function useGetAllTasks(
  projectId: string,
  searchValue: string,
  limit: number,
  offset: number,
) {
  return useQueries({
    queries: STATUSES.map((status) => ({
      queryKey: ['tasks', projectId, status, searchValue],
      queryFn: () => fetchTasks(projectId, status, searchValue, limit, offset),
      enabled: !!projectId,
    })),
  });
}
