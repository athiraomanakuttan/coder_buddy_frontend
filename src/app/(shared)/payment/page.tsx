"use client";
import { useEffect, useState } from "react";
import { PaymentType } from "@/types/types";
import { getPaymentsList } from "@/app/services/shared/paymentApi";
import Navbar from "@/components/user/Navbar/Navbar";
import ExpertNavbar from "@/components/expert/Navbar/Navbar";
import { formatDate } from "@/app/utils/dateUtils";
import Link from "next/link";

const PaymentList = () => {
    const [payments, setPayments] = useState<PaymentType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpert, setIsExprt] = useState("");
    const [paymentStatus, setPaymentStatus] = useState(0);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalRecords: 0,
        limit: 5,
    });

    const fetchPayments = async (page = 1) => {
        try {
            const token = localStorage.getItem("userAccessToken");
            const expert = localStorage.getItem("isExpert") as string;
            setIsExprt(expert);
            if (token) {
                const response = await getPaymentsList(token,paymentStatus, page, 5);
                console.log("response", response);
                if (response?.data) {
                    const { paymentDetails, totalRecord } = response.data;
                    setPayments(paymentDetails);

                    setPagination({
                        ...pagination,
                        currentPage: page,
                        totalPages: Math.ceil(totalRecord / pagination.limit),
                        totalRecords: totalRecord,
                    });
                }
            }
        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setIsLoading(false);
        }
    };
    const handlePageChange = (newPage: number) => {
        console.log("new page", newPage);
        fetchPayments(newPage);
    };

    useEffect(() => {
        fetchPayments();
    }, [paymentStatus]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
      <div className="flex-none">
        {isExpert ? <ExpertNavbar /> : <Navbar />}
      </div>
      
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Payment Management</h1>
              
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-md transition-colors duration-200 
                    ${!paymentStatus 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  onClick={() => setPaymentStatus(0)}
                >
                  Pending
                </button>
                <button
                  className={`px-4 py-2 rounded-md transition-colors duration-200
                    ${paymentStatus 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  onClick={() => setPaymentStatus(1)}
                >
                  History
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-6 py-3 font-semibold text-gray-700 rounded-tl-lg">Title</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
                    {!isExpert ? (
                      <>
                        <th className="px-6 py-3 font-semibold text-gray-700">Payment</th>
                        <th className="px-6 py-3 font-semibold text-gray-700 rounded-tr-lg">Profile</th>
                      </>
                    ) : (
                      <th className="px-6 py-3 font-semibold text-gray-700 rounded-tr-lg">User</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={!isExpert ? 6 : 5} className="text-center py-8 text-gray-500 bg-white">
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment, index) => (
                      <tr
                        key={payment._id}
                        className={`border-b hover:bg-gray-50 transition-colors duration-150 ${
                          index === payments.length - 1 ? "border-none" : ""
                        }`}
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">{payment.title}</td>
                        <td className="px-6 py-4 text-gray-700">₹{payment.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 text-gray-600">{formatDate(payment.createdAt)}</td>
                        <td className="px-6 py-4">
                          {payment.status === 0 ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Completed
                            </span>
                          )}
                        </td>
                        {!isExpert ? (
                          <>
                            <td className="px-6 py-4">
                              {payment.status === 0 && (
                                <Link href={`/payment/${payment._id}`}>
                                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200">
                                    Pay Now
                                  </button>
                                </Link>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <Link href={`/expertprofile/${payment.expertId}`}>
                                <button className="px-4 py-2 text-blue-500 hover:text-blue-700 transition-colors duration-200">
                                  View Profile
                                </button>
                              </Link>
                            </td>
                          </>
                        ) : (
                          <td className="px-6 py-4">
                            <Link href={`/userProfile/${payment.userId}`}>
                              <button className="px-4 py-2 text-blue-500 hover:text-blue-700 transition-colors duration-200">
                                View User
                              </button>
                            </Link>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Showing {payments.length} of {pagination.totalRecords} entries
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
};

export default PaymentList;
