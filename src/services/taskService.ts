import { apiClient } from '../utils/apiClient';
import getBaseUrl from '../utils/api';

const getEpicTasks = async (epicId: string) => {
  try {
    const response = await apiClient(
      getBaseUrl(`/rest/v1/project_tasks?epic_id=eq.${epicId}`),
    );
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
};

export async function fetchTasks(projectId: string, status: string) {
  const res = await apiClient(
    getBaseUrl(
      `/rest/v1/project_tasks?project_id=eq.${projectId}&status=eq.${status}`,
    ),
  );
  const data = await res.json();

  return data;
}

export const createNewTask = async (payload: {
  project_id: string;
  epic_id: string;
  title: string;
  description: string;
  assignee_id?: string;
  due_date: string;
  status: string;
}) => {
  try {
    const response = await apiClient(getBaseUrl('/rest/v1/tasks'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          data?.details ||
          'Failed to create task',
      );
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
};

export async function fetchAllTasks(projectId: string) {
  const res = await apiClient(
    getBaseUrl(`/rest/v1/project_tasks?project_id=eq.${projectId}`),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const data = await res.json();

  return data;
}

export const getTaskDetails = async (projectId: string, taskId: string) => {
  try {
    const response = await apiClient(
      getBaseUrl(
        `/rest/v1/project_tasks?project_id=eq.${projectId}&id=eq.${taskId}`
      )
    );

    const data = await response.json();

    // لأن الـ API بيرجع array فيها عنصر واحد
    return data?.[0] || null;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
};

export default getEpicTasks;
