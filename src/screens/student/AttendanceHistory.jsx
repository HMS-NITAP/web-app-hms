import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentAttendance } from '../../services/operations/StudentAPI';
import toast from 'react-hot-toast';

const AttendanceHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);

  const fetchAttendanceData = async () => {
    const response = await dispatch(getStudentAttendance(token, toast));
    if (response) {
      setAttendanceData(response);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const getMonthYearString = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handlePrevMonth = () => {
    const prev = new Date(selectedMonth);
    prev.setMonth(prev.getMonth() - 1);
    setSelectedMonth(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(selectedMonth);
    next.setMonth(next.getMonth() + 1);
    setSelectedMonth(next);
  };

  const getAttendanceStatus = (date) => {
    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;
    const match = attendanceData.find((a) => a.date === formatted);
    return match ? match.status : 'N/A';
  };

  const getBackgroundColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-300';
      case 'absent':
        return 'bg-red-300';
      default:
        return 'bg-gray-200';
    }
  };

  const renderCalendar = () => {
    const days = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
    const grid = [];
    for (let i = 1; i <= days; i++) {
      const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i);
      const status = getAttendanceStatus(date);
      const bgColor = getBackgroundColor(status);
      grid.push(
        <div
          key={i}
          className={`md:w-[60px] md:h-[60px] w-[45px] h-[45px] border border-gray-300 flex items-center justify-center ${bgColor} rounded-md text-black font-semibold`}
        >
          {i}
        </div>
      );
    }
    return grid;
  };

  return (
    <div className="w-full px-4 py-8 flex flex-col items-center gap-6 bg-white min-h-screen">
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-300 rounded" />
          <span className="text-gray-600 font-medium">Present Days</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-300 rounded" />
          <span className="text-gray-600 font-medium">Absent Days</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded" />
          <span className="text-gray-600 font-medium">Not Marked</span>
        </div>
      </div>

      {/* Month Header */}
      <div className="flex items-center justify-between w-full max-w-md">
        <button
          onClick={handlePrevMonth}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          &lt;
        </button>
        <h2 className="text-xl font-bold text-black">{getMonthYearString(selectedMonth)}</h2>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          &gt;
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="w-auto grid grid-cols-7 gap-[4px]">
        {renderCalendar()}
      </div>
    </div>
  );
};

export default AttendanceHistory;
