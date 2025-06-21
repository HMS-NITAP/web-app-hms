import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../../services/operations/AdminAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.Auth);

  const [dashboardData, setDashboardData] = useState(null);

  const fetchData = async () => {
    setDashboardData(null);
    const response = await dispatch(fetchDashboardData(token, toast));
    setDashboardData(response);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const moveToBlock = (hostelBlockId, hostelBlockName, floors) => {
    const floorCount = parseInt(floors);
    navigate("/admin/block-rooms", {
      state: { hostelBlockId, hostelBlockName, floorCount },
    });
  };

  return (
    <div className="w-full min-h-screen p-6 bg-gray-100 flex flex-col items-center gap-6 overflow-y-auto">
      {dashboardData && (
        <div className="w-full max-w-4xl flex flex-col items-center gap-6">
          {/* Overall Stats */}
          <div className="w-full p-6 bg-white border border-dashed border-black rounded-xl shadow">
            <h2 className="text-center text-lg font-bold mb-4 text-black">OVERALL DATA</h2>

            <p className="text-black font-semibold">Total Registrations: {dashboardData.activeStudentsCount + dashboardData.freezedStudentsCount + dashboardData.inactiveStudentsCount}</p>
            <p className="text-black font-semibold">Completed Registrations: {dashboardData.activeStudentsCount}</p>
            <p className="text-black font-semibold">Freezed Registrations: {dashboardData.freezedStudentsCount}</p>
            <p className="text-black font-semibold">Pending Registrations: {dashboardData.inactiveStudentsCount}</p>

            <div className="mt-4" />
            <p className="text-black font-semibold">Total Cots: {dashboardData.overallAvailableCots + dashboardData.overallBlockedCots + dashboardData.overallBookedCots}</p>
            <p className="text-black font-semibold">Available Cots: {dashboardData.overallAvailableCots}</p>
            <p className="text-black font-semibold">Blocked Cots: {dashboardData.overallBlockedCots}</p>
            <p className="text-black font-semibold">Booked Cots: {dashboardData.overallBookedCots}</p>
          </div>

          {/* Hostel Blocks */}
          <h2 className="text-2xl font-extrabold text-gray-600 text-center">HOSTEL BLOCKS</h2>

          <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2">
            {dashboardData.formattedResult.map((data, index) => (
              <div
                key={index}
                onClick={() => moveToBlock(data.blockId, data.blockName, data.floorCount)}
                className="cursor-pointer p-4 bg-white border border-black rounded-lg hover:shadow-lg transition"
              >
                <h3 className="text-center text-xl font-bold text-black">{data.blockName}</h3>
                <div className="mt-3 text-sm text-black space-y-1 text-center">
                  <p>Total Rooms: {data.totalRooms}</p>
                  <p>Total Cots: {data.totalCots}</p>
                  <p>Available Cots: {data.availableCots}</p>
                  <p>Blocked Cots: {data.blockedCots}</p>
                  <p>Booked Cots: {data.bookedCots}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
