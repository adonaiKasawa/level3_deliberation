//Store Import
import { store } from "../global";
import useAxios from "./useAxios";

interface HttpCore {
  url: string 
  method: string
  data?: any
  requireAuthorization: boolean 
}



export async function httpRequest(
  path: string ,
  method: string,
  data?: any
){
  const stateGlobale = store.getState();
  const {auth} = stateGlobale;
  const api = useAxios()
  const url = path
  const request = {
    url,
    method,
    // headers:{Authorization: `Bearer ${auth.access_token}`},
    data
  }      
  return await api(request).then(r => {
    if(r !== undefined)
    return r
    else 
    return null
  }
  ).catch(error => error)
}
