'use client'
import { resetUserPassword } from '@/app/services/expert/expertApi'
import { passwordValidation } from '@/app/utils/validation'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const resetPassword = () => {
  const router =  useRouter()
    const [formData, setFormData]= useState<{password:string, confirm_password:string}>({
        password:"",
        confirm_password:""
    })
    const handleFormSubmit = async(e:React.FormEvent<HTMLElement>)=>{
        e.preventDefault()
        const validation = passwordValidation(formData.password, formData.confirm_password)
        if(validation.status){
            const email = localStorage.getItem('email') as string
            console.log(email)
            const response  = await resetUserPassword(email,formData.password)
            if(response.status)
            {
              localStorage.removeItem("email")
              toast.success(response.message)
              router.push('/expert/login')
            }
        }
        else
        toast.error(validation.message)
    }
  return (
    <div className='h-[100vh] w-100 border flex align-middle'>
      <div className="container mx-auto my-auto w-50 border  p-5">
        <h1 className='text-3xl text-center mb-4'>Reset Your Password</h1>
        <form onSubmit={handleFormSubmit}>
            <label className='text-gray-500'>New Password</label>
            <input
                  type="text"
                  placeholder="Enter your new password"
                  className="border rounded w-100 p-2 mb-3 mt-1"
                  value={formData.password}
                  onChange={(e)=>setFormData({...formData,password:e.target.value})}
                />
            <label className='text-gray-500'>Confirm Password</label>

                <input
                  type="text "
                  placeholder="confirm password"
                  className="border rounded w-100 p-2 mb-3 mt-1"
                  value={formData.confirm_password}
                  onChange={(e)=>setFormData({...formData,confirm_password:e.target.value})}
                />
                <input type="submit" value="Reset Password"  className="w-100 bg-secondarys p-2 mb-3 text-white"  />
        </form>
      </div>
    </div>
  )
}

export default resetPassword
