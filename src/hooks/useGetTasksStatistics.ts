import { useQuery } from '@tanstack/react-query';
import { getTasksCalendarStats } from '../services/statisticsService';

export default function useGetTaskStatistics(
  startDate: string,
  endDate: string,
  projectId: string | null,
  status: string | null,
) {
  return useQuery({
    queryKey: ['task-statistics', startDate, endDate, projectId, status],

    queryFn: () =>
      getTasksCalendarStats({
        p_start_date: startDate,
        p_end_date: endDate,
        p_project_id: projectId,
        p_status: status,
      }),
  });
}
