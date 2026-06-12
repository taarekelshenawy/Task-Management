import { apiClient } from '../utils/apiClient';
import getBaseUrl from '../utils/api';

export const createNewEpic = async (data: {

    assignee_id: string;
    project_id: string;
    deadline: string;
    title: string;
    description: string;


}) => {
  try {
    const response = await apiClient(getBaseUrl('rest/v1/epics'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        project_id: data.project_id,
        assignee_id: data.assignee_id ?? null,
        deadline: data.deadline ?? null,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        result?.message || result?.error || 'Failed to create epic',
      );
    }

    return result;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Failed to create epic');
  }
};

export const getProjectEpics = async (projectId: string) => {
  try {
    const response = await apiClient(
      getBaseUrl(`rest/v1/project_epics?project_id=eq.${projectId}`),
    );

    const data = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) throw error;

  }
};
