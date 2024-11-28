import axios from "axios";
import { basicType } from "@/types/types";
import { toast } from "react-toastify";

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
    throw new Error(error.message || "An unknown error occurred.");
    
  }
}

export const signinPost = async (email: string, password: string) => {
  if (!email || !password) {
    toast.error("Email and password are required");
    return null;
  }
  try {
    const response = await axios.post(`${API_URI}/api/login`, { email, password });
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const backendMessage = error.response.data?.message || "Unknown error occurred";
      return null;
    } else {
      toast.error("Unable to connect to the server. Please try again later.");
      return null;
    }
  }
};
