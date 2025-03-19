'use client'
import Link from "next/link";
import { basicType } from "@/types/types";
import { useState } from "react";
import { signupValidation } from "@/app/utils/validation";
import { userSignup } from "@/app/services/user/userApi";
import {toast} from 'react-toastify'
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";

const Signup = ()=>{
  const [formData,setFormData]= useState<basicType>({
    email:"",
    password:"" 
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const handleFormSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setIsLoading(true)
    const valiation = signupValidation(formData)
    if(valiation.status)
    {
      try {
        const response = await userSignup(formData);
        localStorage.setItem('email',response.email)
        localStorage.setItem('otp',response.otp)
        toast.success(response.message);
        router.push('/otp')
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      }
      setIsLoading(false)

    }
    else{
      toast.error(valiation.message);
    }
  }

  //google signup
  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      document.cookie = `googleSignIn=true; path=/; max-age=${60 * 60}; SameSite=Lax`;
      const result = await signIn('google', { 
        redirect: false 
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
            <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">Sign Up</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email id"
                  className="border rounded-lg w-full p-3 text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="border rounded-lg w-full p-3 text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primarys hover:bg-blue-700 text-white p-3 rounded-lg transition duration-300 font-medium"
                >
                  {isLoading ? "Signing In" : "Register"}
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
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Right side - Image */}
        <div className="hidden md:block w-1/2 bg-gray-50">
          <div className="h-full flex items-center justify-center p-8">
            <Image
              src="/images/user-login.png"
              alt="User signup illustration"
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

export default Signup;