import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFreezedStudentRegistrationApplications } from '../../services/operations/AdminAPI';
import FreezeApplicationCard from '../../components/Admin/FreezeApplicationCard';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import toast from 'react-hot-toast';

const FreezedApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const { token } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await dispatch(fetchFreezedStudentRegistrationApplications(token, toast));
    setApplications(response || []);
    setLoading(false);
  }, [token, dispatch]);

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
    <div className="w-full flex flex-col items-center px-4 py-3">
      {applications && (
        <div className="w-full flex flex-col items-center gap-4 px-4 py-4">
          <div className="flex items-center gap-4">
            <p className="font-semibold text-black text-base">Freezed Applications</p>
            <span className="py-1 px-3 bg-purple-400 text-white font-bold rounded-full">
              {applications.length}
            </span>
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
          <FreezeApplicationCard
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

export default FreezedApplications;
