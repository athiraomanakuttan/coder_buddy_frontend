"use client";
import { getExpertsProfile, rejectExpertRequest } from "@/app/services/adminApi";
import Navbar from "@/components/admin/navbar/Navbar";
import { ExpertType } from "@/types/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap 
} from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ExpertProfilePage = ({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) => {
  const [params, setParams] = useState<{ id: string } | null>(null);
  const [expertData, setExpertData] = useState<ExpertType>({
    _id: params?.id ? params?.id : "",
    experience: [],
    email: "",
    first_name: "",
    last_name: "",
    profilePicture: "/images/profile_pic.png",
    qualification: [],
    address: "",
    primary_contact: "",
    secondary_contact: "",
    skills: [],
  });
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await paramsPromise;
      setParams(resolvedParams);
    };
    unwrapParams();
  }, [paramsPromise]);

  const getExpertProfile = async () => {
    if (params) {
      const token = localStorage.getItem("userAccessToken") as string;
      const response = await getExpertsProfile(params.id, token);
      if (response.data) setExpertData(response.data);
    }
  };
  const router = useRouter()
  useEffect(() => {
    if (params) {
      getExpertProfile();
    }
  }, [params]);
  const rejectExpert =async  (id: string)=>{
    if(!id){
      toast.error("not able to reject the request")
      return;
    }
    const token = localStorage.getItem("userAccessToken") as string
    const response =  await rejectExpertRequest(id, token)
    if(response){
      toast.success("Expert Rejected");
      router.push('/admin/experts')
    }
  }
const handleMeetingSchedule = (id : string )=>{
  router.push(`/admin/meeting/${id}`)
}
  return (
    <>
       <div className=" m-0 p-0 flex bg-gray">
      <div className=" p-0 m-0">
        <Navbar />
      </div>
      <div className="flex-grow p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-adminprimary text-white p-6 flex items-center">
            <Link href="/admin/experts" className="mr-4">
              <ArrowLeft className="text-white hover:text-blue-200 transition-colors" />
            </Link>
            <h1 className="text-2xl font-bold">Expert Profile</h1>
          </div>

          {/* Profile Overview */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-6">
              <img
                src={expertData.profilePicture as string || "/images/profile_pic.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-adminprimary"
              />
              
              <div className="flex-grow">
                <h2 className="text-3xl font-semibold text-gray-800">
                  {expertData.first_name} {expertData.last_name}
                </h2>
                <div className="flex items-center space-x-4 mt-2 text-gray-600">
                  <div className="flex items-center">
                    <Mail className="mr-2 text-blue-500" size={20} />
                    <span>{expertData.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2 text-green-500" size={20} />
                    <span>{expertData.primary_contact}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Contact & Address */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="mr-3 text-red-500" size={20} />
                  <span>{expertData.address || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-3 text-green-500" size={20} />
                  <span>
                    Primary: {expertData.primary_contact}
                    {expertData.secondary_contact && 
                      ` | Secondary: ${expertData.secondary_contact}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {expertData.skills?.length && expertData.skills.map((skill, index) => (
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
              {expertData?.experience?.length > 0 ? (
                expertData.experience.map((exp, index) => (
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

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2 flex items-center">
                <GraduationCap className="mr-3 text-orange-500" size={20} />
                Educational Qualifications  
              </h3>
              {expertData?.qualification?.length > 0 ? (
                expertData.qualification.map((qual, index) => (
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
            <div></div>
            <div className=" w-100  flex justify-end mt-2 mb-2  gap-3">
              <button className="border bg-red-700 pt-2 pb-2 pr-5 pl-5 text-white" onClick={()=>rejectExpert(params?.id as string)}>Reject </button> 
              <button className="border bg-adminprimary pt-2 pb-2 pr-5 pl-5 text-black " onClick={()=>handleMeetingSchedule(params?.id as string)}>Schedule meeting </button>
            </div>

          </div>

        </div>
      </div>
    </div>
    </>
  );
};

export default ExpertProfilePage;
