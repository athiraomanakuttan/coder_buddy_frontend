"use client";

import Navbar from "@/components/user/Navbar/Navbar";
import ExpertNavbar from "@/components/expert/Navbar/Navbar";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import ConcernComponent from "@/components/shared/concernComponent";
import { ConcernDataType } from "@/types/types";
import { getUserConcernData } from "@/app/services/shared/concernApi";
import Link from "next/link";

const ComplaintRegistration = () => {
  const isExpert = localStorage.getItem("isExpert") || "";
  const token = (localStorage.getItem("userAccessToken") as string) || "";
  const [status, setStatus] = useState(0);
  const [concernModel, setConcernModel] = useState(false);
  const [concernData, setConcernData] = useState<ConcernDataType[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getConcernData = async () => {
    const response = await getUserConcernData(token, status);
    if (response) setConcernData(response.data);
    console.log("response.data",response.data)
  };
  useEffect(() => {
    getConcernData();
  }, [concernModel, status]);
  return (
    <div className="m-0 p-0 flex">
      <div className="p-0 m-0">{isExpert ? <ExpertNavbar /> : <Navbar />}</div>
      <div className="border w-100">
        <div className="flex justify-end gap-3 m-5">
          <button
            className={`${
              status === 0 ? "bg-sky-300" : "bg-yellow-50"
            } border p-2 rounded`}
            onClick={() => setStatus(0)}
          >
            Open
          </button>
          <button
            className={`${
              status === 1 ? "bg-sky-300" : "bg-yellow-50"
            } border p-2 rounded`}
            onClick={() => setStatus(1)}
          >
            Closed
          </button>
          <button
            className="border p-2 rounded"
            onClick={() => setConcernModel(true)}
          >
            <Plus />
          </button>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-4">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-sky-200 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Attchements</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Created At</th>
                <th className="py-2 px-4 border-b">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {concernData.length === 0 ? (
                <tr className="">
                  <td
                    colSpan={5}
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                concernData.map((concern) => {
                  const isExpanded = expandedDescriptions[concern._id];
                  const truncatedDescription =
                    concern.description.length > 20
                      ? concern.description.slice(0, 20) + "..."
                      : concern.description;

                  return (
                    <tr key={concern._id}>
                      <td className="py-2 px-4 border-b">{concern.title}</td>
                      <td className="py-2 px-4 border-b">
                        {isExpanded
                          ? concern.description
                          : truncatedDescription}
                        {concern.description.length > 20 && (
                          <button
                            className="text-blue-500 ml-2 focus:outline-none"
                            onClick={() => toggleDescription(concern._id)}
                          >
                            {isExpanded ? "Read less" : "More"}
                          </button>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b" >{concern?.video ? <Link href={concern?.video} target="_blank" rel="noopener noreferrer" className="text-blue-500">View Attachment</Link> : <p>No Attachemts</p>}</td>
                      <td className="py-2 px-4 border-b">
                        {concern.status === 0 ? "Open" : "Closed"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {concern.createdAt
                          ? new Date(concern.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {concern.updatedAt
                          ? new Date(concern.updatedAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {concernModel && (
        <ConcernComponent
          setConcernModel={setConcernModel}
          isExpert={isExpert}
        />
      )}
    </div>
  );
};

export default ComplaintRegistration;
