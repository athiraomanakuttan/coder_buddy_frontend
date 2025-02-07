import { ExpertType } from "@/types/types";
import { X, Mail, Phone, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/app/services/admin/concernApi";
import { getExpertsProfile } from "@/app/services/admin/adminApi";
import Image from "next/image";
interface ProfileDataType {
  role: string;
  userId: string;
  setProfileView: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileView = ({ role, userId, setProfileView }: ProfileDataType) => {
  const [profileData, setProfileData] = useState<ExpertType>();
  const token = localStorage.getItem("userAccessToken") || "";

  useEffect(() => {
    (async () => {
      let response;
      if (role === "user") response = await getUserProfile(token, userId);
      else response = await getExpertsProfile(userId, token);

      if (response) {
        setProfileData(response.data);
      }
    })();
  }, [token, role, userId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="relative p-6">
          <button
            onClick={() => setProfileView(false)}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Profile Header */}
          <div className="flex items-center space-x-6 mb-6">
            <Image
              src={profileData?.profilePicture as string || "/images/profile_pic.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-adminprimary"
              width={100} height={100}
            />
            <div>
              <h2 className="text-2xl font-semibold">
                {profileData?.first_name} {profileData?.last_name}
              </h2>
              <div className="flex flex-col space-y-1 mt-2 text-gray-600">
                <div className="flex items-center">
                  <Mail className="mr-2 text-blue-500" size={16} />
                  <span>{profileData?.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 text-green-500" size={16} />
                  <span>{profileData?.primary_contact}</span>
                </div>
              </div>
            </div>
            <button className="bg-adminprimary text-white rounded border pl-3 pr-3 pb-2 pt-2 float-end">Start Chat</button>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
                Contact Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="mr-2 text-red-500" size={16} />
                  <span>{profileData?.address || "N/A"}</span>
                </div>
                {profileData?.secondary_contact && (
                  <div className="flex items-center">
                    <Phone className="mr-2 text-green-500" size={16} />
                    <span>Secondary: {profileData.secondary_contact}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileData?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            {profileData?.experience && profileData.experience.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2 flex items-center">
                  <Briefcase className="mr-2 text-purple-500" size={16} />
                  Professional Experience
                </h3>
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="mb-3 pb-2 border-b last:border-b-0">
                    <p className="font-medium">
                      {exp.job_role} at {exp.employer}
                    </p>
                    <p className="text-sm text-gray-600">
                      {exp.start_date} - {exp.end_date}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Qualifications */}
            {profileData?.qualification && profileData.qualification.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2 flex items-center">
                  <GraduationCap className="mr-2 text-orange-500" size={16} />
                  Educational Qualifications
                </h3>
                {profileData.qualification.map((qual, index) => (
                  <div key={index} className="mb-3 pb-2 border-b last:border-b-0">
                    <p className="font-medium">{qual.qualification}</p>
                    <p className="text-sm text-gray-600">
                      {qual.college} - Graduated {qual.year_of_passout}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;