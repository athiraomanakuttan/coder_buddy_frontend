import axios, { AxiosError } from "axios";
import { basicType, ErrorResponse, PostType, UserProfileType } from "@/types/types";
import { toast } from "react-toastify";

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

export const getProfile = async (token: string) => {
  try {
    const profileData = await axios.get(
      `${API_URI}/api/get-profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
        withCredentials: true,  
      }
    );
    
    return profileData.data;
  } catch (error) {
    console.log( error);
  }
};

export const updateProfile = async (token: string, updateData: UserProfileType) => {
  console.log("======",updateData)
  try {
    const response = await axios.put(
      `${API_URI}/api/update-profile`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );
    console.log(response)
    return response.data;
  } catch (error) {
    console.log(error);
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

export const addPost = async (token: string, data: PostType) => {
  console.log(token)
  console.log('token',token)
  if (!token) {
    toast.error("Session timeout. Please login");
    return { status: false, message: "Unauthorized" };
  }

  try {
    

    const response = await axios.post(`${API_URI}/api/upload-post`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
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

export const getPostDetails = async (token: string, params: {
  status?: number | null, 
  page?: number, 
  limit?: number
}) => {
  
  console.log("params",params)
  try {
    const response = await axios.post(`${API_URI}/api/get-post-details`, params, {
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export const postStatus  = async (token : string, params:{ postId: string, status:number})=>{
  if(!params.postId || !params.status){
    toast.error("unable to update the post status")
    return
  }
  try {
    const response =  await axios.put(`${API_URI}/api/update-post-status`,params,{
      headers:{
        Authorization: `Bearer ${token}`
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

export const searchPost = async (token: string , query : string , currentStatus:number | null = 1)=>{
  try {
    const response = await axios.get(`${API_URI}/api/search-post/${query}/${currentStatus}`,{
      headers:{ Authorization:`Bearer ${token}`}
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


export const getExpertProfile = async (token : string , expertId:string)=>{
  try {
    if(!token || !expertId)
    {
      console.log("token or expert id is empty");
      return
    }
    const response =  await axios.get(`${API_URI}/api/expert-profile/${expertId}`,{
      headers:{Authorization : `Bearer ${token}`}
    })
    return response.data
  } catch (error) {
      console.log("error while getting profile details",error)
  }
}

export const updatePost = async (token: string, postData : PostType)=>{
  try {
    const response = await axios.put(`${API_URI}/api/update-post`,{...postData},{
      headers:{Authorization: `Bearer ${token}`}
    })
    return response.data
  } catch (error) {
    toast.error("unable to update post. Try again")
  }
}


export const getUserPostReport = async (token: string)=>{
try {
  const responce =  await axios.get(`${API_URI}/api/get-post-report`,{ headers : {Authorization : `Bearer ${token}`}})
  return responce;
} catch (error) {
  console.log(error)
}
}

export const getUserDashboardStatus = async (token: string)=>{
  try {
    const response = await axios.get(`${API_URI}/api/get-dashboard-report`,{headers:{Authorization:`Bearer ${token}`}})
    return response.data
  } catch (error) {
    console.log("error while getting report")
  }
}

export const getAllTechnology = async (token: string)=>{
  try {
      const response = await axios.get(`${API_URI}/api/get-all-technologies`,{headers:{Authorization:`Bearer ${token}`}})
      return response.data
  } catch (error) {
      console.log("error",error)
  }
}
