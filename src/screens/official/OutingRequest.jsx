import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAllPendingApplicationByHostelBlock,
  getAllInprogressApplicationByHostelBlock,
  getAllCompletedApplicationByHostelBlock,
  getAllReturnedApplicationByHostelBlock,
} from '../../services/operations/OfficialAPI';
import OutingRequestCard from '../../components/official/OutingRequestCard';

const OutingRequest = () => {
  const [applicationType, setApplicationType] = useState('PENDING');
  const [outingApplication, setOutingApplication] = useState(null);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);

  const fetchOutingRequest = useCallback(async () => {
    setOutingApplication(null);
    let data = [];

    try {
      if (applicationType === 'PENDING') {
        data = await dispatch(getAllPendingApplicationByHostelBlock(token, toast));
      } else if (applicationType === 'INPROGRESS') {
        data = await dispatch(getAllInprogressApplicationByHostelBlock(token, toast));
      } else if (applicationType === 'COMPLETED') {
        data = await dispatch(getAllCompletedApplicationByHostelBlock(token, toast));
      } else if (applicationType === 'RETURNED') {
        data = await dispatch(getAllReturnedApplicationByHostelBlock(token, toast));
      }
      setOutingApplication(data);
    } catch (error) {
        console.log(error);
      toast.error('Failed to fetch outing applications');
    }
  }, [token, dispatch, applicationType]);

  useEffect(() => {
    fetchOutingRequest();
  }, [fetchOutingRequest]);

  const buttons = [
    { type: 'PENDING', label: 'Pending' },
    { type: 'INPROGRESS', label: 'In Progress' },
    { type: 'RETURNED', label: 'Returned' },
    { type: 'COMPLETED', label: 'Completed' },
  ];

  return (
    <div className="w-full flex flex-col items-center px-4 py-6 gap-6">
      {/* Tabs */}
      <div className="w-full max-w-3xl grid grid-cols-4 border border-black rounded-md overflow-hidden">
        {buttons.map((btn) => (
          <button
            key={btn.type}
            onClick={() => setApplicationType(btn.type)}
            className={`py-2 text-center font-semibold ${
              applicationType === btn.type ? 'bg-yellow-400' : 'bg-white'
            } text-black border-r last:border-r-0`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-4">
        {!outingApplication ? (
          <p className="font-bold text-black text-lg">Please Wait...</p>
        ) : outingApplication.length === 0 ? (
          <p className="font-semibold text-black text-base">No Applications Found</p>
        ) : (
          outingApplication.map((application, index) => (
            <OutingRequestCard
              key={index}
              application={application}
              token={token}
              toast={toast}
              fetchOutingRequest={fetchOutingRequest}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OutingRequest;
