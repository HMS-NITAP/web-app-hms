import React, { useState, useEffect } from 'react';

const attendanceData = [
  { id: 1, presentDates: ['2022-04-15', '2022-04-17'], absentDates: ['2022-04-16'], studentId: 1 },
  { id: 2, presentDates: ['2022-04-16', '2022-04-18'], absentDates: ['2022-04-15'], studentId: 2 },
];

const studentData = [
  { id: 1, regd_no: '2022001', roll_no: '101', name: 'neymar', student_id: 1 },
  { id: 2, regd_no: '2022002', roll_no: '102', name: 'messi', student_id: 2 },
];

const roomDetails = [
  { id: 1, floor_no: 1, room_no: '101', student_id: [1, 2] },
  { id: 2, floor_no: 1, room_no: '102', student_id: [3, 4] },
];

const StudentAttendance = () => {
  const [date, setDate] = useState('');
  const [presentStudents, setPresentStudents] = useState([]);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [viewing, setViewing] = useState('present');

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPresentStudents, setFilteredPresentStudents] = useState([]);
  const [filteredAbsentStudents, setFilteredAbsentStudents] = useState([]);

  const fetchAttendance = () => {
    const filteredAttendance = attendanceData.filter(
      (item) => item.presentDates.includes(date) || item.absentDates.includes(date)
    );

    const present = filteredAttendance
      .filter((item) => item.presentDates.includes(date))
      .map((item) => ({
        id: item.id,
        student: studentData.find((s) => s.student_id === item.studentId),
      }));

    const absent = filteredAttendance
      .filter((item) => item.absentDates.includes(date))
      .map((item) => ({
        id: item.id,
        student: studentData.find((s) => s.student_id === item.studentId),
      }));

    setPresentStudents(present);
    setAbsentStudents(absent);
  };

  useEffect(() => {
    const query = searchQuery.toLowerCase();

    const filteredPresent = presentStudents.filter(
      (s) =>
        s.student.regd_no.toLowerCase().includes(query) ||
        s.student.name.toLowerCase().includes(query)
    );

    const filteredAbsent = absentStudents.filter(
      (s) =>
        s.student.regd_no.toLowerCase().includes(query) ||
        s.student.name.toLowerCase().includes(query)
    );

    setFilteredPresentStudents(filteredPresent);
    setFilteredAbsentStudents(filteredAbsent);
  }, [searchQuery, presentStudents, absentStudents]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Date Input */}
      <input
        type="text"
        placeholder="Enter Date (YYYY-MM-DD)"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
      />

      {/* Submit Button */}
      <button
        onClick={fetchAttendance}
        className="w-full bg-blue-600 text-white py-2 rounded mb-4 hover:bg-blue-700 transition"
      >
        Submit
      </button>

      {/* View Toggle */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setViewing('present')}
          className={`px-4 py-2 rounded ${
            viewing === 'present' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Present
        </button>
        <button
          onClick={() => setViewing('absent')}
          className={`px-4 py-2 rounded ${
            viewing === 'absent' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Absent
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Regd No or Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
      />

      {/* Attendance List */}
      <div>
        {viewing === 'present' && filteredPresentStudents.length > 0 ? (
          <div>
            <h2 className="font-bold text-lg mb-2">Present Students:</h2>
            {filteredPresentStudents.map((student) => {
              const room = roomDetails.find((room) =>
                room.student_id.includes(student.student.student_id)
              );
              return (
                <div key={student.id} className="mb-2 text-black">
                  {student.student.name} - Room: {room?.room_no || 'N/A'}
                </div>
              );
            })}
          </div>
        ) : viewing === 'absent' && filteredAbsentStudents.length > 0 ? (
          <div>
            <h2 className="font-bold text-lg mb-2">Absent Students:</h2>
            {filteredAbsentStudents.map((student) => {
              const room = roomDetails.find((room) =>
                room.student_id.includes(student.student.student_id)
              );
              return (
                <div key={student.id} className="mb-2 text-black">
                  {student.student.name} - Room: {room?.room_no || 'N/A'}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-700">No {viewing} students found.</p>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
