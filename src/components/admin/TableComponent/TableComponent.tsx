'use client'
import Link from 'next/link';
import React from 'react'
import { useRouter } from 'next/navigation';
import { formatDate } from '@/app/utils/dateUtils';
import { TableComponentValueType } from '@/types/types';

interface TableComponentProps {
  headings: string[];
  valueList?: TableComponentValueType[];
  role?: string;
  functions?: (id: string, status: number) => Promise<void> | void; // Updated to match your function signature
  expertState?: number
}

// Define a type for accessing dynamic properties
type PropertyAccessor<T> = {
  [K in keyof T]: T[K]
};

const TableComponent: React.FC<TableComponentProps> = ({ headings, valueList, role, functions, expertState }) => {
  const router = useRouter()
  console.log("valueList", valueList)
  const handleMeetingJoin = (_id: string, meetingId: string, userId: string) => {
    
    const data = JSON.stringify({ _id, meetingId, userId })
    localStorage.setItem("currentMeeting", data)
    setTimeout(() => {
      router.push(`/videoCall/${meetingId}`)
    }, 1000)

  }
  
  // Helper function to safely access properties using bracket notation with proper typing
  const getPropertyValue = (item: TableComponentValueType, key: string): string | number | boolean | string[] => {
    const accessor = item as PropertyAccessor<TableComponentValueType>;
    const value = key in accessor ? accessor[key as keyof TableComponentValueType] : 'N/A';
    
    // Return appropriate types based on the value
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || Array.isArray(value)) {
      return value;
    }
    
    return 'N/A';
  }
  
  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right dark:text-gray-400">
          <thead className="text-xs text-white uppercase bg-adminprimary dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {headings.map((heading, index) => (
                <th key={index} scope="col" className="px-6 py-3">
                  {heading.charAt(0).toUpperCase() + heading.slice(1)}
                </th>
              ))}
              <th scope="col" className="px-6 py-3">
                status
              </th>
              {
                role === "meetingList" && <th scope="col" className="px-6 py-3"></th>
              }
              {
                role === "meetingList" && <th scope="col" className="px-6 py-3"></th>
              }
            </tr>
          </thead>
          <tbody>
            {valueList && valueList.length > 0 && (
              valueList.some(item => 'title' in item || 'first_name' in item)
            ) ? (
              valueList.map((item, itemIndex) => (
                <tr
                  key={itemIndex}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  {headings.map((heading, headingIndex) => (
                    <td
                      key={headingIndex}
                      className="px-6 py-4"
                    >
                      {heading === "createdAt" || heading === "updatedAt" || heading === "dateTime"
                        ? formatDate(getPropertyValue(item, heading).toString())
                        : Array.isArray(getPropertyValue(item, heading))
                          ? (getPropertyValue(item, heading) as string[]).join(',')
                          : getPropertyValue(item, heading).toString()
                      }
                    </td>
                  ))}
                  <td>
                    {role === "user" && <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={getPropertyValue(item, 'status') === 1}
                        onChange={() => functions && functions(getPropertyValue(item, '_id').toString(), getPropertyValue(item, 'status') === 1 ? 0 : 1)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-500 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                    </label>}
                    {
                      (role === "admin" && expertState === 0) && <Link href={`/admin/experts/profile/${getPropertyValue(item, '_id')}`} className='text-primary'>View Profile</Link>
                    }
                    {
                      (role === "admin" && expertState === 1) &&
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={getPropertyValue(item, 'status') === 1}
                          onChange={() => functions && functions(getPropertyValue(item, '_id').toString(), getPropertyValue(item, 'status') === 1 ? 0 : 1)}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-500 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                      </label>
                    }
                    {
                      role === "meetingList" && <Link href={`/admin/experts/profile/${getPropertyValue(item, 'userId')}`} className='text-primary'>View Profile</Link>
                    }
                  </td>
                  <td>
                    {
                      role === "meetingList" && <button className='border rounded pl-2 pr-2 pt-1 pb-1 bg-adminprimary text-white' onClick={() => handleMeetingJoin(getPropertyValue(item, '_id').toString(), getPropertyValue(item, 'meetingId').toString(), getPropertyValue(item, 'userId').toString())}>Join Meeting</button>
                    }
                  </td>
                  <td>
                    {
                      role === "meetingList" && <Link
                        href={`/admin/expertApproval/${getPropertyValue(item, 'userId')}/${getPropertyValue(item, 'meetingId')}`}
                        className="border rounded pl-2 pr-2 pt-1 pb-1"
                      >
                        Update
                      </Link>
                    }
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headings.length + (role === "meetingList" ? 3 : 1)} className="text-center py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableComponent