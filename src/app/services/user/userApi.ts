import axios, { AxiosError } from "axios";
import { basicType, ErrorResponse, PostType, UserProfileType } from "@/types/types";
import { toast } from "react-toastify";
import axiosInstance from "./userAxiosInstance";

const API_URI = process.env.NEXT_PUBLIC_API_URI;

export const userSignup = async (userData: basicType) => {
  if (!API_URI) {
    throw new Error("API_URI is not defined");
  }

  try {
    const response = await axios.post(`${API_URI}/api/signup`, { ...userData });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status) {
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

export const otpPost = async (otp:string, storedOTP : string, storedEmail:string )=>{
  try {
      const responce = await axios.post(`${API_URI}/api/verify-otp`,{otp, storedOTP,storedEmail})
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
    try{const response = await axios.post(`${API_URI}/api/login`, { email, password },{
      withCredentials: true
    });
    return response.data; }catch (error ) {
    console.log("error ",error)
      if (error instanceof AxiosError) {
        if (error.response?.status) {
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



export const getProfile = async () => {
  try {
    const profileData = await axiosInstance.get('/api/get-profile');
    return profileData.data;
  } catch (error) {
    console.log(error);
    throw error; // Optionally rethrow to let caller handle it
  }
};

export const updateProfile = async (updateData: UserProfileType) => {
  try {
    const response = await axiosInstance.put(
      '/api/update-profile',
      updateData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error; // Optional: rethrow the error so the caller can handle it
  }
};

export const userForgotPassword = async (email: string)=>{
  if(!email)
  {  toast.error("email is empty. please try again")
    return;
  }
  try {
    const response = await axios.post(`${API_URI}/api/forgot-password`,{email})
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

export const resetUserPassword = async (email:string, password: string)=>{
  if(!email || !password)
  {  toast.error("not an autherized user")
    return 
  }
  try {
    const response = await axios.put(`${API_URI}/api/update-password`,{email,password})
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

export const googleSignup = async (userData: {
  name?: string, 
  email?: string, 
  image?: string,
  googleId?: string
}) => {
  try {
    const response = await axios.post(`${API_URI}/api/google-signin`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
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

export const addPost = async ( data: PostType) => {

  try {
    

    const response = await axiosInstance.post(`/api/upload-post`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      status: true,
      message: response.data.message || "Post created successfully",
      data: response.data
    };
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

export const getPostDetails = async ( params: {
  status?: number | null, 
  page?: number, 
  limit?: number
}) => {
  
  try {
    const response = await axiosInstance.post(`/api/get-post-details`, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export const postStatus  = async ( params:{ postId: string, status:number})=>{
  if(!params.postId || !params.status){
    toast.error("unable to update the post status")
    return
  }
  try {
    const response =  await axiosInstance.put(`/api/update-post-status`,params)
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

export const searchPost = async ( query : string , currentStatus:number | null = 1)=>{
  try {
    const response = await axiosInstance.get(`/api/search-post/${query}/${currentStatus}`)
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


export const getExpertProfile = async ( expertId:string)=>{
  try {
    
    const response =  await axiosInstance.get(`/api/expert-profile/${expertId}`)
    return response.data
  } catch (error) {
      console.log("error while getting profile details",error)
  }
}

export const updatePost = async ( postData : PostType)=>{
  try {
    const response = await axiosInstance.put(`/api/update-post`,{...postData})
    return response.data
  } catch (error) {
    console.log(error)
    toast.error("unable to update post. Try again")
  }
}


export const getUserPostReport = async ()=>{
try {
  const responce =  await axiosInstance.get(`/api/get-post-report`)
  return responce;
} catch (error) {
  console.log(error)
}
}

export const getUserDashboardStatus = async ()=>{
  try {
    const response = await axiosInstance.get(`/api/get-dashboard-report`)
    return response.data
  } catch (error) {
    console.log("error while getting report", error)
  }
}

export const getAllTechnology = async ()=>{
  try {
      const response = await axiosInstance.get(`/api/get-all-technologies`)
      return response.data
  } catch (error) {
      console.log("error",error)
  }
}
