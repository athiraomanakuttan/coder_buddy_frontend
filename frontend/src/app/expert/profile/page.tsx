"use client";
import Navbar from "@/components/expert/Navbar/Navbar";
import { useState } from "react";

const profile_page = () => {
  const [part, setPart] = useState<boolean>(true);
  const [qualifications, setQualifications] = useState<
    { qualification: string; university: string; year: string }[]
  >([{ qualification: "", university: "", year: "" }]);

  const [jobs, setJobs] = useState<
    { occupation: string; employer: string; startDate: string; endDate: string }[]
  >([{ occupation: "", employer: "", startDate: "", endDate: "" }]);

  const addQualification = () => {
    setQualifications([
      ...qualifications,
      { qualification: "", university: "", year: "" },
    ]);
  };

  const updateQualification = (
    index: number,
    field: "qualification" | "university" | "year",
    value: string
  ) => {
    const updatedQualifications = [...qualifications];
    updatedQualifications[index][field] = value;
    setQualifications(updatedQualifications);
  };

  const addJob = () => {
    setJobs([
      ...jobs,
      { occupation: "", employer: "", startDate: "", endDate: "" },
    ]);
  };

  const updateJob = (
    index: number,
    field: "occupation" | "employer" | "startDate" | "endDate",
    value: string
  ) => {
    const updatedJobs = [...jobs];
    updatedJobs[index][field] = value;
    setJobs(updatedJobs);
  };

  return (
    <>
      <div className="m-0 p-0 flex">
        <div className="p-0 m-0">
          <Navbar />
        </div>
        <div className="w-100 border p-8">
          <h5>Your Profile</h5>
          {part ? (
            <div className="part1">
              <div className="flex gap-8 items-end justify-evenly mb-7">
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
                  src="/images/expert_profile_pic.jpg"
                  alt="Profile"
                  className="rounded-full w-32 border"
                />
              </div>
              <button
                className="border rounded-full pt-2 pb-2 pr-4 pl-4 float-end"
                onClick={addQualification}
              >
                +
              </button>
              {qualifications.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-8 items-end justify-evenly mb-7"
                >
                  <input
                    type="text"
                    placeholder="Qualification"
                    value={item.qualification}
                    onChange={(e) =>
                      updateQualification(
                        index,
                        "qualification",
                        e.target.value
                      )
                    }
                    className="border rounded p-2 w-50"
                  />
                  <input
                    type="text"
                    placeholder="College/ University"
                    value={item.university}
                    onChange={(e) =>
                      updateQualification(index, "university", e.target.value)
                    }
                    className="border rounded p-2 w-50"
                  />
                  <input
                    type="text"
                    placeholder="Passout year"
                    value={item.year}
                    onChange={(e) =>
                      updateQualification(index, "year", e.target.value)
                    }
                    className="border rounded p-2 w-50"
                  />
                </div>
              ))}

              <div className="flex gap-8 items-end justify-evenly mb-7">
                <textarea
                  name="address"
                  id="address"
                  className="w-100 border rounded p-3"
                  placeholder="Address"
                ></textarea>
              </div>
              <div className="flex gap-8 items-end justify-evenly mb-7">
                <input
                  type="text"
                  placeholder="Primary contact"
                  className="border rounded p-2 w-50"
                />
                <input
                  type="text"
                  placeholder="Secondary contact"
                  className="border rounded p-2 w-50"
                />
              </div>
              <button
                className="bg-secondarys p-2 rounded float-right text-white"
                onClick={() => setPart(false)}
              >
                Next Page
              </button>
            </div>
          ) : (
            <div className="part2 mt-16">
              <button
                className="border rounded-full pt-2 pb-2 pr-4 pl-4 float-end"
                onClick={addJob}
              >
                +
              </button>
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="flex gap-8 items-end justify-evenly mb-7"
                >
                  <input
                    type="text"
                    placeholder="Occupation"
                    value={job.occupation}
                    onChange={(e) =>
                      updateJob(index, "occupation", e.target.value)
                    }
                    className="border rounded p-2 w-50"
                  />
                  <input
                    type="text"
                    placeholder="Employer"
                    value={job.employer}
                    onChange={(e) =>
                      updateJob(index, "employer", e.target.value)
                    }
                    className="border rounded p-2 w-50"
                  />
                  <input
                    type="text"
                    placeholder="Start Date"
                    value={job.startDate}
                    onChange={(e) =>
                      updateJob(index, "startDate", e.target.value)
                    }
                    className="border rounded p-2 w-50"
                  />
                  <input
                    type="text"
                    placeholder="End Date"
                    value={job.endDate}
                    onChange={(e) =>
                      updateJob(index, "endDate", e.target.value)
                    }
                    className="border rounded p-2 w-50"
                  />
                </div>
              ))}
              <div className="mb-7">
                <label htmlFor="skills">Skills</label>
                <textarea
                  id="skills"
                  className="w-100 border rounded p-3"
                  placeholder="Skills"
                ></textarea>
              </div>
              <button className="bg-secondarys pl-5 pr-5 pb-2 pt-2 rounded float-right text-white">
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default profile_page;
