import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchEvenSemStudentRegistrationApplications } from '../../services/operations/AdminAPI';
import EvenSemApplicationCard from '../../components/Admin/EvenSemApplicationCard';

const EvenSemRegistrationApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();

  const fetchData = async () => {
    setLoading(true);
    const response = await dispatch(fetchEvenSemStudentRegistrationApplications(token, toast));
    setApplications(response || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-6">
      {!loading && (
        <>
          <div className="w-full flex flex-row justify-between items-center bg-white p-4 rounded shadow mb-4">
            <div className="flex items-center gap-4">
              <p className="text-lg font-semibold text-black">Pending Applications</p>
              <span className="bg-purple-400 text-white font-bold px-3 py-1 rounded-full">
                {applications.length}
              </span>
            </div>
            {/* Uncomment if needed
            <button onClick={() => navigate("/freezed-applications")}>
              <LockIcon className="text-gray-500 w-6 h-6" />
            </button>
            */}
          </div>

          <div className="w-full flex flex-col items-center gap-4">
            {applications.map((application, index) => (
              <EvenSemApplicationCard
                key={index}
                application={application}
                toast={toast}
                token={token}
                fetchData={fetchData}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EvenSemRegistrationApplications;
