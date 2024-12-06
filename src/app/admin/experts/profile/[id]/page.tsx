"use client";
import { getExpertsProfile } from "@/app/services/adminApi";
import Navbar from "@/components/admin/navbar/Navbar";
import { ExpertType } from "@/types/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    if (params) {
      getExpertProfile();
    }
  }, [params]);

  return (
    <>
      <div className="m-0 p-0 flex">
        <div className="p-0 m-0">
          <Navbar />
        </div>
        <div className="w-100  p-8">
          <div className="border rounded p-4">
            <Link href={"/admin/experts"}>Back</Link>
            <div className="flex justify-between align-bottom">
              <img
                src={
                  expertData.profilePicture
                    ? (expertData.profilePicture as string)
                    : "/images/profile_pic.png"
                }
                alt="Profile"
                className="rounded-full w-28 cursor-pointer border"
              />
              <div>
                <p>Email : {expertData.email}</p>
                <p>Contact : {expertData.primary_contact}</p>
              </div>
            </div>

                <div className="">
                 <div>
                 <label htmlFor="">First Name</label>
                 <input type="text" name="" id="" disabled value={expertData.first_name} />
                 </div>
                 <div>
                 <label htmlFor="">Last Name</label>
                 <input type="text" name="" id="" disabled value={expertData.last_name} />
                 </div>
                </div>
                


          </div>
        </div>
      </div>
    </>
  );
};

export default ExpertProfilePage;
