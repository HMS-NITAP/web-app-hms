import React, { useEffect, useState } from 'react';
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
    navigate('/admin/block-rooms', {
      state: { hostelBlockId, hostelBlockName, floorCount },
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 gap-5">
      {dashboardData && (
        <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-6">
          {/* Overall Data */}
          <div className="w-full border border-black rounded-xl bg-white border-dashed p-5">
            <h2 className="text-center text-black text-lg font-bold mb-3">
              OVERALL DATA
            </h2>
            <p className="text-black font-semibold text-sm">
              Total Registrations:{' '}
              <span>
                {dashboardData.activeStudentsCount +
                  dashboardData.freezedStudentsCount +
                  dashboardData.inactiveStudentsCount}
              </span>
            </p>
            <p className="text-black font-semibold text-sm">
              Completed Registrations:{' '}
              <span>{dashboardData.activeStudentsCount}</span>
            </p>
            <p className="text-black font-semibold text-sm">
              Freezed Registrations:{' '}
              <span>{dashboardData.freezedStudentsCount}</span>
            </p>
            <p className="text-black font-semibold text-sm">
              Pending Registrations:{' '}
              <span>{dashboardData.inactiveStudentsCount}</span>
            </p>

            <div className="mt-3" />
            <p className="text-black font-semibold text-sm">
              Total Cots:{' '}
              <span>
                {dashboardData.overallAvailableCots +
                  dashboardData.overallBlockedCots +
                  dashboardData.overallBookedCots}
              </span>
            </p>
            <p className="text-black font-semibold text-sm">
              Available Cots: <span>{dashboardData.overallAvailableCots}</span>
            </p>
            <p className="text-black font-semibold text-sm">
              Blocked Cots: <span>{dashboardData.overallBlockedCots}</span>
            </p>
            <p className="text-black font-semibold text-sm">
              Booked Cots: <span>{dashboardData.overallBookedCots}</span>
            </p>
          </div>

          {/* Hostel Blocks */}
          <h2 className="text-xl font-extrabold text-gray-600 text-center">
            HOSTEL BLOCKS
          </h2>

          <div className="w-full flex md:flex-row flex-col flex-wrap items-center gap-4">
            {dashboardData.formattedResult?.map((data, index) => (
              <button
                key={index}
                onClick={() =>
                  moveToBlock(data.blockId, data.blockName, data.floorCount)
                }
                className="cursor-pointer hover:scale-105 transition-all duration-200 md:w-[350px] w-full border border-black rounded-xl justify-center mx-auto p-4 flex flex-col items-center"
              >
                <h3 className="text-lg font-bold text-black text-center">
                  {data.blockName}
                </h3>
                <div className="flex flex-col items-center gap-1 mt-2 text-sm font-semibold text-black">
                  <p>Total Rooms: {data.totalRooms}</p>
                  <p>Total Cots: {data.totalCots}</p>
                  <p>Available Cots: {data.availableCots}</p>
                  <p>Blocked Cots: {data.blockedCots}</p>
                  <p>Booked Cots: {data.bookedCots}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
