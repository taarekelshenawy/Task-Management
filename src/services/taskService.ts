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

export default getEpicTasks;