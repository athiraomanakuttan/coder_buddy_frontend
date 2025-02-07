'use client'
import { getConcerns } from '@/app/services/admin/concernApi'
import Navbar from '@/components/admin/navbar/Navbar'
import ConcernList from '@/components/admin/TableComponent/ConcernList'
import { ConcernDataType } from '@/types/types'
import { useEffect, useState } from 'react'

const ConcernPage = () => {
    const [status, setStatus] = useState(0)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalData: 0,
        limit: 10
    })
    
    const [concernData,setConcernData] = useState<ConcernDataType[]>([])

    const token = localStorage.getItem("userAccessToken") as string || ""
    const getConcertnData =  async (page:number = 1)=>{
        const response =  await getConcerns(token, status,page)
        if(response)
          {
            const totalPages = Math.ceil(response.data.totalRecord / pagination.limit)
            setPagination({...pagination,totalPages,"totalData":response.data.totalRecord})
            setConcernData(response.data.concernData)
          }
    }
    useEffect(()=>{
        getConcertnData()
    },[status])
    const handlePageChange = (newPage: number) => {
        getConcertnData(newPage)
    }

  return (
    <div className=" m-0 p-0 flex">
      <div className=" p-0 m-0">
        <Navbar />
      </div>
      <div className="border w-100">
        <div className="container mt-5  ">
            <h1 className='text-left text-3xl'>Ticket managment</h1>
            <div className="flex justify-end gap-3">
                <button className={`p-2 border rounded ${status === 0? "bg-adminprimary text-white" : "bg-transparent text-black"}`} onClick={()=>setStatus(0)}>Pending</button>
                <button className={`p-2 border rounded ${status === 1? "bg-adminprimary text-white" : "bg-transparent text-black"}`} onClick={()=>setStatus(1)}>Resolved</button>
            </div>
            <div>
                <ConcernList concernData={concernData}/>
                {/* Pagination Controls */}
                <div className="flex justify-end items-end mt-4 space-x-4">
                    <button 
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-4 py-2 bg-adminprimary rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button 
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-4 py-2 bg-adminprimary rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
        </div>
        </div>
  )
}

export default ConcernPage
