import { Chat, concernFormDataType, ParticipantInfo, RatingData } from "@/types/types";
import axios from "axios";
import { toast } from "react-toastify";
const API_URI = process.env.NEXT_PUBLIC_API_URI;

export const createRating = async (token: string, data: RatingData)=>{
    try {
        const response = await axios.post(`${API_URI}/api/meeting/update-rating`,{...data},{
            headers:{Authorization: `Bearer ${token}`}
        })
        return response.data;
    } catch (error) {
        console.log("error", error)
        toast.error("unable to add the rating")
    }
}