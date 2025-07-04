import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAllPendingApplicationByHostelBlock,
  getAllInprogressApplicationByHostelBlock,
  getAllCompletedApplicationByHostelBlock,
  getAllReturnedApplicationByHostelBlock
} from '../../services/operations/OfficialAPI';
import OutingRequestCard from '../../components/official/OutingRequestCard';
import toast from 'react-hot-toast';

const OutingRequest = () => {
  const [applicationType, setApplicationType] = useState('PENDING');
  const [outingApplication, setOutingApplication] = useState(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);

  const fetchOutingRequest = async () => {
    setOutingApplication(null);
    let data;
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
  };

  useEffect(() => {
    fetchOutingRequest();
  }, [token, applicationType]);

  return (
    <div className="w-full flex flex-col items-center px-4 py-6 gap-6">
      {/* Tabs */}
      <div className="w-full max-w-3xl flex border border-black rounded-lg overflow-hidden">
        {['PENDING', 'INPROGRESS', 'RETURNED', 'COMPLETED'].map((type) => (
          <button
            key={type}
            onClick={() => setApplicationType(type)}
            className={`w-1/4 cursor-pointer ${applicationType === type ? 'hover:bg-yellow-500' : 'hover:bg-[#caf0f8]'} transition-all duration-200 py-2 text-center font-medium ${
              applicationType === type ? 'bg-yellow-400' : 'bg-white'
            } text-black border-r last:border-r-0`}
          >
            {type === 'PENDING'
              ? 'Pending'
              : type === 'INPROGRESS'
              ? 'In Progress'
              : type.charAt(0) + type.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="w-full flex md:flex-row flex-col flex-wrap gap-[1.5rem] justify-center items-stretch">
        {!outingApplication ? (
          <div className="flex justify-center items-center mt-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-black text-lg font-bold">Please Wait...</p>
                </div>
          </div>
        ) : outingApplication.length === 0 ? (
          <p className="text-lg text-center font-semibold text-black">No Applications Found</p>
        ) : (
          outingApplication.map((application, index) => (
            <OutingRequestCard
              key={index}
              application={application}
              toast={toast}
              token={token}
              fetchOutingRequest={fetchOutingRequest}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OutingRequest;
