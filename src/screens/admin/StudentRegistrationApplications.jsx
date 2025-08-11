import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStudentRegistrationApplications } from '../../services/operations/AdminAPI';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaMagnifyingGlass } from 'react-icons/fa6';
import ApplicationCard from '../../components/Admin/ApplicationCard';
import toast from 'react-hot-toast';

const StudentRegistrationApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const { token } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await dispatch(fetchStudentRegistrationApplications(token, toast));
    setApplications(response || []);
    setLoading(false);
  }, [dispatch, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const searchRollNumber = () => {
    if (!searchQuery) {
      fetchData();
      return;
    }

    const index = applications.findIndex(
      (application) => application?.instituteStudent?.rollNo === searchQuery
    );

    if (index !== -1) {
      const appToMove = applications[index];
      const rest = applications.filter((_, i) => i !== index);
      setApplications([appToMove, ...rest]);
    }
  };

  if (loading) return null;

  return (
    <div className="w-full flex flex-col items-center px-4 py-6">
      {applications && (
        <div className="w-full flex flex-col gap-4 px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <p className="text-lg font-semibold text-black">Pending Applications</p>
              <span className="bg-purple-400 text-white font-bold px-3 py-1 rounded-full">
                {applications.length}
              </span>
            </div>
            <button
              onClick={() => navigate('/admin/freezed-applications')}
              className="px-[0.5rem] py-[0.5rem] hover:animate-pulse cursor-pointer border border-gray-300 rounded-full hover:bg-[#caf0f8] transition-colors"
            >
              <FaLock size={22} className="text-gray-600" />
            </button>
          </div>

          <div className="w-full flex items-center md:justify-center justify-between gap-4">
            <input
              type="text"
              placeholder="Search with Roll No"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md border border-gray-400 rounded-lg p-2 text-black"
            />
            <button
              onClick={searchRollNumber}
              className="p-3 border hover:bg-[#caf0f8] transition-all duration-200 cursor-pointer border-black border-dotted rounded-full"
            >
              <FaMagnifyingGlass className="text-gray-500 text-lg" />
            </button>
          </div>
        </div>
      )}

      <div className="w-full flex md:flex-row flex-wrap flex-col justify-center items-stretch gap-4">
        {applications.map((application, index) => (
          <ApplicationCard
            key={index}
            application={application}
            toast={toast}
            token={token}
            fetchData={fetchData}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentRegistrationApplications;
