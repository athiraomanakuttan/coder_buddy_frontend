'use client';
import { getConcerns, updateUserConcern } from '@/app/services/admin/concernApi';
import { addConernComment } from '@/app/services/shared/concernApi';
import Navbar from '@/components/admin/navbar/Navbar';
import { ConcernDataType, MessageType } from '@/types/types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ConcernPage = () => {
    const [status, setStatus] = useState(0);
    const [selectedConcern, setSelectedConcern] = useState<ConcernDataType | null>(null);
    const [comment, setComment] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalData: 0,
        limit: 10,
    });
    const [concernData, setConcernData] = useState<ConcernDataType[]>([]);
    
    const [token,setToken] = useState("");

    useEffect(()=>{ setToken(localStorage.getItem('userAccessToken') as string || '') },[])

    const getConcernData = async (page: number = 1) => {
        const response = await getConcerns(token, status, page);
        if (response) {
            const totalPages = Math.ceil(response.data.totalRecord / pagination.limit);
            setPagination({ ...pagination, totalPages, totalData: response.data.totalRecord });
            setConcernData(response.data.concernData);
        }
    };

    useEffect(() => {
        getConcernData();
    }, [status]);

    const handlePageChange = (newPage: number) => {
        getConcernData(newPage);
    };

    const handleCommentSend = async () => {
        if (selectedConcern && comment.trim()) {
            const meetingId = selectedConcern.concernMeetingId;
            console.log('Meeting ID:', meetingId);
            
            const newMessage: MessageType = {
                message: comment,
                userType: 'admin',
                dateAndTime: new Date(),
            };

            setSelectedConcern({
                ...selectedConcern,
                message: [...(selectedConcern.message || []), newMessage],
            });

             await addConernComment(token,comment,meetingId  as string ,"admin")

            setComment('');
        }
    };

    const updateConcernStatus = async (concernId:string, status:number)=>{
        console.log("function called")
        const response = await updateUserConcern(token, concernId,status)
        console.log("response",response)
        if(response)
        {    toast.success("status updated sucessfully")
             getConcernData()
        }
    }

    return (
        <div className="m-0 p-0 flex">
            <Navbar />
            <div className="border w-full p-5">
                <h1 className="text-left text-3xl">Ticket Management</h1>
                <div className="flex justify-end gap-3 mb-5">
                    <button 
                        className={`p-2 border rounded ${status === 0 ? 'bg-adminprimary text-white' : 'bg-transparent text-black'}`} 
                        onClick={() => setStatus(0)}
                    >
                        Pending
                    </button>
                    <button 
                        className={`p-2 border rounded ${status === 1 ? 'bg-adminprimary text-white' : 'bg-transparent text-black'}`} 
                        onClick={() => setStatus(1)}
                    >
                        Resolved
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {concernData.map((concern) => (
                        <div 
                            key={concern._id} 
                            className="p-4 border rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
                            onClick={() => setSelectedConcern(concern)}
                        >
                            <h3 className="text-lg font-semibold text-sky-500">{concern.title}</h3>
                            <p className="text-sm text-gray-600">{concern.description.slice(0, 50)}...</p>

                            {concern.status === 0 && (<div className='flex gap-3 mt-5'> <button className='p-2 border rounded bg- bg-sky-300 z-10' onClick={()=>updateConcernStatus(concern._id,1)}> Close </button></div>)}
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-end items-center mt-4 space-x-4">
                    <button 
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-4 py-2 bg-adminprimary rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button 
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-4 py-2 bg-adminprimary rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Message Panel */}
            {selectedConcern && (
                <div className="w-1/3 border-l p-5 bg-white">
                    <h2 className="text-xl font-bold">{selectedConcern.title}</h2>
                    <div className="overflow-y-auto max-h-96 p-4 border rounded">
                        {selectedConcern.message?.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`p-2 my-2 rounded w-fit ${msg.userType === 'admin' ? 'bg-white' : 'bg-blue-200'}`}
                            >
                                <p>{msg.message}</p>
                                <span className="text-xs text-gray-500">
                                    {new Date(msg.dateAndTime).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                        <input 
                            type="text" 
                            className="flex-grow border rounded p-2"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                        />
                        <button 
                            onClick={handleCommentSend}
                            className="px-4 py-2 bg-adminprimary text-white rounded"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConcernPage;
