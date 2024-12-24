'use client'
import { getUserDetails, userStatusChange } from "@/app/services/admin/adminApi"
import Navbar from "@/components/admin/navbar/Navbar"
import TableComponent from "@/components/admin/TableComponent/TableComponent"
import { UserProfileType } from "@/types/types"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const ClientListPage = () => {
    const [userData, setUserData] = useState<UserProfileType[]>([])
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalUsers: 0,
        limit: 10
    })

    const changeUserStatus = async (id: string, status: string) => {
        if (!id) {
            toast.error("Unable to change the status. Please try again");
            return;
        }
        const token = localStorage.getItem("userAccessToken") as string
        const response = await userStatusChange(id, status, token)
        if (response)
            toast.success("User status changed")
        getUserData(pagination.currentPage)
    }

    const getUserData = async (page: number = 1) => {
        try {
            const token = localStorage.getItem('userAccessToken') || ""
            const response = await getUserDetails(token, page)
            
            if (response.status) {
              console.log("==============",response.data.users)
                setUserData(response.data.users)
                setPagination({
                    currentPage: response.pagination.currentPage,
                    totalPages: response.pagination.totalPages,
                    totalUsers: response.pagination.totalUsers,
                    limit: response.pagination.limit
                })
            }
        } catch (error) {
            console.log("Error fetching userData")
            toast.error("Failed to fetch user data")
        }
    }

    const handlePageChange = (newPage: number) => {
        getUserData(newPage)
    }

    useEffect(() => {
        getUserData();
    }, [])

    return (
        <div className="m-0 p-0 flex">
            <div className="p-0 m-0">
                <Navbar />
            </div>
            <div className="w-100 border p-8">
                <TableComponent
                    headings={['first_name', 'last_name', 'email', 'experience', 'skills']}
                    valueList={userData}
                    role="user"
                    functions={changeUserStatus}
                />
                {/* Pagination Controls */}
                <div className="flex justify-end items-end mt-4 space-x-4">
                    <button 
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-4 py-2 bg-adminprimary text-white rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button 
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-4 py-2 bg-adminprimary text-white rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ClientListPage