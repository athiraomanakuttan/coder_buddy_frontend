import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { basicType, ErrorResponse, ExpertType } from "@/types/types";
import axiosInstance from "./expertAxiosInstance";

const API_URL = process.env.NEXT_PUBLIC_API_URI

export const signupPost = async(data:basicType)=>{
    if(!API_URL)
        toast.error("unable to connect backend")
    try {
         const responce =  await axios.post(`${API_URL}/api/expert/signup`,data)  
         console.log(responce) 
         return responce
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          const errorData = error.response.data as ErrorResponse;
          toast.error(errorData.message);
        } else {
          toast.error("Unable to login. Try again");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
}

export const otpPost = async (otp:string, storedOTP : string, storedEmail:string )=>{
    try {
        const responce = await axios.post(`${API_URL}/api/expert/verify-otp`,{otp, storedOTP,storedEmail})
        return responce.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          const errorData = error.response.data as ErrorResponse;
          toast.error(errorData.message);
        } else {
          toast.error("Unable to login. Try again");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  export const signinPost = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return null;
    }
    try {
      const response = await axios.post(`${API_URL}/api/expert/login`, { email, password });
      return response.data; 
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          const errorData = error.response.data as ErrorResponse;
          toast.error(errorData.message);
        } else {
          toast.error("Unable to login. Try again");
        }
      } else {
        toast.error("An unexpected error occurred");
      }

    }
  };

  export const getProfile = async ()=>{
      try {
        const response =  await axiosInstance.get(`/api/expert/get-expert-details`)
          console.log("response.data",response.data)
          return response.data
      } catch (error) {
        console.log( error);
      }
  }

  export const updateProfile = async (data: ExpertType) => {
    
      try {
        const formData = new FormData();
        
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('primary_contact', data.primary_contact  ? data.primary_contact : "");
        formData.append('address', data.address ? data.address : "");
        formData.append('secondary_contact', data.secondary_contact ? data.secondary_contact:"" );
        formData.append('skills', JSON.stringify(data.skills));  
        formData.append('experience', JSON.stringify(data.experience));  
        formData.append('qualification', JSON.stringify(data.qualification));  

        if (data.profilePicture  instanceof File) {
          formData.append('profilePicture', data.profilePicture);
        }

        const response = await axiosInstance.put(
          `/api/expert/update-profile`,
          formData,
        );
  
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error("Error while updating user profile", error);
        throw error;
      }
  };

  export const forgotPssword = async (email :  string)=>{
    if(!email){
      toast.error("email is required");
      return
    }
    try {
      const response =  await axios.post(`${API_URL}/api/expert/forgot-password`,{email})
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          const errorData = error.response.data as ErrorResponse;
          toast.error(errorData.message);
        } else {
          toast.error("Unable to login. Try again");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  export const resetUserPassword = async (email: string, password :  string)=>{
     if(!email ){
      toast.error("User is unautherized")
      return;
     }
     else if(!password){
      toast.error("password is required");
      return;
     }
     try {
      const response =  await axios.put(`${API_URL}/api/expert/update-password`,{email,password})
      return response.data
     } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          const errorData = error.response.data as ErrorResponse;
          toast.error(errorData.message);
        } else {
          toast.error("Unable to login. Try again");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
     }
  }


export const googleExpertSignup = async (expertData: {
  name: string;
  email: string;
  googleId: string;
  image?: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/api/expert/google-signup`, expertData);
    return response.data;
  } catch (error) {
    console.error('Expert Google Signup Error:', error);
    throw error;
  }
};

export const getUserPost = async ( page :  number = 1 , limit:number = 5 )=>{
  try {
    
      const response = await axiosInstance.get(`/api/expert/get-post`,{
        params: { page, limit },
      })
      return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        const errorData = error.response.data as ErrorResponse;
        toast.error(errorData.message);
      } else {
        toast.error("Unable to login. Try again");
      }
    } else {
      toast.error("An unexpected error occurred");
    }
  }
}

export const addComment= async (  comment: string, postId :  string)=>{
  try {
    const response =  await axiosInstance.post(`/api/expert/add-comment`,{comment, postId})
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        const errorData = error.response.data as ErrorResponse;
        toast.error(errorData.message);
      } else {
        toast.error("Unable to login. Try again");
      }
    } else {
      toast.error("An unexpected error occurred");
    }
  }
}

export const deleteComment =  async ( data:{commentId : string, expertId : string , postId:string})=>{
  try{
    const response = await axiosInstance.put(`/api/expert/delete-comment`, data )
    console.log(response)
    return response.data
  }catch(error){
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        const errorData = error.response.data as ErrorResponse;
        toast.error(errorData.message);
      } else {
        toast.error("Unable to login. Try again");
      }
    } else {
      toast.error("An unexpected error occurred");
    } 
  }
}

export const getExpertDashboardData = async ()=>{
  try {
    const response = await axiosInstance.get(`/api/expert/get-dashbord-data`)
    return response.data
  } catch (error) {
    console.log("error", error)
  }
}