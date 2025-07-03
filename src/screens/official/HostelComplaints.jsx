import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAllResolvedHostelComplaints,
  getAllUnresolvedHostelComplaints,
  resolveHostelComplaint,
  unResolveHostelComplaint,
} from '../../services/operations/OfficialAPI';
import MainButton from '../../components/common/MainButton';
import toast from 'react-hot-toast';

const HostelComplaints = () => {
  const [complaintStatus, setComplaintStatus] = useState('UNRESOLVED');
  const [registeredComplaints, setRegisteredComplaints] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);

  const fetchRegisteredComplaints = async () => {
    setRegisteredComplaints(null);
    let data;
    if (complaintStatus === 'UNRESOLVED') {
      data = await dispatch(getAllUnresolvedHostelComplaints(token,toast));
    } else {
      data = await dispatch(getAllResolvedHostelComplaints(token,toast));
    }
    setRegisteredComplaints(data);
  };

  useEffect(() => {
    fetchRegisteredComplaints();
  }, [complaintStatus]);

  const resolveHandler = async (id) => {
    setIsButtonDisabled(true);
    await dispatch(resolveHostelComplaint(id, token, toast));
    fetchRegisteredComplaints();
    setIsButtonDisabled(false);
  };

  const unresolveHandler = async (id) => {
    setIsButtonDisabled(true);
    await dispatch(unResolveHostelComplaint(id, token, toast));
    fetchRegisteredComplaints();
    setIsButtonDisabled(false);
  };

  const getDateFormat = (date) => new Date(date).toLocaleString();

  return (
    <div className="w-full py-6 flex flex-col justify-center items-center gap-[1rem]">
      <div className="flex max-w-[95%] min-w-[95%] md:min-w-[50%] border border-black rounded-lg overflow-hidden">
        <button
          className={`w-1/2 py-2 cursor-pointer text-center font-semibold transition-all duration-200 ${
            complaintStatus === 'UNRESOLVED' ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-white hover:bg-[#caf0f8]'
          }`}
          disabled={isButtonDisabled}
          onClick={() => setComplaintStatus('UNRESOLVED')}
        >
          In Review
        </button>
        <button
          className={`w-1/2 py-2 cursor-pointer text-center font-semibold transition-all duration-200 ${
            complaintStatus === 'RESOLVED' ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-white hover:bg-[#caf0f8]'
          }`}
          disabled={isButtonDisabled}
          onClick={() => setComplaintStatus('RESOLVED')}
        >
          Resolved
        </button>
      </div>

      {registeredComplaints && complaintStatus === 'UNRESOLVED' && (
        <div className="w-full flex items-center justify-center gap-3">
          <p className="text-lg font-semibold text-black">Complaints In Review</p>
          <span className="bg-purple-400 text-white font-bold px-3 py-1 rounded-full">
            {registeredComplaints.length}
          </span>
        </div>
      )}

      <div className='w-[95%] flex md:flex-row flex-col gap-[1rem] justify-center mx-auto items-stretch flex-wrap'>
        {
          registeredComplaints && (registeredComplaints.length === 0 ? (<p className="w-full text-lg text-center font-bold text-black">No Complaints</p>) : (
            registeredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="md:w-[30%] w-full bg-gray-100 shadow-md rounded-md p-6 gap-[1rem] flex flex-col justify-between items-start"
              >
                <div className='flex flex-col gap-[0.5rem] justify-center items-start'>
                  <p><strong>Created On:</strong> {getDateFormat(complaint.createdAt)}</p>
                  <p><strong>Student Name:</strong> {complaint.instituteStudent.name}</p>
                  <p>
                    <strong>Room:</strong> room - {complaint.instituteStudent?.cot?.room?.roomNumber}, Cot - {complaint.instituteStudent?.cot?.cotNo}
                  </p>
                  <p><strong>Category:</strong> {complaint.category}</p>
                  <p><strong>About:</strong> {complaint.about}</p>

                  {complaint?.fileUrl[0] && (
                    <p>
                      <strong>Attachments:</strong>{' '}
                      <a
                        href={complaint.fileUrl[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Click Here to See
                      </a>
                    </p>
                  )}

                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      className={`font-bold ${
                        complaint.status === 'UNRESOLVED' ? 'text-orange-500' : 'text-green-600'
                      }`}
                    >
                      {complaint.status === 'RESOLVED' ? 'RESOLVED' : 'IN REVIEW'}
                    </span>
                  </p>

                  {complaint?.resolvedBy && (
                    <p>
                      <strong>Resolved By:</strong>{' '}
                      {complaint.resolvedBy.name} ({complaint.resolvedBy.designation})
                    </p>
                  )}
                  {complaint?.resolvedOn && (
                    <p>
                      <strong>Resolved On:</strong> {getDateFormat(complaint.resolvedOn)}
                    </p>
                  )}
                </div>

                <div className="mt-4 w-full flex justify-center">
                  {complaint.status === 'UNRESOLVED' ? (
                    <MainButton
                      text="Resolve Complaint"
                      isButtonDisabled={isButtonDisabled}
                      onPress={() => resolveHandler(complaint.id)}
                      backgroundColor='bg-green-500'
                    />
                  ) : (
                    <MainButton
                      text="Move to In Review"
                      isButtonDisabled={isButtonDisabled}
                      onPress={() => unresolveHandler(complaint.id)}
                    />
                  )}
                </div>
              </div>
            ))
          ))
        }
      </div>
    </div>
  );
};

export default HostelComplaints;
