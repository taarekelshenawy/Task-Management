import { apiClient } from '../utils/apiClient';
import getBaseUrl from '../utils/api';
export async function getTasksCalendarStats(data: {
  p_start_date: string;
  p_end_date: string;
  p_project_id: string | null;
  p_status: string | null;
}) {
  const response = await apiClient(
    getBaseUrl('rest/v1/rpc/get_tasks_calendar_stats'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch statistics');
  }

  return response.json();
}
