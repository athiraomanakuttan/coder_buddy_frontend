'use client'
import { useState, useEffect } from "react"
import { changeExpertStatus, getexpertDetails } from "@/app/services/admin/adminApi"
import Navbar from "@/components/admin/navbar/Navbar"
import TableComponent from "@/components/admin/TableComponent/TableComponent"
import { UserProfileType } from "@/types/types"
import { toast } from "react-toastify"

const ExpertListPage = () => {
    const [userData, setUserData] = useState<UserProfileType[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [expertState, setExpertState] = useState(0)
    const [token,setToken]= useState<string>("")
    const getUserData = async (page: number = 1) => {
            setIsLoading(true)
            
            const response = await getexpertDetails(token,expertState, page)
            if (response.status) {
                setUserData(response.data?.experts)
                setTotalPages(response.data?.pagination?.totalPages) }
            setIsLoading(false)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        getUserData(page) 
    }
    const handleChangeExpertStatus = async (expertId : string, status : number)=>{
        const response =  await changeExpertStatus(token, expertId, status)
        if(response)
         {   toast.success("expert status changed") 
            getUserData()
         }
    }
    useEffect(()=>{
        setToken(localStorage.getItem('userAccessToken') || "")
    },[])

    useEffect(() => {
        getUserData()
    }, [expertState])

    return (
        <div className="m-0 p-0 flex">
            <div className="p-0 m-0">
                <Navbar />
            </div>
            <div className="w-100 border p-8 overflow-y-auto">
                <div className="flex gap-3 justify-end mb-2"> 
                    <button className={`${expertState? "bg-adminprimary text-white"  : "bg-sky-100 text-black" } p-2 rounded border`} onClick={()=>setExpertState(1)}>Active </button>
                    <button className={`${expertState ?"bg-sky-50 text-black" : "bg-adminprimary text-white"} p-3 rounded border `} onClick={()=>setExpertState(0)}>Pending</button>
                </div>
                <TableComponent 
                    headings={['first_name', 'last_name', 'email', 'skills', 'primary_contact', 'createdAt']} 
                    valueList={userData} 
                    role="admin"
                    functions={handleChangeExpertStatus}
                    expertState={expertState}
                />

                <div className="flex justify-end items-center mt-4 space-x-2">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1 || isLoading}
                        className="px-4 py-2 bg-adminprimary text-white rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    
                    <span className="text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages || isLoading}
                        className="px-4 py-2 bg-adminprimary text-white rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ExpertListPage