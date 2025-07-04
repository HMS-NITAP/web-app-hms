import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllStudentHostelComplaint } from '../../services/operations/StudentAPI';
import toast from 'react-hot-toast';

const RegisterComplaints = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);
  const [complaintsRegistered, setComplaintsRegistered] = useState([]);

  const fetchData = async () => {
    setComplaintsRegistered(null);
    const data = await dispatch(getAllStudentHostelComplaint(token, toast));
    setComplaintsRegistered(data);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const getDateFormat = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleString();
  };

  return (
    <div className="w-full px-4 py-6 flex flex-col justify-center items-center">
      {complaintsRegistered && (
        <div className="w-full flex justify-center items-center py-4">
          <div className="flex gap-4 items-center">
            <span className="font-semibold text-black text-base">Total Complaints Registered</span>
            <span className="px-3 py-1 bg-purple-400 text-white font-bold rounded-full">{complaintsRegistered.length}</span>
          </div>
        </div>
      )}

      <div className='w-full flex md:flex-row flex-col flex-wrap gap-[1rem] justify-center md:items-stretch items-center'>
        {complaintsRegistered &&
          complaintsRegistered.map((complaint) => (
            <div
              key={complaint?.id}
              className="w-[95%] md:w-[30%] flex flex-col bg-gray-100 rounded-lg shadow-md p-4"
            >
              <p className="text-base font-bold text-gray-800 mb-1">
                Registered On:{' '}
                <span className="font-normal text-gray-600">
                  {getDateFormat(complaint.createdAt)}
                </span>
              </p>
              <p className="text-base font-bold text-gray-800 mb-1">
                Category:{' '}
                <span className="font-normal text-gray-600">{complaint.category}</span>
              </p>
              <p className="text-base font-bold text-gray-800 mb-1">
                About:{' '}
                <span className="font-normal text-gray-600">{complaint.about}</span>
              </p>
              <p className="text-base font-bold text-gray-800 mb-1">
                Status:{' '}
                <span
                  className={`font-extrabold ${
                    complaint?.status === 'RESOLVED' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {complaint.status === 'RESOLVED' ? 'RESOLVED' : 'IN REVIEW'}
                </span>
              </p>
              {complaint?.fileUrl[0] && (
                <p className="text-base font-bold text-gray-800 mb-1">
                  Attachments:{' '}
                  <a
                    href={complaint?.fileUrl[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-normal text-blue-600 underline"
                  >
                    Click Here to See
                  </a>
                </p>
              )}
              {complaint?.resolvedOn && (
                <p className="text-base font-bold text-gray-800 mb-1">
                  Resolved On:{' '}
                  <span className="font-normal text-gray-600">
                    {getDateFormat(complaint?.resolvedOn)}
                  </span>
                </p>
              )}
              {complaint?.resolvedById && (
                <p className="text-base font-bold text-gray-800 mb-1">
                  Resolved By:{' '}
                  <span className="font-normal text-gray-600">
                    {complaint?.resolvedBy?.name} ({complaint?.resolvedBy?.designation})
                  </span>
                </p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default RegisterComplaints;