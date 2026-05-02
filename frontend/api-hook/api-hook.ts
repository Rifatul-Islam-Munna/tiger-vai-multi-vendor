"use server"


import axios from "axios"
import { AxiosError } from "axios"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { cookies } from "next/headers"
import { redirect } from 'next/navigation'



export const getToken = async ()=>{
    const access_token = (await cookies()).get("access_token")?.value
  
    return {access_token}
}

const baseUrl = process.env.BASE_URL
const DEFAULT_REVALIDATE_SECONDS = 300

type AxiosErrorPayload = {
  message?: unknown;
  error?: string;
  statusCode?: number;
};

function normalizeRevalidateTags(revalidateTags: string | string[]) {
  return Array.isArray(revalidateTags) ? revalidateTags : [revalidateTags];
}

function getAutoRevalidateTags(url: string) {
  const path = url.split("?")[0];

  if (path === "/category") return ["categories"];
  if (path === "/get-top-category") return ["categories", "top-categories"];
  if (path === "/brand") return ["brands"];
  if (path === "/get-top-brand") return ["brands", "top-brands"];
  if (path.startsWith("/product")) return ["products"];

  return [];
}

function parseAxiosError(error: AxiosError<AxiosErrorPayload>): { message: string, statusCode: number } {
  const res = error?.response?.data;
  const statusCode = res?.statusCode ?? 500;

  let message = 'Something went wrong';
  const rawMessage = res?.message;

  console.log("Parsing axios error:", res);

  // Handle different error response formats from NestJS
  if (rawMessage) {
    // Format 1: message is an array (class-validator errors)
    if (Array.isArray(rawMessage)) {
      message = rawMessage.join(', ');
    }
    // Format 2: message.message is an array
    else if (
      typeof rawMessage === "object" &&
      rawMessage !== null &&
      Array.isArray((rawMessage as { message?: unknown }).message)
    ) {
      message = ((rawMessage as { message: string[] }).message).join(', ');
    }
    // Format 3: message is a string
    else if (typeof rawMessage === 'string') {
      message = rawMessage;
    }
    // Format 4: message.message is a string
    else if (
      typeof rawMessage === "object" &&
      rawMessage !== null &&
      typeof (rawMessage as { message?: unknown }).message === 'string'
    ) {
      message = (rawMessage as { message: string }).message;
    }
    // Format 5: message is an object with multiple errors
    else if (typeof rawMessage === 'object') {
      const messages = Object.values(rawMessage as Record<string, unknown>).flat();
      message = messages.length ? messages.join(', ') : JSON.stringify(rawMessage);
    }
  }

  // If we still don't have a good message, try the error field
  if (message === 'Something went wrong' && res?.error) {
    message = res.error;
  }

  console.log("Parsed error message:", message);

  return { message, statusCode };
}

export const PostRequestAxios = async <T>(url: string, payload: unknown) : Promise<[T | null, { message: string; statusCode: number } | null]> => {
    const {access_token} = await getToken()
    try{
        const {data} = await axios.post<T>(`${baseUrl}${url}`, payload,{
            headers:{
                access_token:access_token,
            
            }
            
        })
        return [data,null];

    }catch(error ){
        if (axios.isAxiosError<AxiosErrorPayload>(error)) {
            if (error.status === 401) {
                throw redirect('/auth/login')
                
                }
                console.log("error->",error.response?.data)
               
             const meg = parseAxiosError(error);
             

    return [null, meg]; 
        }
          if (isRedirectError(error)) throw error;
       
        return [null, null];
    }
}
export const PatchRequestAxios = async <T>(url: string, payload: unknown) : Promise<[T | null, { message: string; statusCode: number } | null]> => {
    const {access_token} = await getToken()
    try{
        const {data} = await axios.patch(`${baseUrl}${url}`, payload,{
            headers:{
                access_token:access_token,
            
            }
            
        })
       return [ data,null]

    }catch(error ){
        if (axios.isAxiosError<AxiosErrorPayload>(error)) {
            if (error.status === 401 || error.status === 403) {
                throw redirect('/auth/login')
                
                }
                console.log("error->",error.response?.data)
               
             const meg = parseAxiosError(error);
             

        return [null, meg]; 
        }
        if (isRedirectError(error)) throw error;
       
       return [null, null];
    }
}
export const GetRequestAxios = async <T>(url: string, ) : Promise<[T | null, AxiosError | null]> => {
    try{
        const {data} = await axios.get(`${baseUrl}${url}`)
        return [data,null];

    }catch(error ){
        if (axios.isAxiosError(error)) {
            return [null, error]; 
        }
       
        return [null, null];
    }
}
export const GetRequestNormal = async <T>(url: string,revalidate=DEFAULT_REVALIDATE_SECONDS ,revalidateTags: string | string[] = "stumaps") : Promise<T> => {
    const {access_token} = await getToken()

    try{
        const tags = Array.from(
          new Set([...normalizeRevalidateTags(revalidateTags), ...getAutoRevalidateTags(url)])
        );

        const response = await fetch(`${baseUrl}${url}`,{next:{revalidate:revalidate,tags},headers:{

                access_token:access_token ? access_token : '',



        }})
       if (response.ok) {
      const data = await response.json()
       console.log("data",data)
      return data
    } else {
        console.log("response",response.status)
      if (response.status === 401 || response.status === 403) {
       throw redirect('/auth/login')
      }
   
      const errorPayload = await response.json()
      console.log("error",errorPayload)
     throw new Error(errorPayload.message)
    }

    }catch(error ){
          if (isRedirectError(error)) throw error;
       if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Unknown error")
     
           
            
         
         
        
       
      
    }
}

export const DeleteRequestAxios = async <T>(url: string): 
  Promise<[T | null, { message: string; statusCode: number } | null]> => {
    
    const { access_token } = await getToken();

    try {
        const { data } = await axios.delete<T>(`${baseUrl}${url}`, {
            headers: {
                access_token: access_token,
            },
        });

        return [data, null];

    } catch (error) {

        if (axios.isAxiosError<AxiosErrorPayload>(error)) {

            if (error.status === 401) {
                throw redirect('/auth/login');
            }

            console.log("error->", error.response?.data);

            const meg = parseAxiosError(error);

            return [null, meg];
        }

        if (isRedirectError(error)) throw error;

        return [null, null];
    }
};
