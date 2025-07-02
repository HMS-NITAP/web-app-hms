import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentAllOutingApplication } from '../../services/operations/StudentAPI';
import toast from 'react-hot-toast';
import OutingApplicationCard from '../../components/student/OutingApplicationCard';

const ApplicationHistory = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);

  const [outingApplication, setOutingApplication] = useState(null);

  const fetchData = async () => {
    setOutingApplication(null);
    const data = await dispatch(getStudentAllOutingApplication(token, toast));
    setOutingApplication(data);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <div className="w-full px-4 py-6 flex flex-col items-center">
      {
        !outingApplication ? (
          <p className="text-center text-black font-semibold text-lg">Please Wait...</p>
        ) : (
          <div className="w-full flex flex-col items-center gap-6">
            
            {/* Total Count */}
            <div className="flex items-center gap-4">
              <span className="text-black font-semibold text-base">Total Applications</span>
              <span className="bg-purple-400 text-white font-bold px-4 py-1 rounded-full">{outingApplication.length}</span>
            </div>

            {/* Applications List */}
            <div className="w-[90%] md:w-[35%] flex md:flex-row flex-col gap-[2rem] flex-wrap items-center">
              {
                outingApplication.map((application, index) => (
                  <OutingApplicationCard
                    key={index}
                    application={application}
                    toast={toast}
                    token={token}
                    fetchData={fetchData}
                  />
                ))
              }
            </div>
          </div>
        )
      }
    </div>
  );
};

export default ApplicationHistory;
