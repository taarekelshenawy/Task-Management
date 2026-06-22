import { apiClient } from '../utils/apiClient';
import getBaseUrl from '../utils/api';

export const CreateProject = async (data: {
  name: string;
  description: string;
}) => {
  try {
    const response = await apiClient(getBaseUrl('rest/v1/projects'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        result?.message ||
          result?.error ||
          result?.hint ||
          'Failed to create project',
      );
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('No response returned from server');
  }
};

export const GetProjects = async (data: { limit: number; offset: number }) => {
  const { limit, offset } = data;
  try {
    const response = await apiClient(
      getBaseUrl(`rest/v1/rpc/get_projects?limit=${limit}&offset=${offset}`),
      {
        method: 'POST',
        headers: {
          Prefer: 'count=exact',
        },
      },
    );

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('No response returned from server');
  }
};

export const handleEditProject = async (data: {
  name: string;
  description: string;
  projectId: string;
}) => {
  try {
    const response = await apiClient(
      getBaseUrl(`rest/v1/projects?id=eq.${data.projectId}`),
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
        }),
      },
    );

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('No response returned from server');
  }
};

export const getProjectDetails = async (data: { projectId: string }) => {
  try {
    const response = await apiClient(
      getBaseUrl(`rest/v1/projects?id=eq.${data.projectId}`),
      {},
    );

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('No response returned from server');
  }
};
