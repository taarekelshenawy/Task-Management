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

export async function fetchTasks(projectId: string, 
  status: string,  searchValue:string,
   limit:number,
  offset:number,
) {
   let url=`/rest/v1/project_tasks?project_id=eq.${projectId}&status=eq.${status}&limit=${limit}
&offset=${offset}`;
  if(searchValue.trim()){
    url=`${url}&title=ilike.%25${searchValue}%25`
  }
  const res = await apiClient(
    getBaseUrl(
      url,
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

export const fetchAllTasks = async (
  projectId: string,
  limit: number,
  offset: number,
  searchValue:string,
) => {
  let url=`/rest/v1/project_tasks?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`;
  if(searchValue.trim()){
    url=`${url}&title=ilike.%25${searchValue}%25`
  }
  return apiClient(
    getBaseUrl(
      url
    ),
    {
      headers: {
       'Content-Type': 'application/json',
        Prefer: 'count=exact',
      },
    },
  );
};

export const getTaskDetails = async (projectId: string, taskId: string) => {
  try {
    const response = await apiClient(
      getBaseUrl(
        `/rest/v1/project_tasks?project_id=eq.${projectId}&id=eq.${taskId}`,
      ),
    );

    const data = await response.json();
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
