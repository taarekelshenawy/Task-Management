import { apiClient } from "../utils/apiClient"
import getBaseUrl from "../utils/api";

export const CreateProject =async(data:{name:string,description:string})=>{
  try {
    const response = await apiClient(getBaseUrl("rest/v1/projects"), {
      method: "POST",
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

}