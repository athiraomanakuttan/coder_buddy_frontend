import { TechnologyType } from "@/types/types";
import axios from "axios";
import { toast } from "react-toastify"
const API_URL = process.env.NEXT_PUBLIC_API_URI

export const createNewTechnology = async (token: string, title: string)=>{
    try {
        const response =  await axios.post(`${API_URL}/api/admin/create-technology`,{title},{headers:{Authorization:`Bearer ${token}`}})
        return response.data
    } catch (error) {
        toast.error("unable to create technology")
    }
}

export const getTechnologies = async (token: string, page:number=1, limit:number=5)=>{
    try {
        const response = await axios.get(`${API_URL}/api/admin/get-technology`,{params:{page,limit},headers:{Authorization:`Bearer ${token}`}})
        return response.data
    } 
    catch (error) {
        console.log(error)
    }
}

export const UpdateTechnologies = async (token: string,id: string, data : TechnologyType)=>{
    try {
        const response = await axios.put(`${API_URL}/api/admin/update-technology`,{id,...data},{headers
            :{Authorization: `Bearer ${token}`}
        })
        return response.data
    } catch (error) {
        console.log("error",error)
    }
}