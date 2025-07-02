import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { confirmFreezeRegistrationApplication } from '../../services/operations/AdminAPI';
import { Students } from '../../static/IndisciplinaryStudents';

const FreezeApplicationCard = ({ application, toast, token, fetchData }) => {
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const dispatch = useDispatch();

  const acceptHandler = async () => {
    setIsButtonDisabled(true);
    const formdata = new FormData();
    formdata.append('userId', application?.id);
    await dispatch(confirmFreezeRegistrationApplication(formdata, token, toast));
    fetchData();
    setAcceptModalVisible(false);
    setIsButtonDisabled(false);
  };

  const student = application?.instituteStudent;
  const isIndisciplinary = Students.includes(student?.rollNo);

  return (
    <div className={`w-full border rounded-xl p-4 ${isIndisciplinary ? 'border-red-500' : 'border-black'}`}>
      {/* Top Info */}
      <div className="flex gap-4 items-center">
        <img
          src={student?.image}
          alt="student"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="space-y-1">
          <p className="text-base font-semibold text-black">Name: <span className="font-medium">{student?.name}</span></p>
          <p className="text-base font-semibold text-black">Roll No: <span className="font-medium">{student?.rollNo}</span></p>
          <p className="text-base font-semibold text-black">Reg. No: <span className="font-medium">{student?.regNo}</span></p>
          <p className="text-base font-semibold text-black">Gender: <span className="font-medium">{student?.gender === 'M' ? 'Male' : 'Female'}</span></p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 space-y-1">
        <p className="text-base font-semibold text-black">Email ID: <span className="font-medium">{application?.email}</span></p>
        <p className="text-base font-semibold text-black">Year: <span className="font-medium">{student?.year}</span></p>
        <p className="text-base font-semibold text-black">Branch: <span className="font-medium">{student?.branch}</span></p>
        <p className="text-base font-semibold text-black">Contact: <span className="font-medium">{student?.phone}</span></p>
      </div>

      {/* Payment Info */}
      <div className="mt-4 space-y-1">
        <p className="text-base font-semibold text-black">Payment Mode: <span className="font-medium">{student?.paymentMode}</span></p>
        <p className="text-base font-semibold text-black">Paid On: <span className="font-medium">{student?.paymentDate}</span></p>
        <p className="text-base font-semibold text-black">Amount: <span className="font-medium">{student?.amountPaid}</span></p>
        {student?.instituteFeeReceipt && (
          <p className="text-sm font-medium text-black">
            Institute Fee: <a href={student?.instituteFeeReceipt} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Click Here</a>
          </p>
        )}
        {student?.hostelFeeReceipt && (
          <p className="text-sm font-medium text-black">
            Hostel Fee: <a href={student?.hostelFeeReceipt} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Click Here</a>
          </p>
        )}
      </div>

      {/* Hostel Info */}
      <div className="mt-4 space-y-1">
        <p className="text-base font-semibold text-black">Hostel Block: <span className="font-medium">{student?.hostelBlock?.name}</span></p>
        <p className="text-base font-semibold text-black">Room No: <span className="font-medium">{student?.cot?.room?.roomNumber}</span></p>
        <p className="text-base font-semibold text-black">Floor No: <span className="font-medium">{student?.cot?.room?.floorNumber}</span></p>
        <p className="text-base font-semibold text-black">Cot No: <span className="font-medium">{student?.cot?.cotNo}</span></p>
      </div>

      {/* Accept Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setAcceptModalVisible(true)}
          className="bg-lime-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-lime-600"
        >
          ACCEPT
        </button>
      </div>

      {/* Modal */}
      {acceptModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <p className="text-lg font-semibold text-center text-black mb-4">Are you sure, this application will be accepted?</p>
            <div className="flex justify-evenly mt-4">
              <button
                disabled={isButtonDisabled}
                onClick={acceptHandler}
                className={`px-4 py-2 rounded-lg font-semibold text-black bg-lime-500 ${isButtonDisabled ? 'opacity-50' : ''}`}
              >
                Accept
              </button>
              <button
                disabled={isButtonDisabled}
                onClick={() => setAcceptModalVisible(false)}
                className="px-4 py-2 rounded-lg font-semibold text-black bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreezeApplicationCard;
