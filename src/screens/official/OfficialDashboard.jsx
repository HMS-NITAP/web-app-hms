import React, { useCallback, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../../services/operations/OfficialAPI';

const OfficialDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null); 
    
    const { token } = useSelector((state) => state.Auth);
    const dispatch = useDispatch();

    const fetchData = useCallback(async () => {
        try {
            const response = await dispatch(fetchDashboardData(token, toast));
            setDashboardData(response);
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch dashboard data');
        }
    }, [token, dispatch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (!dashboardData) {
        return (
            <div className="flex justify-center items-center mt-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-black text-lg font-bold">Please Wait...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col justify-center items-center my-5 px-4">
            <div className="w-full max-w-2xl space-y-3">
                <div className="w-full bg-white px-5 py-3 rounded-lg border border-green-300 flex justify-start items-center shadow-sm">
                    <span className="font-bold text-base text-green-700">Name:</span>
                    <span className="text-base ml-3 text-black font-medium">
                        {dashboardData?.official?.name}
                    </span>
                </div>

                <div className="w-full bg-white px-5 py-3 rounded-lg border border-green-300 flex justify-start items-center shadow-sm">
                    <span className="font-bold text-base text-green-700">Email:</span>
                    <span className="text-base ml-3 text-black font-medium">
                        {dashboardData?.email}
                    </span>
                </div>

                <div className="w-full bg-white px-5 py-3 rounded-lg border border-green-300 flex justify-start items-center shadow-sm">
                    <span className="font-bold text-base text-green-700">Gender:</span>
                    <span className="text-base ml-3 text-black font-medium">
                        {dashboardData?.official?.gender === "M" ? "Male" : "Female"}
                    </span>
                </div>

                <div className="w-full bg-white px-5 py-3 rounded-lg border border-green-300 flex justify-start items-center shadow-sm">
                    <span className="font-bold text-base text-green-700">Phone:</span>
                    <span className="text-base ml-3 text-black font-medium">
                        {dashboardData?.official?.phone}
                    </span>
                </div>

                <div className="w-full bg-white px-5 py-3 rounded-lg border border-green-300 flex justify-start items-center shadow-sm">
                    <span className="font-bold text-base text-green-700">Designation:</span>
                    <span className="text-base ml-3 text-black font-medium">
                        {dashboardData?.official?.designation}
                    </span>
                </div>

                <div className="w-full bg-white px-5 py-3 rounded-lg border border-green-300 flex justify-start items-center shadow-sm">
                    <span className="font-bold text-base text-green-700">Hostel Block:</span>
                    <span className={`text-base ml-3 font-semibold ${
                        dashboardData?.official?.hostelBlock 
                            ? 'text-green-600' 
                            : 'text-red-600 text-sm'
                    }`}>
                        {dashboardData?.official?.hostelBlock?.name || "NO HOSTEL BLOCK ASSIGNED"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OfficialDashboard;