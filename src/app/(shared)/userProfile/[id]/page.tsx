'use client'

import { getUserById } from "@/app/services/shared/paymentApi"
import { UserProfileDataType, } from "@/types/types"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Briefcase, GraduationCap } from "lucide-react"
import Navbar from "@/components/expert/Navbar/Navbar"

const UserProfilePage = () => {
    const { id } = useParams()
    const token = localStorage.getItem("userAccessToken") as string || ""
    const [userData, setUserData] = useState<UserProfileDataType | null>(null)

    const getUserData = async () => {
        const response = await getUserById(token, id as string)
        console.log("response", response)
        if (response) {
            setUserData(response.data)
        }
    }

    useEffect(() => {
        getUserData()
    }, [id])

    if (!userData) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div className="m-0 p-0 flex bg-gray">
                <div className="p-0 m-0">
                    <Navbar />
                </div>
                <div className="flex-grow p-8">
                    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-primarys text-white p-6 flex items-center">
                            <Link href="/post" className="mr-4">
                                <ArrowLeft className="text-white hover:text-blue-200 transition-colors" />
                            </Link>
                            <h1 className="text-2xl font-bold">Expert Profile</h1>
                        </div>

                        {/* Profile Overview */}
                        <div className="p-6 border-b">
                            <div className="flex items-center space-x-6">
                                <img
                                    src={userData.profilePicture || 'https://res.cloudinary.com/dicelwy0k/image/upload/v1734162966/k1hkdcipfx9ywadit4lr.png'}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-primarys"
                                />
                                <div className="flex-grow">
                                    <h2 className="text-3xl font-semibold text-gray-800">
                                        {userData.first_name} {userData.last_name}
                                    </h2>
                                    <div className="flex items-center space-x-4 mt-2 text-gray-600">
                                        <div className="flex items-center">
                                            <Mail className="mr-2 text-blue-500" size={20} />
                                            <span>{userData.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="grid md:grid-cols-2 gap-6 p-6">
                            {/* Skills */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                                    Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {userData.skills?.length && userData.skills.map((skill, index) => (
                                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Experience */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2 flex items-center">
                                    <Briefcase className="mr-3 text-purple-500" size={20} />
                                    Professional Experience
                                </h3>
                                {userData.experience?.length > 0 ? (
                                    userData.experience.map((exp, index) => (
                                        <div key={index} className="mb-3 pb-3 border-b last:border-b-0">
                                            <p className="font-medium">{exp.job_role} at {exp.employer}</p>
                                            <p className="text-sm text-gray-600">
                                                {exp.start_date} - {exp.end_date}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No experience recorded</p>
                                )}
                            </div>

                            {/* Qualifications */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2 flex items-center">
                                    <GraduationCap className="mr-3 text-orange-500" size={20} />
                                    Educational Qualifications
                                </h3>
                                {userData.qualification?.length > 0 ? (
                                    userData.qualification.map((qual, index) => (
                                        <div key={index} className="mb-3 pb-3 border-b last:border-b-0">
                                            <p className="font-medium">{qual.qualification}</p>
                                            <p className="text-sm text-gray-600">
                                                {qual.college} - Graduated {qual.year_of_passout}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No qualifications recorded</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfilePage