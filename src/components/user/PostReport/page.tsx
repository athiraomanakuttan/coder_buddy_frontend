import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";
import { getUserPostReport } from "@/app/services/user/userApi";
import { ApiResponseItem, ChartData } from "@/types/types";

const PostReportPage: React.FC = () => {
    const [postReport, setPostReport] = useState<ChartData[]>([]);
    const [reportYear, setReportYear] = useState<number>(new Date().getFullYear());
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const fetchPostReport = async () => {
        try {
            const response = await getUserPostReport();
            if (!response || !response.data) return;

            console.log("response", response.data.data);
            const rawData: ApiResponseItem[] = response.data.data;

            if (rawData.length > 0) {
                setReportYear(rawData[0]._id.year); // Set the year from the first item
            }

            const formattedData: ChartData[] = rawData.map(item => ({
                month: monthNames[item._id.month - 1], // Convert month number to name
                pending: item.statuses.find(s => s.status === 0)?.count || 0,
                resolved: item.statuses.find(s => s.status === 1)?.count || 0,
                closed: item.statuses.find(s => s.status === 2)?.count || 0,
            }));

            setPostReport(formattedData);
        } catch (error) {
            console.error("Error fetching report:", error);
        }
    };

    useEffect(() => {
        fetchPostReport();
    }, []);

    return (
        <div className="w-full flex flex-col items-center bg-white shadow-lg rounded-lg p-6">
            <div className="w-full flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">📊 Monthly Post Report</h2>
                <span className="text-gray-600 text-lg font-semibold">{reportYear}</span> {/* Year on top-right */}
            </div>

            <ResponsiveContainer width="95%" height={400}>
                <BarChart data={postReport} margin={{ top: 20, right: 20, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                    <XAxis dataKey="month" tick={{ fontSize: 14 }} />
                    <YAxis tick={{ fontSize: 14 }} />
                    <Tooltip cursor={{ fill: "#f5f5f5" }} />
                    <Legend />
                    <Bar dataKey="pending" fill="#6A80B9" name="Pending" barSize={30} />
                    <Bar dataKey="resolved" fill="#27ae60" name="Resolved" barSize={30} />
                    <Bar dataKey="closed" fill="#c0392b" name="Closed" barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PostReportPage;
