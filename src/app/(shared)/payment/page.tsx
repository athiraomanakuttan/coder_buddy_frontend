'use client'
import { useEffect, useState } from 'react'
import { PaymentType } from '@/types/types'
import { getPaymentsList } from '@/app/services/shared/paymentApi'
import Navbar from '@/components/user/Navbar/Navbar'
import ExpertNavbar from '@/components/expert/Navbar/Navbar'
import { formatDate } from '@/app/utils/dateUtils' 
import Link from 'next/link'

const PaymentList = () => {
    const [payments, setPayments] = useState<PaymentType[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isExpert,setIsExprt]= useState("")
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalRecords: 0,
        limit: 5
    })
    
    const fetchPayments = async (page = 1) => {
        try {
            const token = localStorage.getItem("userAccessToken")
            const expert = localStorage.getItem("isExpert") as string 
            setIsExprt(expert)
            if (token) {
                const response = await getPaymentsList(token,page, 5 )
                console.log("response", response)
if (response?.data) {
    const { paymentDetails, totalRecord } = response.data;
    setPayments(paymentDetails);
    
    setPagination({
        ...pagination,
        currentPage: page,
        totalPages: Math.ceil(totalRecord / pagination.limit),
        totalRecords: totalRecord
    });
}
            }
        } catch (error) {
            console.error('Failed to fetch payments', error)
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        fetchPayments()
    }, [])

    const  handlePageChange = (newPage: number) => {
        console.log("new page", newPage)
        fetchPayments(newPage)
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (

        <div className=" m-0 p-0 flex">
      <div className=" p-0 m-0">
        { isExpert ?  <ExpertNavbar/> : <Navbar />}
      </div>
      <div className="border w-100">
        <div className="container mt-5 flex justify-evenly">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-sky-200 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-3">Title</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Status</th>
                        {!isExpert ? (
                            <><th className="px-6 py-3">Actions</th>
                            <th className="px-6 py-3">Actions</th></>
                        ) :  <th className="px-6 py-3">Actions</th> }
                        
                    </tr>
                </thead>
                <tbody>
                    {payments.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-4">No payments yet</td>
                        </tr>
                    ) : (
                        payments.map(payment => (
                            <tr key={payment._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">{payment.title}</td>
                                <td className="px-6 py-4">₹{payment.amount.toFixed(2)}</td>
                                <td className="px-6 py-4">{formatDate(payment.createdAt)}</td>
                                <td className="px-6 py-4">
                                    {payment.status === 0 ? <label className='bg-yellow-400 text-black rounded p-1'>Pending</label> : <label className='bg-green-400 text-white rounded p-1'>Completed</label>}
                                </td>
                                {!isExpert ? (
  <>
    {payment.status === 0 && (
      <td className="px-6 py-4">
        <Link href={`/payment/${payment._id}`}>
          <button className="text-blue-600 hover:bg-sky-500 hover:text-white bg-sky-200 p-2">
            Pay Now
          </button>
        </Link>
      </td>
    )}
    <td>
      <Link href={`/expertprofile/${payment.expertId}`}>View Profile</Link>
    </td>
  </>
) : (<td>
    <Link href={`/userProfile/${payment.userId}`} className='text-sky-400'>View User</Link>
  </td>)
  }

                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="flex justify-end items-end mt-4 space-x-4 mb-2">
                    <button 
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-4 py-2 bg-primarys text-white rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button 
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-4 py-2 bg-primarys text-white rounded disabled:opacity-50"
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

export default PaymentList