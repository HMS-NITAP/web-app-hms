import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  fetchHostelBlockRoomsForAttendance,
  markStudentAbsent,
  markStudentPresent,
  unmarkStudentAbsent,
  unmarkStudentPresent,
} from '../../services/operations/OfficialAPI';

const TakeAttendance = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);

  const [hostelData, setHostelData] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [floorRooms, setFloorRooms] = useState(null);
  const [dateFormat, setDateFormat] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [floorCount, setFloorCount] = useState(null);

  const floorsArray = Array.from({ length: (floorCount || 0) + 1 }, (_, index) => ({
    id: index,
  }));

  const fetchData = async () => {
    setHostelData(null);
    const response = await dispatch(fetchHostelBlockRoomsForAttendance(token, toast));
    if (response) {
      setFloorCount(parseInt(response?.floorCount));
      setHostelData(response);
    }
  };

  useEffect(() => {
    if (!hostelData) return;
    const filterRooms = hostelData?.rooms.filter((room) => room?.floorNumber === selectedFloor);
    setFloorRooms(filterRooms);
  }, [selectedFloor, hostelData]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    setDateFormat(selectedDate);
  }, [selectedDate]);

  const findStatus = (presentDays, absentDays) => {
    const isMarkedPresent = presentDays.includes(dateFormat);
    const isMarkedAbsent = absentDays.includes(dateFormat);
    if (isMarkedPresent) {
      return 'PRESENT';
    } else if (isMarkedAbsent) {
      return 'ABSENT';
    } else {
      return 'NM';
    }
  };

  const handleMarkPresent = async (id) => {
    if (dateFormat) {
      setIsButtonDisabled(true);
      const response = await dispatch(markStudentPresent(dateFormat, id, token, toast));
      if (response) {
        fetchData();
      }
      setIsButtonDisabled(false);
    }
  };

  const handleMarkAbsent = async (id) => {
    if (dateFormat) {
      setIsButtonDisabled(true);
      const response = await dispatch(markStudentAbsent(dateFormat, id, token, toast));
      if (response) {
        fetchData();
      }
      setIsButtonDisabled(false);
    }
  };

  const handleUnmarkPresent = async (id) => {
    if (dateFormat) {
      setIsButtonDisabled(true);
      const response = await dispatch(unmarkStudentPresent(dateFormat, id, token, toast));
      if (response) {
        fetchData();
      }
      setIsButtonDisabled(false);
    }
  };

  const handleUnmarkAbsent = async (id) => {
    if (dateFormat) {
      setIsButtonDisabled(true);
      const response = await dispatch(unmarkStudentAbsent(dateFormat, id, token, toast));
      if (response) {
        fetchData();
      }
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4 py-6">
      {!hostelData ? (
        <div className="text-center text-black text-lg font-semibold">No Hostel Block Assigned</div>
      ) : (
        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full flex flex-col items-center">
            <span className="text-black text-lg font-bold">
              Assigned Hostel Block: {hostelData?.name}
            </span>
          </div>
          {floorCount !== null && (
            <div className="flex flex-row items-center gap-4">
              <span className="text-black font-semibold text-base">Select Floor:</span>
              <div className="flex flex-row flex-wrap gap-2 max-w-[70%]">
                {floorsArray?.map((floor, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFloor(floor?.id)}
                    className={`px-4 py-1 rounded-full border font-bold ${
                      selectedFloor === floor?.id
                        ? 'bg-[#b5e48c] border-transparent'
                        : 'bg-white border-black'
                    }`}
                    disabled={isButtonDisabled}
                  >
                    {floor?.id}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-row items-center gap-4">
            <label className="font-medium text-black">Date:</label>
            <input
              type="date"
              className="p-2 border border-gray-400 rounded-lg text-black"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
            <span className="font-bold text-black">
              {selectedDate ? `Selected: ${new Date(selectedDate).toLocaleDateString()}` : 'No date selected'}
            </span>
          </div>
          {selectedFloor !== null &&
            selectedDate &&
            floorRooms?.map((room, index) => (
              <div
                key={index}
                className="w-full border-2 border-dashed border-black rounded-xl flex flex-col gap-4 justify-center items-center px-4 py-4"
              >
                <span className="text-center font-extrabold text-lg text-[#1b263b]">
                  Room {room?.roomNumber}
                </span>
                <div className="w-full flex flex-col gap-3">
                  {room.cots.map(
                    (cot, cotIndex) =>
                      cot?.status === 'BOOKED' &&
                      cot?.student !== null &&
                      cot?.student?.attendence !== null && (
                        <div
                          key={cotIndex}
                          className={`flex flex-row justify-between items-center w-full mx-auto border border-dotted border-black rounded-xl p-3 ${
                            findStatus(
                              cot?.student?.attendence?.presentDays,
                              cot?.student?.attendence?.absentDays
                            ) === 'NM'
                              ? ''
                              : findStatus(
                                  cot?.student?.attendence?.presentDays,
                                  cot?.student?.attendence?.absentDays
                                ) === 'PRESENT'
                              ? 'bg-[#b5e48c]'
                              : 'bg-[#ffccd5]'
                          }`}
                        >
                          <div className="max-w-[70%] flex flex-col items-center gap-1">
                            <span className="text-black font-bold text-lg">Cot {cot?.cotNo}</span>
                            <span className="text-black font-medium text-base">{cot?.student?.name}</span>
                            <span className="text-black font-medium text-base">{cot?.student?.rollNo}</span>
                          </div>
                          <div>
                            {findStatus(
                              cot?.student?.attendence?.presentDays,
                              cot?.student?.attendence?.absentDays
                            ) === 'NM' ? (
                              <div className="flex flex-row gap-2">
                                <button
                                  disabled={isButtonDisabled}
                                  onClick={() => handleMarkPresent(cot?.student?.attendence?.id)}
                                  className={`border border-black bg-[#b5e48c] px-3 py-1 rounded-full font-bold text-black ${
                                    isButtonDisabled ? 'opacity-50' : ''
                                  }`}
                                >
                                  P
                                </button>
                                <button
                                  disabled={isButtonDisabled}
                                  onClick={() => handleMarkAbsent(cot?.student?.attendence?.id)}
                                  className={`border border-black bg-[#ffccd5] px-3 py-1 rounded-full font-bold text-black ${
                                    isButtonDisabled ? 'opacity-50' : ''
                                  }`}
                                >
                                  A
                                </button>
                              </div>
                            ) : findStatus(
                                cot?.student?.attendence?.presentDays,
                                cot?.student?.attendence?.absentDays
                              ) === 'PRESENT' ? (
                              <button
                                disabled={isButtonDisabled}
                                onClick={() => handleUnmarkPresent(cot?.student?.attendence?.id)}
                                className={`border border-black bg-white px-3 py-1 rounded-full font-bold text-black ${
                                  isButtonDisabled ? 'opacity-50' : ''
                                }`}
                              >
                                UP
                              </button>
                            ) : (
                              <button
                                disabled={isButtonDisabled}
                                onClick={() => handleUnmarkAbsent(cot?.student?.attendence?.id)}
                                className={`border border-black bg-white px-3 py-1 rounded-full font-bold text-black ${
                                  isButtonDisabled ? 'opacity-50' : ''
                                }`}
                              >
                                UA
                              </button>
                            )}
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default TakeAttendance;