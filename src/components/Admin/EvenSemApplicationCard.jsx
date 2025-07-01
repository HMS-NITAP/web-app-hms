import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { acceptEvenSemRegistrationApplication, rejectEvenSemRegistrationApplication } from '../../services/operations/AdminAPI';
import { Students } from '../../static/IndisciplinaryStudents';

const EvenSemApplicationCard = ({ application, token, fetchData }) => {
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();

  const acceptHandler = async () => {
    setIsButtonDisabled(true);
    const formdata = new FormData();
    formdata.append("userId", application?.id);
    await dispatch(acceptEvenSemRegistrationApplication(formdata, token, toast));
    fetchData();
    setAcceptModalVisible(false);
    setIsButtonDisabled(false);
  };

  const rejectHandler = async (data) => {
    setIsButtonDisabled(true);
    const formdata = new FormData();
    formdata.append("userId", application?.id);
    formdata.append("remarks", data?.remarks);
    await dispatch(rejectEvenSemRegistrationApplication(formdata, token, toast));
    fetchData();
    setRejectModalVisible(false);
    setIsButtonDisabled(false);
  };

  return (
    <div className={`w-full p-4 rounded-xl border ${Students.includes(application?.instituteStudent?.rollNo) ? 'border-red-500' : 'border-black'}`}>
      <div className="flex items-center gap-4">
        <img
          src={application?.instituteStudent?.image}
          alt="student"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <p className="text-black font-semibold">Name: <span className="font-medium">{application?.instituteStudent?.name}</span></p>
          <p className="text-black font-semibold">Roll No: <span className="font-medium">{application?.instituteStudent?.rollNo}</span></p>
          <p className="text-black font-semibold">Reg. No: <span className="font-medium">{application?.instituteStudent?.regNo}</span></p>
          <p className="text-black font-semibold">Gender: <span className="font-medium">{application?.instituteStudent?.gender === 'M' ? 'Male' : 'Female'}</span></p>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-black font-semibold">Email ID: <span className="font-medium">{application?.email}</span></p>
        <p className="text-black font-semibold">Year: <span className="font-medium">{application?.instituteStudent?.year}</span></p>
        <p className="text-black font-semibold">Branch: <span className="font-medium">{application?.instituteStudent?.branch}</span></p>
        <p className="text-black font-semibold">Contact: <span className="font-medium">{application?.instituteStudent?.phone}</span></p>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-black font-semibold">Payment Mode: <span className="font-medium">{application?.instituteStudent?.paymentMode2}</span></p>
        <p className="text-black font-semibold">Paid On: <span className="font-medium">{application?.instituteStudent?.paymentDate2}</span></p>
        <p className="text-black font-semibold">Amount: <span className="font-medium">{application?.instituteStudent?.amountPaid2}</span></p>
        {application?.instituteStudent?.hostelFeeReceipt2 && (
          <p className="text-black font-medium">Hostel Fee Receipt: <a className="text-blue-600 underline" href={application?.instituteStudent?.hostelFeeReceipt2} target="_blank" rel="noreferrer">Click Here</a></p>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-black font-semibold">Hostel Block: <span className="font-medium">{application?.instituteStudent?.hostelBlock?.name}</span></p>
        <p className="text-black font-semibold">Room No: <span className="font-medium">{application?.instituteStudent?.cot?.room?.roomNumber}</span></p>
        <p className="text-black font-semibold">Floor No: <span className="font-medium">{application?.instituteStudent?.cot?.room?.floorNumber}</span></p>
        <p className="text-black font-semibold">Cot No: <span className="font-medium">{application?.instituteStudent?.cot?.cotNo}</span></p>
      </div>

      <div className="flex justify-evenly items-center mt-4 gap-4">
        <button className="bg-lime-500 text-black font-semibold px-4 py-2 rounded" onClick={() => setAcceptModalVisible(true)}>ACCEPT</button>
        <button className="bg-rose-600 text-white font-semibold px-4 py-2 rounded" onClick={() => setRejectModalVisible(true)}>REJECT</button>
      </div>

      {/* Accept Modal */}
      {acceptModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <p className="text-center text-black text-lg font-semibold mb-4">Are you sure, this application will be accepted?</p>
            <div className="flex justify-evenly mt-4">
              <button disabled={isButtonDisabled} onClick={acceptHandler} className="bg-lime-500 px-4 py-2 rounded font-semibold text-black disabled:opacity-50">Accept</button>
              <button disabled={isButtonDisabled} onClick={() => setAcceptModalVisible(false)} className="bg-gray-300 px-4 py-2 rounded font-semibold text-black disabled:opacity-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <p className="text-center text-black text-lg font-semibold mb-4">Are you sure, this application will be rejected?</p>
            <label className="block text-black text-sm font-medium mb-1">Reason for Rejection</label>
            <Controller
              control={control}
              name="remarks"
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <textarea {...field} className="w-full border border-gray-400 rounded p-2 text-black" rows={3} placeholder="Enter reason for rejection"></textarea>
              )}
            />
            {errors.remarks && <p className="text-red-500 text-sm mt-1">Remarks is required.</p>}
            <div className="flex justify-evenly mt-4">
              <button disabled={isButtonDisabled} onClick={handleSubmit(rejectHandler)} className="bg-rose-600 text-white px-4 py-2 rounded font-semibold disabled:opacity-50">Reject</button>
              <button disabled={isButtonDisabled} onClick={() => setRejectModalVisible(false)} className="bg-gray-300 text-black px-4 py-2 rounded font-semibold disabled:opacity-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvenSemApplicationCard;