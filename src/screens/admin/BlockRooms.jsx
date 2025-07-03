import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { downloadStudentDetailsInHostelBlockXlsxFile, fetchRoomsInHostelBlock } from '../../services/operations/AdminAPI';
import { toast } from 'react-hot-toast';
import { FaFileArrowDown } from 'react-icons/fa6';

const BlockRooms = () => {
  const [roomData, setRoomsData] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [floorRooms, setFloorRooms] = useState(null);

  const { token } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const { hostelBlockId, hostelBlockName, floorCount } = location.state;

  const floorsArray = Array.from({ length: floorCount + 1 }, (_, index) => ({
    id: index,
  }));

  const fetchData = async () => {
    if (hostelBlockId) {
      setRoomsData(null);
      const response = await dispatch(fetchRoomsInHostelBlock(hostelBlockId, token, toast));
      setRoomsData(response);
    }
  };

  useEffect(() => {
    fetchData();
  }, [hostelBlockId, token]);

  useEffect(() => {
    if (!roomData) return;
    const filterRooms = roomData.filter((room) => room?.floorNumber === selectedFloor);
    setFloorRooms(filterRooms);
  }, [selectedFloor, roomData]);

  const moveInsideRoom = (roomId) => {
    navigate('/admin/cot-details', { state: { roomId } });
  };

  const downloadData = async () => {
    dispatch(downloadStudentDetailsInHostelBlockXlsxFile(hostelBlockId, token, toast));
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-8 gap-5">
      <h1 className="text-black font-bold text-2xl text-center">{hostelBlockName}</h1>

      <div className="w-11/12 flex justify-end">
        <button onClick={downloadData} className='cursor-pointer hover:scale-105 transition-all duration-200'>
          <FaFileArrowDown className="text-gray-500 text-[1.5rem]" />
        </button>
      </div>

      {/* Floor Filter */}
      {floorCount && (
        <div className="flex flex-col sm:flex-row items-center gap-5 my-4 w-full justify-center">
          <p className="text-base font-semibold text-black">Select Floor:</p>
          <div className="flex flex-wrap gap-3 max-w-[70%] justify-center">
            {floorsArray.map((floor, index) => (
              <button
                key={index}
                onClick={() => setSelectedFloor(floor.id)}
                className={`px-4 py-2 cursor-pointer rounded-full border text-sm font-bold ${
                  selectedFloor === floor.id
                    ? 'bg-yellow-400 border-transparent hover:bg-yellow-500'
                    : 'bg-white border-black hover:bg-[#caf0f8]'
                }`}
              >
                {floor.id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rooms Grid */}
      {!floorRooms || floorRooms.length === 0 ? (
        <p className="text-red-600 font-medium text-base">No Rooms Are Present With This Requirement</p>
      ) : (
        <div className="w-11/12 flex flex-wrap justify-center items-center gap-4">
          {floorRooms.map((room, index) => (
            <button
              key={index}
              onClick={() => moveInsideRoom(room.id)}
              className="md:w-[18%] w-[30%] cursor-pointer hover:bg-[#caf0f8] hover:scale-105 border border-black border-dotted rounded-lg p-4 flex flex-col items-center justify-center transition-all duration-200"
            >
              <p className="text-center font-extrabold text-base text-[#1b263b]">
                Room {room.roomNumber}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockRooms;
