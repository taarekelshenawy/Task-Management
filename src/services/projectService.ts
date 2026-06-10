import { apiClient } from '../utils/apiClient';
import getBaseUrl from '../utils/api';

export const CreateProject = async (data: {
  name: string;
  description: string;
}) => {
  try {
    const response = await apiClient(getBaseUrl('rest/v1/projects'), {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        description: data.description,
      }),
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Unknown error');
  }
};

export const GetProjects = async (data) => {
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

    throw new Error('Unknown error');
  }
};
