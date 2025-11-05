"use server"

import { PostRequestAxios } from "@/api-hook/api-hook"

export const uploadCategory= async (fromData:FormData)=>{
    const [data,error] = await PostRequestAxios<{url:string,key:string}>(`/upload-service/single`,fromData)
    return {data,error}
}

export const createCategory = async (payload: any) => {
  const [data, error] = await PostRequestAxios("/category", payload);
  return { data, error }
};