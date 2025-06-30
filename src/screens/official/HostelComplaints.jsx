import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllResolvedHostelComplaints, getAllUnresolvedHostelComplaints, resolveHostelComplaint, unResolveHostelComplaint } from '../../services/operations/OfficialAPI';
import MainButton from '../../components/common/MainButton';
import { toast } from 'react-hot-toast';

const HostelComplaints = () => {
  const [complaintStatus, setComplaintStatus] = useState("UNRESOLVED");
  const [registeredComplaints, setRegisteredComplaints] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);

  const fetchRegisteredComplaints = async () => {
    setRegisteredComplaints(null);
    let data;
    if (complaintStatus === "UNRESOLVED") {
      data = await dispatch(getAllUnresolvedHostelComplaints(token, toast));
    } else {
      data = await dispatch(getAllResolvedHostelComplaints(token, toast));
    }
    setRegisteredComplaints(data);
  };

  useEffect(() => {
    fetchRegisteredComplaints();
  }, [complaintStatus]);

  const resolveHandler = async (complaintId) => {
    setIsButtonDisabled(true);
    await dispatch(resolveHostelComplaint(complaintId, token, toast));
    fetchRegisteredComplaints();
    setIsButtonDisabled(false);
  };

  const unresolveHandler = async (complaintId) => {
    setIsButtonDisabled(true);
    await dispatch(unResolveHostelComplaint(complaintId, token, toast));
    fetchRegisteredComplaints();
    setIsButtonDisabled(false);
  };

  const getDateFormat = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleString();
  };

  return (
    <div className="w-full p-4 flex flex-col items-center gap-4">
      
      {/* Status Toggle Buttons */}
      <div className="w-full max-w-md flex border border-black rounded overflow-hidden">
        <button
          disabled={isButtonDisabled}
          onClick={() => setComplaintStatus("UNRESOLVED")}
          className={`w-1/2 py-2 text-center ${complaintStatus === "UNRESOLVED" ? "bg-yellow-300" : "bg-white"} ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          In Review
        </button>
        <button
          disabled={isButtonDisabled}
          onClick={() => setComplaintStatus("RESOLVED")}
          className={`w-1/2 py-2 text-center ${complaintStatus === "RESOLVED" ? "bg-yellow-300" : "bg-white"} ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Resolved
        </button>
      </div>

      {/* Complaints Header */}
      {registeredComplaints && complaintStatus === "UNRESOLVED" && (
        <div className="w-full flex justify-center items-center p-4">
          <div className="flex gap-3 items-center">
            <span className="font-semibold text-black text-lg">Complaints In Review</span>
            <span className="py-1 px-3 bg-purple-500 text-white font-bold rounded-full">
              {registeredComplaints?.length}
            </span>
          </div>
        </div>
      )}

      {/* Complaint Cards */}
      {registeredComplaints && registeredComplaints.map((complaint) => (
        <div key={complaint?.id} className="w-[90%] bg-gray-100 p-4 rounded shadow border border-gray-300">
          <p className="font-bold text-gray-800">Created On: <span className="font-normal text-gray-600">{getDateFormat(complaint.createdAt)}</span></p>
          <p className="font-bold text-gray-800">Student Name: <span className="font-normal text-gray-600">{complaint.instituteStudent.name}</span></p>
          <p className="font-bold text-gray-800">Student Room No: <span className="font-normal text-gray-600">room - {complaint?.instituteStudent?.cot?.room?.roomNumber}, Cot - {complaint?.instituteStudent?.cot?.cotNo}</span></p>
          <p className="font-bold text-gray-800">Category: <span className="font-normal text-gray-600">{complaint.category}</span></p>
          <p className="font-bold text-gray-800">About: <span className="font-normal text-gray-600">{complaint.about}</span></p>

          {/* Attachment Link */}
          {complaint?.fileUrl[0] && (
            <p className="font-bold text-gray-800">
              Attachments: <a href={complaint?.fileUrl[0]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Click Here to See</a>
            </p>
          )}

          {/* Status */}
          <p className="font-bold text-gray-800">
            Status: <span className={`font-extrabold ${complaint?.status === "UNRESOLVED" ? "text-orange-500" : "text-green-600"}`}>
              {complaint.status === "RESOLVED" ? "RESOLVED" : "IN REVIEW"}
            </span>
          </p>

          {/* Resolved By / On */}
          {complaint?.resolvedBy && (
            <p className="font-bold text-gray-800">
              Resolved By: <span className="font-normal text-gray-600">{complaint?.resolvedBy?.name} ({complaint?.resolvedBy?.designation})</span>
            </p>
          )}
          {complaint?.resolvedOn && (
            <p className="font-bold text-gray-800">
              Resolved On: <span className="font-normal text-gray-600">{getDateFormat(complaint?.resolvedOn)}</span>
            </p>
          )}

          {/* Action Button */}
          <div className="flex justify-evenly items-center mt-4">
            {complaint?.status === 'UNRESOLVED' ? (
              <MainButton
                isButtonDisabled={isButtonDisabled}
                text="Resolve Complaint"
                backgroundColor="#99d98c"
                onPress={() => resolveHandler(complaint?.id)}
              />
            ) : (
              <MainButton
                isButtonDisabled={isButtonDisabled}
                text="Move to In Review"
                backgroundColor="#f27059"
                onPress={() => unresolveHandler(complaint?.id)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HostelComplaints;
