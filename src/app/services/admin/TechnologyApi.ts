import { TechnologyType } from "@/types/types";
import { toast } from "react-toastify"
import axiosInstance from "./adminAxiosInstance";

export const createNewTechnology = async (title: string)=>{
    try {
        const response =  await axiosInstance.post(`/api/admin/create-technology`,{title})
        return response.data
    } catch (error) {
        console.log(error)
        toast.error("unable to create technology")
    }
}

export const getTechnologies = async (page:number=1, limit:number=5)=>{
    try {
        const response = await axiosInstance.get(`/api/admin/get-technology`,{params:{page,limit}})
        return response.data
    } 
    catch (error) {
        console.log(error)
    }
}

export const UpdateTechnologies = async (id: string, data : TechnologyType)=>{
    try {
        const response = await axiosInstance.put(`/api/admin/update-technology`,{id,...data})
        return response.data
    } catch (error) {
        console.log("error",error)
    }
}
