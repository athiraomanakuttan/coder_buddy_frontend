'use client'
import { createConcern, getMeetingData, getUserData } from "@/app/services/shared/concernApi";
import { concernValidation } from "@/app/utils/validation";
import { concernFormDataType, concernMeetingType, ConcernType, ParticipantInfo } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";



const ConcernComponent = ({ setConcernModel, isExpert }: ConcernType) => {
    const [formData, setFormData] = useState<concernFormDataType>({
        title: "",
        description: "",
        userId: "",
        meetingId: "",
    });

    const [userData, setUserData] = useState<ParticipantInfo[]>([]);
    const [meetingData, setMeetingData] = useState<concernMeetingType[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null); // State to store the video file

    const token = localStorage.getItem("userAccessToken") ?? "";
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await getUserData(token);
                if (response) setUserData(response);
            } catch (error) {
                toast.error("Failed to fetch users");
            }
        };
        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (!selectedUser) return;

        const fetchMeetingDetails = async () => {
            try {
                const response = await getMeetingData(token, selectedUser);
                if (response) setMeetingData(response.data);
            } catch (error) {
                toast.error("Failed to fetch meetings");
            }
        };

        fetchMeetingDetails();
    }, [selectedUser]);

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setVideoFile(event.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        

        const concernData = {
            ...formData,
            meetingId: selectedMeeting,
            userId: selectedUser,
        };

        const isValid = concernValidation(concernData);
        if (!isValid.status) {
            toast.error(isValid.message);
            return;
        }

        try {
            const formDataToSend = new FormData();
formDataToSend.append("title", concernData.title);
formDataToSend.append("description", concernData.description);
formDataToSend.append("userId", concernData.userId ?? "");
formDataToSend.append("meetingId", concernData.meetingId ?? "");
formDataToSend.append("video", videoFile ?? ""); 
            console.log("formDataToSend",formDataToSend)
            const response = await createConcern(token, formDataToSend);
            if (response) {
                toast.success("Concern created successfully");
                setConcernModel(false);
            }
        } catch (error) {
            toast.error("Failed to create concern");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-lg font-semibold mb-4">Do you have a concern?</h2>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        placeholder="Title"
                        className="border rounded w-full p-2 mb-3"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />

                    <label>Description</label>
                    <textarea
                        placeholder="Detailed concern"
                        className="border rounded w-full p-2 mb-3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>

                    <label>{isExpert ? "Select User" : "Select Expert"}</label>
                    <select
                        className="border rounded w-full p-2 mb-3"
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">Choose a user</option>
                        {userData.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>

                    <label>Select Meeting</label>
                    <select
                        className="border rounded w-full p-2 mb-3"
                        onChange={(e) => setSelectedMeeting(e.target.value)}
                    >
                        <option value="">Select a meeting</option>
                        {meetingData.map((meeting) => (
                            <option key={meeting._id} value={meeting._id}>
                                {meeting.title}
                            </option>
                        ))}
                    </select>

                    <label>Upload Video</label>
                    <input 
                        type="file" 
                        accept="video/*" 
                        className="border rounded w-full p-2 mb-3" 
                        onChange={handleVideoUpload} 
                    />

                    {videoFile && (
                        <video controls width="100%" className="mb-3">
                            <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>

                <div className="flex justify-between">
                    <button
                        className="px-4 py-2 border rounded-lg hover:bg-blue-600 transition"
                        onClick={() => setConcernModel(false)}
                    >
                        Close
                    </button>

                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConcernComponent;
