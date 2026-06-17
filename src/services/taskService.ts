import { apiClient } from "../utils/apiClient";
import getBaseUrl from "../utils/api";

const getEpicTasks =async(epicId:string)=>{
    try{
        const response = await apiClient(
        getBaseUrl(`/rest/v1/project_tasks?epic_id=eq.${epicId}`));
        const data = await response.json();
        return data

    }catch(error){
        throw new Error(error.message)

    }

}

// api.ts
export async function fetchTasks(projectId: string, status: string) {
    console.log(projectId,status)
  const res = await apiClient(getBaseUrl(`/rest/v1/project_tasks?project_id=eq.${projectId}&status=eq.${status}`)) 
const data = await res.json()

  return data;
}

export default getEpicTasks;