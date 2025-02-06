import React, { useState } from "react";
import { ConcernDataType } from "@/types/types";
import Link from "next/link";

interface ConcernType {
  concernData: ConcernDataType[];
}

const ConcernList = ({ concernData }: ConcernType) => {
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-3">
          <thead className="text-xs text-white uppercase bg-adminprimary dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">role</th>
              <th className="py-2 px-4 border-b">Attchements</th>
              <th className="py-2 px-4 border-b">Profile</th>
              <th className="py-2 px-4 border-b">Complaint Profile</th>
              <th className="py-2 px-4 border-b">Complaint Meeting</th>
              <th className="py-2 px-4 border-b">Created At</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {concernData.length === 0 ? (
              <tr className="">
                <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
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
                      {isExpanded ? concern.description : truncatedDescription}
                      {concern.description.length > 20 && (
                        <button
                          className="text-blue-500 ml-2 focus:outline-none"
                          onClick={() => toggleDescription(concern._id)}
                        >
                          {isExpanded ? "Read less" : "More"}
                        </button>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {concern.role ?? "None"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {concern?.video ? (
                        <Link
                          href={concern?.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500"
                        >
                          View Attachment
                        </Link>
                      ) : (
                        <p>No Attachemts</p>
                      )}
                    </td>

                    <td className="py-2 px-4 border-b">
                      {concern.role === "user" ? (
                        <Link href={""} className="text-blue-500">
                          View Profile
                        </Link>
                      ) : (
                        <Link href={""} className="text-blue-500">
                          View Profile
                        </Link>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {concern.role === "user" ? (
                        <Link href={""} className="text-blue-500">
                          View Profile
                        </Link>
                      ) : (
                        <Link href={""} className="text-blue-500">
                          View Profile
                        </Link>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {" "}
                      <Link href={""} className="text-blue-500">
                        View Meeting
                      </Link>
                    </td>

                    <td className="py-2 px-4 border-b">
                      {concern.createdAt
                        ? new Date(concern.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button className="p-2  border rounded bg-adminprimary text-white">
                        Close
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConcernList;
