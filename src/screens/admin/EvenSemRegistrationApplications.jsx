import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvenSemStudentRegistrationApplications } from '../../services/operations/AdminAPI';
import EvenSemApplicationCard from '../../components/Admin/EvenSemApplicationCard';
import toast from 'react-hot-toast';

const EvenSemRegistrationApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await dispatch(fetchEvenSemStudentRegistrationApplications(token, toast));
    setApplications(response || []);
    setLoading(false);
  }, [token, dispatch, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return null;

  return (
    <div className="w-full flex flex-col items-center px-4 py-2">
      {applications && (
        <div className="w-full flex justify-center items-center px-4 py-4">
          <div className="flex items-center gap-4">
            <p className="font-semibold text-black text-base">Pending Applications</p>
            <span className="py-1 px-3 bg-purple-400 text-white font-bold rounded-full">
              {applications.length}
            </span>
          </div>
        </div>
      )}

      <div className="w-full flex md:flex-row flex-wrap flex-col justify-center items-stretch gap-4">
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
    </div>
  );
};

export default EvenSemRegistrationApplications;
