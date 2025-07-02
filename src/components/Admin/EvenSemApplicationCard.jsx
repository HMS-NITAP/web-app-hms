import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import {
  acceptEvenSemRegistrationApplication,
  rejectEvenSemRegistrationApplication
} from '../../services/operations/AdminAPI';
import { Students } from '../../static/IndisciplinaryStudents';

const EvenSemApplicationCard = ({ application, token, fetchData }) => {
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();
  const dispatch = useDispatch();

  const acceptHandler = async () => {
    setIsButtonDisabled(true);
    const formdata = new FormData();
    formdata.append('userId', application?.id);
    await dispatch(acceptEvenSemRegistrationApplication(formdata, token, toast));
    fetchData();
    setAcceptModalVisible(false);
    setIsButtonDisabled(false);
  };

  const rejectHandler = async (data) => {
    setIsButtonDisabled(true);
    const formdata = new FormData();
    formdata.append('userId', application?.id);
    formdata.append('remarks', data?.remarks);
    await dispatch(rejectEvenSemRegistrationApplication(formdata, token, toast));
    fetchData();
    setRejectModalVisible(false);
    setIsButtonDisabled(false);
    reset();
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
        <p className="text-base font-semibold text-black">Payment Mode: <span className="font-medium">{student?.paymentMode2}</span></p>
        <p className="text-base font-semibold text-black">Paid On: <span className="font-medium">{student?.paymentDate2}</span></p>
        <p className="text-base font-semibold text-black">Amount: <span className="font-medium">{student?.amountPaid2}</span></p>
        {student?.hostelFeeReceipt2 && (
          <p className="text-sm font-medium text-black">
            Hostel Fee Receipt: <a href={student?.hostelFeeReceipt2} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Click Here</a>
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

      {/* Buttons */}
      <div className="mt-4 flex justify-evenly items-center gap-4">
        <button
          onClick={() => setAcceptModalVisible(true)}
          className="bg-lime-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-lime-600"
        >
          ACCEPT
        </button>
        <button
          onClick={() => setRejectModalVisible(true)}
          className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700"
        >
          REJECT
        </button>
      </div>

      {/* Reject Modal */}
      {rejectModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <p className="text-lg font-semibold text-center text-black mb-4">Are you sure, this application will be rejected?</p>
            <p className="text-sm font-medium text-black mb-1">Reason for Rejection</p>
            <Controller
              name="remarks"
              control={control}
              defaultValue=""
              rules={{ required: 'Remarks is required.' }}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  className="w-full border border-gray-400 rounded-lg p-2 text-black"
                  placeholder="Enter reason for rejection"
                />
              )}
            />
            {errors.remarks && <p className="text-red-600 text-sm mt-1">{errors.remarks.message}</p>}
            <div className="flex justify-evenly mt-4">
              <button
                disabled={isButtonDisabled}
                onClick={handleSubmit(rejectHandler)}
                className={`px-4 py-2 rounded-lg font-semibold text-white bg-red-600 ${isButtonDisabled && 'opacity-50'}`}
              >
                Reject
              </button>
              <button
                disabled={isButtonDisabled}
                onClick={() => setRejectModalVisible(false)}
                className="px-4 py-2 rounded-lg font-semibold text-black bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Modal */}
      {acceptModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <p className="text-lg font-semibold text-center text-black mb-4">Are you sure, this application will be accepted?</p>
            <div className="flex justify-evenly mt-4">
              <button
                disabled={isButtonDisabled}
                onClick={acceptHandler}
                className={`px-4 py-2 rounded-lg font-semibold text-black bg-lime-500 ${isButtonDisabled && 'opacity-50'}`}
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

export default EvenSemApplicationCard;
