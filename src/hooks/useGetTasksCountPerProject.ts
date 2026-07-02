import { useQuery } from '@tanstack/react-query';
import { getTasksCountPerProject } from '../services/statisticsService';

interface ProjectTasksCount {
  project_name: string;
  tasks_count: number;
}
export default function useGetTasksCountPerProject(
  startDate: string,
  endDate: string,
) {
  return useQuery<ProjectTasksCount[]>({
    queryKey: ['tasks-count-per-project', startDate, endDate],

    queryFn: () =>
      getTasksCountPerProject({
        p_start_date: startDate,
        p_end_date: endDate,
      }),

    enabled: !!startDate && !!endDate,
  });
}
