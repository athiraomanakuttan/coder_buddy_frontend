import axios from "axios";
import { toast } from "react-toastify";
const API_URL =  process.env.NEXT_PUBLIC_API_URI

export const paymentCreation = async (token:string,title:string,amount:string|number,userId:string,selectedPostId : string)=>{
    try {
        const responce =  await axios.post(`${API_URL}/api/expert/create-payment-link`,{title,amount,userId,postId:selectedPostId},{
            headers:{Authorization:`Bearer ${token}`}
        })
        return responce.data
    } catch (error) {
        console.log(error)
        toast.error("Unable to create payment link. Try again")
    }
}