import { GetRequestNormal, PostRequestAxios } from "@/api-hook/api-hook";

export const postNewProduct = async (payload:any) => {
    const [data, error] = await PostRequestAxios("/product/create",payload)
    return {data, error}
    
}


