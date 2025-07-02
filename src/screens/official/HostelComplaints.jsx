import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAllResolvedHostelComplaints,
  getAllUnresolvedHostelComplaints,
  resolveHostelComplaint,
  unResolveHostelComplaint,
} from '../../services/operations/OfficialAPI';
import MainButton from '../../components/common/MainButton';

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
      data = await dispatch(getAllUnresolvedHostelComplaints(token));
    } else {
      data = await dispatch(getAllResolvedHostelComplaints(token));
    }
    setRegisteredComplaints(data);
  };

  useEffect(() => {
    fetchRegisteredComplaints();
  }, [complaintStatus]);

  const resolveHandler = async (id) => {
    setIsButtonDisabled(true);
    await dispatch(resolveHostelComplaint(id, token));
    fetchRegisteredComplaints();
    setIsButtonDisabled(false);
  };

  const unresolveHandler = async (id) => {
    setIsButtonDisabled(true);
    await dispatch(unResolveHostelComplaint(id, token));
    fetchRegisteredComplaints();
    setIsButtonDisabled(false);
  };

  const getDateFormat = (date) => new Date(date).toLocaleString();

  return (
    <div className="w-full px-4 py-6 flex flex-col items-center gap-5">
      <div className="flex w-full max-w-2xl border border-black rounded-lg overflow-hidden">
        <button
          className={`w-1/2 py-2 text-center font-semibold ${
            complaintStatus === 'UNRESOLVED' ? 'bg-yellow-400' : 'bg-white'
          }`}
          disabled={isButtonDisabled}
          onClick={() => setComplaintStatus('UNRESOLVED')}
        >
          In Review
        </button>
        <button
          className={`w-1/2 py-2 text-center font-semibold ${
            complaintStatus === 'RESOLVED' ? 'bg-yellow-400' : 'bg-white'
          }`}
          disabled={isButtonDisabled}
          onClick={() => setComplaintStatus('RESOLVED')}
        >
          Resolved
        </button>
      </div>

      {registeredComplaints && complaintStatus === 'UNRESOLVED' && (
        <div className="w-full max-w-2xl flex items-center justify-center gap-3">
          <p className="text-lg font-semibold text-black">Complaints In Review</p>
          <span className="bg-purple-400 text-white font-bold px-3 py-1 rounded-full">
            {registeredComplaints.length}
          </span>
        </div>
      )}

      {registeredComplaints &&
        registeredComplaints.map((complaint) => (
          <div
            key={complaint.id}
            className="w-[90%] bg-gray-100 shadow-md rounded-md p-6 space-y-2"
          >
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

            <div className="mt-4 flex justify-center">
              {complaint.status === 'UNRESOLVED' ? (
                <MainButton
                  text="Resolve Complaint"
                  isButtonDisabled={isButtonDisabled}
                  onClick={() => resolveHandler(complaint.id)}
                  backgroundColor="#99d98c"
                />
              ) : (
                <MainButton
                  text="Move to In Review"
                  isButtonDisabled={isButtonDisabled}
                  onClick={() => unresolveHandler(complaint.id)}
                  backgroundColor="#f27059"
                />
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default HostelComplaints;
