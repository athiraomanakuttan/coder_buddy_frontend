import axios from "axios";
import { headers } from "next/headers";
import { toast } from "react-toastify";
const API_URI = process.env.NEXT_PUBLIC_API_URI;

export const  getPaymentsList = async (token: string)=>{
    if(!token){
        toast.error("session expired. Please login")
        return
    }
    try {
        const response =  await axios.get(`${API_URI}/api/payment/get-payments`,{
            headers:{Authorization:`Bearer ${token}`}
        })
        return response.data
    } catch (error) {
        console.log("error while fetching payemnt details", error)
    }
}