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
        <div className="w-full flex flex-col items-center justify-center gap-6">
          {/* Overall Data */}
          <div className="md:w-auto w-full text-center border border-black rounded-xl mb-[1rem] bg-white border-dashed p-5">
            <h2 className="text-center text-black text-[1.5rem] font-bold mb-3">
              OVERALL DATA
            </h2>
            <div className='w-full flex md:flex-row flex-col gap-[2rem] justify-between items-center'>
              <div className='flex flex-col'>
                <p className="text-black font-semibold text-[1.1rem]">
                  Total Registrations:{' '}
                  <span>
                    {dashboardData.activeStudentsCount +
                      dashboardData.freezedStudentsCount +
                      dashboardData.inactiveStudentsCount}
                  </span>
                </p>
                <p className="text-black font-semibold text-[1.1rem]">
                  Completed Registrations:{' '}
                  <span>{dashboardData.activeStudentsCount}</span>
                </p>
                <p className="text-black font-semibold text-[1.1rem]">
                  Freezed Registrations:{' '}
                  <span>{dashboardData.freezedStudentsCount}</span>
                </p>
                <p className="text-black font-semibold text-[1.1rem]">
                  Pending Registrations:{' '}
                  <span>{dashboardData.inactiveStudentsCount}</span>
                </p>
              </div>
              <div className='flex flex-col'>
                <p className="text-black font-semibold text-[1.1rem]">
                  Total Cots:{' '}
                  <span>
                    {dashboardData.overallAvailableCots +
                      dashboardData.overallBlockedCots +
                      dashboardData.overallBookedCots}
                  </span>
                </p>
                <p className="text-black font-semibold text-[1.1rem]">
                  Available Cots: <span>{dashboardData.overallAvailableCots}</span>
                </p>
                <p className="text-black font-semibold text-[1.1rem]">
                  Blocked Cots: <span>{dashboardData.overallBlockedCots}</span>
                </p>
                <p className="text-black font-semibold text-[1.1rem]">
                  Booked Cots: <span>{dashboardData.overallBookedCots}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Hostel Blocks */}
          <h2 className="text-xl font-extrabold text-gray-600 text-center">
            HOSTEL BLOCKS
          </h2>

          <div className="w-full flex md:flex-row flex-col mx-auto flex-wrap justify-start items-center gap-[1.5rem]">
            {dashboardData.formattedResult?.map((data, index) => (
              <button
                key={index}
                onClick={() =>
                  moveToBlock(data.blockId, data.blockName, data.floorCount)
                }
                className="cursor-pointer hover:bg-[#caf0f8] hover:scale-105 transition-all duration-200 md:w-[32%] py-[1rem] w-full border border-black rounded-xl justify-center flex flex-col items-center"
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
