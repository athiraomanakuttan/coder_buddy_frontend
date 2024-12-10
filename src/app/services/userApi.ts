import axios from "axios";
import { basicType, UserProfileType } from "@/types/types";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";
const API_URI = process.env.NEXT_PUBLIC_API_URI;

export const userSignup = async (userData: basicType) => {
  if (!API_URI) {
    throw new Error("API_URI is not defined");
  }

  try {
    const response = await axios.post(`${API_URI}/api/signup`, { ...userData });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 409) {
        throw new Error(data.message || "User already exists.");
      }
    }
    throw new Error(error.message || "An unknown error occurred.");
  }
};

export const otpPost = async (otp:string, storedOTP : string, storedEmail:string )=>{
  try {
      const responce = await axios.post(`${API_URI}/api/verify-otp`,{otp, storedOTP,storedEmail})
      return responce.data;
  } catch (error:any) {
        toast.error(error?.response?.data?.message)
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
    return response.data; }catch (error : any) {
      if(error?.status === 403)
      {
        toast.error("Your account has been blocked")
      }
      else
      toast.error(error.response.data.message)
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
  } catch (error : any) {
    console.log(error)
    if(error.status === 400)
      toast.error(error.response.data.message)
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
  } catch (error:any) {
    if(error.status)
      toast.error(error.response.data.message)
    else
      toast.error("unable to update the password.")
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
  } catch (error: any) {
    console.error('Google Signup Error:', error)
    
    if (error.response) {
      toast.error(error.response.data.message || 'Google signup failed')
    }
    
    return null
  }
}


