import { MeetingDataType } from "@/types/types";
import axios from "axios";
import { toast } from "react-toastify";
const API_URI = process.env.NEXT_PUBLIC_API_URI;

export const createMeeting = async (token: string, formData:MeetingDataType, participentId: string, postId: string)=>{
    try {
        const reponse = await axios.post(`${API_URI}/api/meeting/create-meeting`, {...formData, userId:participentId,postId},{ 
            headers:{Authorization:`Bearer ${token}`}
        })
        return reponse.data
    } catch (error) {
        console.log(error)
        toast.error("unable to create meeting link. Try again")
    }
}

export const getMeetingDatas = async (token: string, status : number = 0, page:number = 1, limit:number = 5)=>{
    try {
        const response = await axios.get(`${API_URI}/api/meeting/get-meeting-data`, {
            params: { status, page, limit },
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(response)
        return response.data
    } catch (error) {
        console.log("error while getting meeting data",error)
    }
}

export const meetingVerification = async (token: string, meetingId :  string)=>{
    if(!meetingId || !token){
        toast.error("Invalid meeting Id or token")
        return
    }
    try {
        const response =  await axios.get(`${API_URI}/api/meeting/get-meeting/${meetingId}`,{
            headers : { Authorization: ` Bearer ${ token }`}
        })
        return response.data
    } catch (error) {
        console.log(error)
        toast.error("Invalid meeting. Try again !")
    }

}

export const getMeetingReport = async (token: string, year:number = new Date().getFullYear())=>{
    try {
        const response =  await axios.get(`${API_URI}/api/meeting/get-meeting-report`,{
            params:{year},
            headers:{Authorization:`Bearer ${token}`}
        })
        return response.data
    } catch (error) {
        console.log("error ", error)
    }
}

export const updateMeetingStatus = async (token: string, status:number, meetingId: string)=>{
    try {
        const response = await axios.post(`${API_URI}/api/meeting/update-meeting/${status}`,{meetingId},{
            headers:{ Authorization : `Bearer ${token}`}
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getMeetingFeedback = async (token: string, meetingId: string)=>{
    try {
        const response =  await axios.get(`${API_URI}/api/meeting/get-meeting-feedback`,{
            params:{meetingId},
            headers:{Authorization: `Bearer ${token}`}
        })
        return response.data
    } catch (error) {
        console.log(error)
        toast.error("unable to fetch th meeting feedback")
    }
}