'use client'
import Navbar from "@/components/admin/navbar/Navbar";
import ProfitReportComponent from "@/components/admin/ProfitReport/ProfitComponent";
import { AdminDashboardType } from "@/types/types";
import { useEffect, useState } from "react";
import {getAdminDashboardData}  from '../../services/admin/adminApi'
import { Ticket, User, UserCog, Video } from "lucide-react";


const dashboard = () => {
  const [dashboardStatus, setDashboardStatus] = useState<AdminDashboardType>({
    openTicket:0,
    scheduledMeeting:0,
    totalClient:0,
    totalExpert:0,
    totalProfit:0
  })
  useEffect(()=>{
    const token = localStorage.getItem("userAccessToken") || ""
    const getDashboardData = async ()=>{
      const response = await getAdminDashboardData(token)
      if(response)
        setDashboardStatus(response.data)
    }
    getDashboardData();
  },[])
  return (
    <div className=" m-0 p-0 flex">
      <div className=" p-0 m-0">
        <Navbar />
      </div>
      <div className="border w-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 m-3">
            

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200">
              <div className="space-y-1">
                <div className="flex gap-4 items-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {dashboardStatus.totalClient}
                  </h3>
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  <span className="text-xl text-primarys">Active Users</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200">
              <div className="space-y-1">
                <div className="flex gap-4 items-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {dashboardStatus.totalExpert}
                  </h3>
                  <UserCog className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  <span className="text-xl text-primarys">Active Experts</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200">
              <div className="space-y-1">
                <div className="flex gap-4 items-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {dashboardStatus.scheduledMeeting}
                  </h3>
                  <Video className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  <span className="text-lg text-primarys">Scheduled Meet</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200">
              <div className="space-y-1">
                <div className="flex gap-4 items-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {dashboardStatus.openTicket}
                  </h3>
                  <Ticket className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  <span className="text-lg text-primarys">Open Tickets</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200">
              <div className="space-y-1">
                <div className="flex gap-4 items-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {dashboardStatus.totalProfit}
                  </h3>
                  <Ticket className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  <span className="text-lg text-primarys">Total Profit</span>
                </p>
              </div>
            </div>


          </div>
        <ProfitReportComponent />
      </div>
    </div>
  );
};

export default dashboard;
