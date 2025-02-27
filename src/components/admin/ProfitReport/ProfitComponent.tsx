"use client"

import { getProfitData } from "@/app/services/admin/adminApi"
import { MonthlyAdminProfitReport } from "@/types/types"
import { useEffect, useState } from "react"
import {XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const ProfitReportComponent = () => {
    const [profitData, setProfitData] = useState<MonthlyAdminProfitReport[]>([]) 
    const [year, setYear] = useState(new Date().getFullYear())
    const token = localStorage.getItem("userAccessToken") || ""

    useEffect(() => {
        const getAdminProfitData = async () => {
            const response = await getProfitData(token, year)
            console.log("response", response)
            if (response) {
                // Convert month numbers to names
                const formattedData = response.data.map((item:MonthlyAdminProfitReport) => ({
                    ...item,
                    month: monthNames[item.month - 1], // Convert 1-based month number to name
                }))
                setProfitData(formattedData)
            }
        }
        getAdminProfitData()
    }, [year])

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold">Monthly Profit Report ({year})</h2>
                <div className="ml-auto">
                    <label className="mr-2 font-bold">Select Year:</label>
                    <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="border p-2 rounded">
                        {[2023, 2024, 2025].map((yr) => (
                            <option key={yr} value={yr}>{yr}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={profitData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                    <XAxis dataKey="month" tick={{ fill: "#333" }} />
                    <YAxis tick={{ fill: "#333" }} />
                    <Tooltip contentStyle={{ backgroundColor: "#fff", color: "#000" }} />
                    <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#00C805" 
                        strokeWidth={2} 
                        dot={{ fill: "#00C805" }}
                        connectNulls={true} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ProfitReportComponent
