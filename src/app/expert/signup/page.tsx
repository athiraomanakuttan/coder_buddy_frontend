'use client'
import { signupPost } from "@/app/services/expert/expertApi";
import { signupValidation } from "@/app/utils/validation";
import { basicType } from "@/types/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import {  signIn } from "next-auth/react"
import Image from "next/image";

const signup = ()=>{
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData]= useState<basicType>({
    email:"",
    password:""
  })
  const handleFormSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    const validation = signupValidation(formData)
    if(!validation.status){
      toast.error(validation.message)
      return;
    }
    try {
      const response =  await signupPost(formData)
      console.log(response)
      if(response && response.data.status){
        const data = response.data;
        toast.success(data.message)
        localStorage.setItem('email', data.data.email)
        localStorage.setItem('otp', data.data.otp)
        localStorage.setItem("isAdmin","1")
        router.push('/expert/otp')
      }
      

    } catch (error) {
      console.log(error)
    }
  } 

   const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      document.cookie = `googleSignIn=true; path=/; max-age=${60 * 60}; SameSite=Lax`;
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: '/expert/dashboard',
        isExpert: true 
      })
  
      if (result?.error) {
        console.error('Google Sign-In Error:', result.error)
        toast.error('Google Sign-In failed')
        return
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }
return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-6xl flex flex-col md:flex-row">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">Sign Up</h1>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email id"
                  className="border rounded-lg w-full p-3 text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="border rounded-lg w-full p-3 text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-secondarys hover:bg-blue-700 text-white p-3 rounded-lg transition duration-300 font-medium"
                >
                  Register
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="border border-gray-300 rounded-lg w-full p-3 flex items-center justify-center bg-white hover:bg-gray-50 transition duration-300"
                >
                  <Image
                    src="/icons/g-icon.png"
                    alt="Google Icon"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  <span>{isLoading ? "Signing in..." : "Sign in with Google"}</span>
                </button>
              </div>
            </form>
            <div className="flex justify-end mt-6 text-sm">
              <div className="text-gray-600">
                Already have an account?{" "}
                <Link href="/expert/login" className="text-blue-600 hover:underline font-medium">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Image */}
        <div className="hidden md:block w-1/2 bg-gray-50">
          <div className="h-full flex items-center justify-center p-8">
            <Image
              src="/images/expert_login.png"
              alt="Expert signup illustration"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
    </>
)
}

export default signup;