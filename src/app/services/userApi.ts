import axios from "axios";
import { basicType } from "@/types/types";

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