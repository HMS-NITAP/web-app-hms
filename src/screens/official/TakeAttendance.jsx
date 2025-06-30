import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHostelBlockRoomsForAttendance,
  markStudentAbsent,
  markStudentPresent,
  unmarkStudentAbsent,
  unmarkStudentPresent
} from '../../services/operations/OfficialAPI';

const TakeAttendance = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(s => s.Auth);

  const [hostelData, setHostelData] = useState(null);
  const [floorCount, setFloorCount] = useState(0);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [floorRooms, setFloorRooms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateFormat, setDateFormat] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const floorsArray = [...Array(floorCount + 1).keys()];

  const fetchData = async () => {
    setHostelData(null);
    const resp = await dispatch(fetchHostelBlockRoomsForAttendance(token, toast));
    if (resp) {
      setHostelData(resp);
      setFloorCount(parseInt(resp.floorCount));
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  useEffect(() => {
    if (hostelData && selectedFloor >= 0) {
      const rooms = hostelData.rooms.filter(r => r.floorNumber === selectedFloor);
      setFloorRooms(rooms);
    }
  }, [hostelData, selectedFloor]);

  useEffect(() => {
    const d = selectedDate;
    const f = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    setDateFormat(f);
  }, [selectedDate]);

  const findStatus = (present, absent) =>
    present.includes(dateFormat) ? 'PRESENT' :
    absent.includes(dateFormat) ? 'ABSENT' : 'NM';

  const action = async (fn, id) => {
    if (!dateFormat) return;
    setIsButtonDisabled(true);
    await dispatch(fn(dateFormat, id, token, toast));
    await fetchData();
    setIsButtonDisabled(false);
  };

  return (
    <div className="p-4 space-y-6">
      {!hostelData ? (
        <p className="text-center font-medium">No Hostel Block Assigned</p>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">
            Assigned Hostel Block: {hostelData.name}
          </h2>

          <div className="flex items-center justify-center gap-2">
            <span>Select Floor:</span>
            {floorsArray.map(f => (
              <button
                key={f}
                onClick={() => setSelectedFloor(f)}
                className={`px-3 py-1 rounded ${
                  selectedFloor === f ? 'bg-green-300' : 'bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4">
            <label htmlFor="attendance-date">Select Date:</label>
            <input
              id="attendance-date"
              type="date"
              max={new Date().toISOString().split('T')[0]}
              value={dateFormat}
              onChange={e => setSelectedDate(new Date(e.target.value))}
              className="border rounded px-3 py-1"
            />
          </div>

          {selectedFloor != null &&
            floorRooms.map(room => (
              <div key={room.id} className="border rounded p-4 space-y-4">
                <h3 className="font-bold">Room {room.roomNumber}</h3>
                <div className="space-y-2">
                  {room.cots
                    .filter(c => c.status === 'BOOKED' && c.student && c.student.attendence)
                    .map(cot => {
                      const st = findStatus(
                        cot.student.attendence.presentDays,
                        cot.student.attendence.absentDays
                      );
                      return (
                        <div
                          key={cot.id}
                          className={`p-3 flex justify-between items-center border rounded ${
                            st === 'PRESENT' ? 'bg-green-100' :
                            st === 'ABSENT' ? 'bg-red-100' : ''
                          }`}
                        >
                          <div>
                            <p className="font-semibold">Cot {cot.cotNo}</p>
                            <p>{cot.student.name} ({cot.student.rollNo})</p>
                          </div>
                          <div className="space-x-2">
                            {st === 'NM' && (
                              <>
                                <button
                                  disabled={isButtonDisabled}
                                  onClick={() => action(markStudentPresent, cot.student.attendence.id)}
                                  className="px-2 py-1 bg-green-300 rounded"
                                >
                                  P
                                </button>
                                <button
                                  disabled={isButtonDisabled}
                                  onClick={() => action(markStudentAbsent, cot.student.attendence.id)}
                                  className="px-2 py-1 bg-red-300 rounded"
                                >
                                  A
                                </button>
                              </>
                            )}
                            {st === 'PRESENT' && (
                              <button
                                disabled={isButtonDisabled}
                                onClick={() => action(unmarkStudentPresent, cot.student.attendence.id)}
                                className="px-2 py-1 bg-gray-200 rounded"
                              >
                                UP
                              </button>
                            )}
                            {st === 'ABSENT' && (
                              <button
                                disabled={isButtonDisabled}
                                onClick={() => action(unmarkStudentAbsent, cot.student.attendence.id)}
                                className="px-2 py-1 bg-gray-200 rounded"
                              >
                                UA
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default TakeAttendance;
