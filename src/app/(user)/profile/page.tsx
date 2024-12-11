"use client";
import Navbar from "@/components/user/Navbar/Navbar";
import ProgressBar from "@/components/user/Progressbar/ProgressBar"; 
import { useState, ChangeEvent, useEffect } from "react";
import { UserProfileType } from "@/types/types";
import { toast } from "react-toastify";
import { getProfile, updateProfile } from "@/app/services/userApi";
import { userProfileValidation } from "@/app/utils/validation";
import { parseSkills } from "@/app/utils/skillUtils";

const ProfilePage: React.FC = () => {
  const [part, setPart] = useState(1); 
  const [formSubmit, setFormSubmit] = useState<boolean>(false)
  const [formData, setFormData] = useState<UserProfileType>({
    firstName: "",
    lastName: "",
    qualification: "",
    college: "",
    address: "",
    totalExperience: "",
    currentJobTitle: "",
    occupation: "",
    employer: "",
    startDate: "",
    endDate: "",
    skills: "",
    profilePicture: "/images/profile_pic.png",
  });

  const getProfileData = async () => {
    const token = localStorage.getItem("userAccessToken")!;
    const userData = await getProfile(token as string);
    if (userData.status) {
      const transformedData = {
        _id:userData.data._id,
        firstName: userData.data.first_name || "",
        lastName: userData.data.last_name || "",
        qualification: userData.data.qualification?.[0]?.qualification || "",
        college: userData.data.qualification?.[0]?.college || "",
        address: userData.data.address || "",
        totalExperience: userData.data.experiance || "",
        currentJobTitle: userData.data.job_title || "",
        occupation: userData.data.occupation || "",
        employer: userData.data.employer || "",
        startDate: userData.data.start_date
          ? new Date(userData.data.start_date).toISOString().split("T")[0]
          : "",
        endDate: userData.data.end_date
          ? new Date(userData.data.end_date).toISOString().split("T")[0]
          : "",
        skills: userData.data.skills.join(" ") || "",
        profilePicture: userData.data.profilePicture || "/images/profile_pic.png",
      };
      setFormData(transformedData);
    }
  };
  
  useEffect(()=>{
    getProfileData();
  },[])

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, GIF, or WEBP).");
        return;
      }
      
      setFormData({
        ...formData,
        profilePicture: file  
      });  
    }
  };
 
  const handleFormSubmit = async (e:React.FormEvent<HTMLElement>) => {
    e.preventDefault()
    if(!formSubmit)
      return;
    const validation = userProfileValidation(formData)
    const parsedSkills = parseSkills(formData.skills as string);
    const parsedData = {...formData, skills: parsedSkills}
    if(!validation.status)
      toast.error(validation.message)
    else{
      try {
        const token = localStorage.getItem('userAccessToken') as string
        const updateUser =  await  updateProfile(token,parsedData)
        if(updateUser.status)
          toast.success(updateUser.message)
        getProfileData()
      } catch (error) {
        console.log(error)
      }
    }
  };

  const handleNextPage = () => {
    setPart(2); // Move to the next part
  };

  const handlePreviousPage = () => {
    setPart(1); // Go back to the first part
  };

  return (
    <>
      <div className="m-0 p-0 flex">
        <div className="p-0 m-0">
          <Navbar />
        </div>
        <div className="w-100 border p-8">
          <h5 className="text-3xl mb-6">Your Profile</h5>
          
          {/* Add Progress Bar */}
          <ProgressBar currentPart={part} totalParts={2} />
          
          <form onSubmit={handleFormSubmit} encType="multipart/form-data">
          {part === 1 ? (
            <div className="part1">
              <div className="flex gap-8 items-end justify-evenly mb-7">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-50"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-50"
                />
                <div className="relative">
                  <img
                    src={formData.profilePicture as string}
                    alt="Profile"
                    className="rounded-full w-32 cursor-pointer border"
                    onClick={() =>
                      document.getElementById("profilePictureInput")?.click()
                    }
                  />
                  <input
                    type="file"
                    id="profilePictureInput"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleProfilePictureChange}
                  />
                </div>
              </div>
              <div className="flex gap-8 items-end justify-evenly mb-7">
                <input
                  type="text"
                  name="qualification"
                  placeholder="Qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-50"
                />
                <input
                  type="text"
                  name="college"
                  placeholder="College/University"
                  value={formData.college}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-50"
                />
              </div>
              <div className="flex gap-8 items-end justify-evenly mb-7">
                <textarea
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-100 border rounded p-3"
                ></textarea>
              </div>
              <div className="flex gap-8 items-end justify-evenly mb-7">
                <input
                  type="text"
                  name="totalExperience"
                  placeholder="Experience"
                  value={formData.totalExperience}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-50"
                />
                <input
                  type="text"
                  name="currentJobTitle"
                  placeholder="Job title"
                  value={formData.currentJobTitle}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-50"
                />
              </div>
              <button
                type="button"
                className="bg-primarys p-2 rounded float-right text-white"
                onClick={handleNextPage}
              >
                Next Page
              </button>
            </div>
          ) : (
            <div className="part2 mt-16">
              <h2 className="text-2xl mb-7">Current employment Details</h2>
              <div className="flex gap-8 items-end justify-evenly mb-7">
                <input
                  type="text"
                  name="occupation"
                  placeholder="Occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-50"
                />
                <input
                  type="text"
                  name="employer"
                  placeholder="Employer"
                  value={formData.employer}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-50"
                />
              </div>
              <div className="flex gap-8 items-end justify-evenly mb-7">
                <input
                  type="date"
                  name="startDate"
                  placeholder="Start Date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-50"
                />
                <input
                  type="date"
                  name="endDate"
                  placeholder="End Date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-50"
                />
              </div>
              <div className="mb-7">
                <label htmlFor="skills">Skills</label>
                <textarea
                  name="skills"
                  placeholder="Skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="w-100 border rounded p-3"
                ></textarea>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-gray-300 p-2 rounded text-black"
                  onClick={handlePreviousPage}
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="bg-primarys pl-5 pr-5 pb-2 pt-2 rounded text-white"
                  onClick={()=>setFormSubmit(true)}
                >
                  Save
                </button>
              </div>
            </div>
          )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;