import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentRegistrationApplications } from '../../services/operations/AdminAPI';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa6'; // react-icons equivalent of FontAwesome6 lock icon
import ApplicationCard from '../../components/Admin/ApplicationCard';

const StudentRegistrationApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    const response = await dispatch(fetchStudentRegistrationApplications(token, toast));
    setApplications(response || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <>
      {!loading && (
        <div className="w-full flex flex-col items-center justify-start px-4 py-3">
          {applications && (
            <div className="w-full flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                <p className="font-semibold text-black text-base">Pending Applications</p>
                <span className="py-1 px-3 bg-[#9c89b8] text-white font-extrabold rounded-full">
                  {applications.length}
                </span>
              </div>
              <button onClick={() => navigate('/freezed-applications')}>
                <FaLock size={22} className="text-gray-600 hover:text-gray-800 transition" />
              </button>
            </div>
          )}

          <div className="w-full flex flex-col items-center gap-4">
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
      )}
    </>
  );
};

export default StudentRegistrationApplications;
