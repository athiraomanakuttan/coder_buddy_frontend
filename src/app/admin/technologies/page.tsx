'use client'
import { getTechnologies, UpdateTechnologies } from "@/app/services/admin/TechnologyApi";
import { formatDate } from "@/app/utils/dateUtils";
import Navbar from "@/components/admin/navbar/Navbar";
import TechnologyModel from "@/components/admin/technologies/TechnolgyModal";
import { TechnologyType } from "@/types/types";
import { PenBox, Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TechnologiesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdatedModalOpen] = useState(false);
  const [selectedData,setSelectedData] = useState<TechnologyType>({})
  const [technologies, setTechnologies] = useState<TechnologyType[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalRecords: 0,
    limit: 5,
});

  const getData = async (page = 1)=>{
    const token = localStorage.getItem("userAccessToken") || ""
    const response = await getTechnologies(token,page)
    console.log("response",response)
    const {technologies , totalRecords} = response.data
    if(response){
        setTechnologies(technologies)
        setPagination({
            ...pagination,
            currentPage: page,
            totalPages: Math.ceil(totalRecords / pagination.limit),
            totalRecords: totalRecords,
        });
    }
  }

  const updateTechnology = async (id: string,status: number)=>{
    const token = localStorage.getItem("userAccessToken") || ""
    const response = await UpdateTechnologies(token,id,{status})
    if(response){
      toast.success("updated")
      getData()
    }
  }
  const updateTech = async (tech:TechnologyType)=>{
    setSelectedData(tech)
    setIsUpdatedModalOpen(true)
  }
  const handlePageChange = (newPage: number) => {
    console.log("newPage", newPage)
    getData(newPage);
};


  useEffect(()=>{
    getData()
  },[ isModalOpen, isUpdateModalOpen])
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="flex-none">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header with Add Button */}
            <div className="p-6 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Technologies</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-adminprimary text-white rounded-md hover:bg-opacity-90 transition-colors duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {technologies.length > 0 ? (
                    technologies.map((tech, id) => (
                      <tr 
                        key={id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tech.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(tech.createdAt!) || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={tech.status === 1} 
                              onChange={() => updateTechnology(tech._id!, tech.status === 1 ? 0 : 1)}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" />
                          </label>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => updateTech(tech)}
                            className="text-gray-600 hover:text-adminprimary transition-colors duration-200"
                          >
                            <PenBox className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && <TechnologyModel setIsModalOpen={setIsModalOpen} />}
      {isUpdateModalOpen && <TechnologyModel setIsModalOpen={setIsUpdatedModalOpen} data={selectedData}/>}
    </div>
  );
};

export default TechnologiesPage;
