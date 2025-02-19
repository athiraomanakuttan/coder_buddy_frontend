"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { MonthlyReport } from "@/types/types";
import { getMeetingReport } from "@/app/services/shared/meetingApi";

const MeetingMonthlyReport = () => {
    const [meetingReport, setMeetingReport] = useState<MonthlyReport[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const token = localStorage.getItem("userAccessToken") || "";

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const response = await getMeetingReport(token, year);
                console.log("response", response);
                setMeetingReport(response.data);
            } catch (error) {
                console.error("Error fetching meeting report:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [year]);

    const months: string[] = [
        "Jan", "Feb", "Mar", "Apr", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    // Convert API response to match chart format
    const chartData = months.map((month, index) => ({
        month,
        totalMeetings: meetingReport.find((m) => m.month === index + 1)?.totalMeetings || 0,
    }));

    return (
        <div className=" mx-auto p-6 bg-white shadow-lg rounded-xl mt-5">
            <h2 className="text-xl font-bold text-center mb-4">Monthly Meeting Report</h2>
            
            <div className="flex justify-between items-center mb-4">
                <label className="font-semibold">Select Year:</label>
                <select
                    className="border rounded-md p-2"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="totalMeetings" fill="#4B6E8B" barSize={50} />
                    </BarChart>
                </ResponsiveContainer>
            )}

            {meetingReport.length === 0 && !loading && (
                <p className="text-center text-gray-500">No meetings found for {year}.</p>
            )}
        </div>
    );
};

export default MeetingMonthlyReport;
