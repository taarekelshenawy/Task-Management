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
    console.log(data)
    const response = await apiClient(getBaseUrl('rest/v1/epics'), {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        project_id: data.project_id,
        assignee_id: data.assignee_id ?? null,
        deadline: data.deadline ?? null,
      }),
    });

    return response;
  } catch (error) {
    if (error instanceof Error) throw error;
   
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
