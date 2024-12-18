'use client'
import { useParams } from 'next/navigation'
import Navbar from '@/components/admin/navbar/Navbar'

const meetingLink = () => {
const params =  useParams<{id: string}>()
  return (
    <div className=" m-0 p-0 flex bg-gray">
      <div className=" p-0 m-0">
        <Navbar />
      </div>
      <div className="flex-grow p-8">
        <h1 className="text-2xl">Schedule Meeting</h1>
        <form action="">
       <div className='w-[50%]'>
       
            <div className='flex'>
                <p >Title</p>
                <input type="text"  className="border rounded p-2 mb-4 mt-3 w-100 text-center" />
            </div>
            <div className='flex'>
                <label htmlFor="">Title</label>
                <input type="text"  className="border rounded p-2 mb-4 mt-3 w-100 text-center" />
            </div>
       </div>
       </form>

        </div>
        </div>
  )
}

export default meetingLink
