"use client";
import Navbar from "@/components/user/Navbar/Navbar";
import { useState, ChangeEvent, useEffect } from "react";
import { UserProfileType } from "@/types/types";
import { toast } from "react-toastify";
import { getProfile, updateProfile } from "@/app/services/userApi";
import { userProfileValidation } from "@/app/utils/validation";
import { parseSkills } from "@/app/utils/skillUtils";

const ProfilePage: React.FC = () => {
  const [part, setPart] = useState(true);
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
    console.log("userData",userData.data.skills)
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
    console.log("form data",formData)

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
 
  const handleFormSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    console.log("event function ",e)
    e.preventDefault()
    console.log(formData)
    const validation = userProfileValidation(formData)
    const parsedSkills = parseSkills(formData.skills as string);
    const parsedData = {...formData,skiils:parsedSkills}
    if(!validation.status)
      toast.error(validation.message)
    else{
      try {
        const token = localStorage.getItem('userAccessToken') as string
        const updateUser =  await  updateProfile(token,parsedData)
        if(updateUser.status)
          toast.success(updateUser.message)
      } catch (error) {
        console.log(error)
      }
    }
  };

  return (
    <>
      <div className="m-0 p-0 flex">
        <div className="p-0 m-0">
          <Navbar />
        </div>
        <div className="w-100 border p-8">
          <h5 className="text-3xl">Your Profile</h5>
          <form onSubmit={handleFormSubmit} encType="multipart/form-data">
          {part ? (
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
                onClick={() => setPart(false)} 
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
              <button
              type="submit"
                className="bg-primarys pl-5 pr-5 pb-2 pt-2 rounded float-right text-white"
                 
              >
                Save
              </button>
            </div>
          )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
