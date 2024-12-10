'use client'
import { useState, useEffect } from "react"
import { getexpertDetails } from "@/app/services/adminApi"
import Navbar from "@/components/admin/navbar/Navbar"
import TableComponent from "@/components/admin/TableComponent/TableComponent"
import { UserProfileType } from "@/types/types"

const ExpertListPage = () => {
    const [userData, setUserData] = useState<UserProfileType[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const getUserData = async (page: number = 1) => {
       
            setIsLoading(true)
            const token = localStorage.getItem('userAccessToken') || ""
            const response = await getexpertDetails(token, page)
            
            if (response.status) {
              console.log(response.data)
                setUserData(response.data?.experts)
                setTotalPages(response.data?.pagination?.totalPages)
            }
            setIsLoading(false)
        
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        getUserData(page)
    }

    useEffect(() => {
        getUserData()
    }, [])

    return (
        <div className="m-0 p-0 flex">
            <div className="p-0 m-0">
                <Navbar />
            </div>
            <div className="w-100 border p-8">
                <TableComponent 
                    headings={['first_name', 'last_name', 'email', 'skills', 'primary_contact', 'createdAt']} 
                    valueList={userData} 
                    role="expert"
                    functions={getexpertDetails}
                />
                
                <div className="flex justify-center items-center mt-4 space-x-2">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1 || isLoading}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    
                    <span className="text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages || isLoading}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ExpertListPage