'use client'
import { useParams , useRouter } from 'next/navigation'
import Navbar from '@/components/admin/navbar/Navbar'
import { useState } from 'react'
import { NewMeetingType } from '@/types/types'
import { meetingValidation } from '@/app/utils/validation'
import { toast } from 'react-toastify'
import { createMeetingLink } from '@/app/services/admin/meetingApi'

const MeetingLink = () => {
  const router = useRouter()
const params =  useParams<{id: string}>()
const [formData , setFormData] = useState<NewMeetingType>({
    expertId:params.id,
    meetingDate:"",
    title:""
})
const handleFormSubmit = async (e : React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    const validate =  meetingValidation(formData)
    if(!validate.status){
        toast.error(validate.message)
        return
    }
    const token =  localStorage.getItem('userAccessToken') as string
    const response =  await createMeetingLink(token,formData)
    if(response){
      toast.success(response.message)
      router.push('/admin/experts')
    }
}

const handleCancel = ()=>{
  router.push('/admin/experts')
}
return (
    <>
      <div className="m-0 p-0 flex">
        <div className="p-0 m-0">
          <Navbar />
        </div>
        <div className="w-100  p-8 flex items-center">
            <div className="border  rounded w-[50%] mx-auto p-3">
          <h5 className="text-3xl mb-6 text-center">Schedule Meeting</h5>
            <form onSubmit={handleFormSubmit}>
                <div className="flex-row mb-3">
                    <label htmlFor="">Title</label>
                    <input type="text" className='w-100 border rounded p-2' placeholder='Meeting Title' value={formData.title} onChange={(e)=>setFormData({...formData,'title':e.target.value})}/>
                </div>
                <div className="flex-row mb-2">
                    <label htmlFor="">Date and Time</label>
                    <input type="datetime-local" className='w-100 border rounded p-2' placeholder='Meeting label' value={formData.meetingDate} onChange={(e)=>setFormData({...formData,'meetingDate':e.target.value})}/>
                </div>
                <button type="submit" className='mb-3 bg-adminprimary w-100 p-2 text-white'>Create Meeting</button>
                <button type="button" className='bg-red-600  w-100 p-2  text-white' onClick={handleCancel}>Cancel</button>
            </form>
            </div>
          
        </div>
      </div>
    </>
  );
}

export default MeetingLink
