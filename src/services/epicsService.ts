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

type epicsProps = {
  projectId: string;
  limit?: number;
  offset?: number;
};
export const getProjectEpics = async ({
  projectId,
  limit,
  offset,
}: epicsProps) => {
  try {
    const response = await apiClient(
      getBaseUrl(
        `rest/v1/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`,
      ),
      {
        headers: {
          Prefer: 'count=exact',
        },
      },
    );

    return response;
  } catch (error) {
    if (error instanceof Error) throw error;
  }
};

export const getEpicDetails = async ({
  epicId,
  projectId,
}: {
  epicId: string;
  projectId: string;
}) => {
  try {
    const response = await apiClient(
      getBaseUrl(
        `rest/v1/project_epics?project_id:eq.${projectId}&id=eq.${epicId}`,
      ),
    );

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Failed to get Epic');
  }
};

export const updateEpicDetails = async ({
  epicId,
  payload,
}: {
  epicId: string;
  payload: {
    title: string;
    description: string;
    assignee_id: string;
    deadline: string;
  };
}) => {
  try {
    const response = await apiClient(
      getBaseUrl(`rest/v1/epics?id=eq.${epicId}`),
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Failed to get Epic');
  }
};
