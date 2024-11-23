
"use client"
import Navbar from "@/components/user/Navbar/Navbar";
import { useState } from "react";

const profile_page = () => {
    const [part,setPart]= useState(true)
  return (
    <>
      <div className=" m-0 p-0 flex">
        <div className=" p-0 m-0">
          <Navbar />
        </div>
        <div className="w-100 border p-8">
          <h5>Your Profile</h5>
          { part ?
          <div className="part1">
            <div className=" flex gap-8 items-end justify-evenly mb-7">
              <input
                type="text"
                placeholder="First name"
                className="border rounded p-2 w-50"
              />
              <input
                type="text"
                placeholder="Last name"
                className="border rounded p-2 w-50"
              />
              <img
                src="/images/profile_pic.png"
                alt="Profile"
                className="rounded-full w-32"
              />
            </div>
            <div className=" flex gap-8 items-end justify-evenly  mb-7" >
              <input
                type="text"
                placeholder="Qualification"
                className="border rounded p-2 w-50"
              />
              <input
                type="text"
                placeholder="College/ University"
                className="border rounded p-2 w-50"
              />
            </div>
            <div className=" flex gap-8 items-end justify-evenly  mb-7">
              <textarea name="address" id="address" className="w-100 border rounded p-3" placeholder="Address"></textarea>
            </div>
            <div className=" flex gap-8 items-end justify-evenly  mb-7" >
              <input
                type="text"
                placeholder="Experiance"
                className="border rounded p-2 w-50"
              />
              <input
                type="text"
                placeholder="Job title"
                className="border rounded p-2 w-50"
              />
            </div>
            <button className="bg-primarys p-2 rounded float-right text-white" onClick={()=>setPart(false)}>Next Page</button>
          </div> :

          <div className="part2 mt-16">
            <div className=" flex gap-8 items-end justify-evenly mb-7">
              <input
                type="text"
                placeholder="Occupation"
                className="border rounded p-2 w-50"
              />
              <input
                type="text"
                placeholder="Employer"
                className="border rounded p-2 w-50"
              />
              
            </div>

            <div className=" flex gap-8 items-end justify-evenly mb-7">
              <input
                type="text"
                placeholder="Occupation"
                className="border rounded p-2 w-50"
              />
              <input
                type="text"
                placeholder="Employer"
                className="border rounded p-2 w-50"
              />
              
            </div>

            <div className=" flex gap-8 items-end justify-evenly  mb-7" >
              <input
                type="text"
                placeholder="Start Date"
                className="border rounded p-2 w-50"
              />
              <input
                type="text"
                placeholder="End Date"
                className="border rounded p-2 w-50"
              />
            </div>
            <div className="mb-7">
            <label htmlFor="">Skills</label>

              <textarea name="address" id="address" className="w-100 border rounded p-3" placeholder="Address"></textarea>
            </div>
            
            <button className="bg-primarys pl-5 pr-5 pb-2 pt-2 rounded float-right text-white">Save</button>
          </div>
            }
        </div>
      </div>
    </>
  );
};

export default profile_page;
