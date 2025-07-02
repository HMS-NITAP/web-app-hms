import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { acceptRegistrationApplication, freezeRegistrationApplication, rejectRegistrationApplication } from '../../services/operations/AdminAPI';
import { Students } from '../../static/IndisciplinaryStudents';
import MainButton from '../common/MainButton';

const ApplicationCard = ({ application, toast, token, fetchData }) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [freezeModalVisible, setFreezeModalVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();

  const acceptHandler = async () => {
    setIsButtonDisabled(true);
    let formdata = new FormData();
    formdata.append("userId", application?.id);
    await dispatch(acceptRegistrationApplication(formdata, token, toast));
    fetchData();
    setAcceptModalVisible(false);
    setIsButtonDisabled(false);
  };

  const rejectHandler = async (data) => {
    setIsButtonDisabled(true);
    let formdata = new FormData();
    formdata.append("userId", application?.id);
    formdata.append("remarks", data?.remarks);
    await dispatch(rejectRegistrationApplication(formdata, token, toast));
    fetchData();
    setRejectModalVisible(false);
    setIsButtonDisabled(false);
  };

  const freezeHandler = async (data) => {
    setIsButtonDisabled(true);
    let formdata = new FormData();
    formdata.append("userId", application?.id);
    formdata.append("remarks", data?.remarks1);
    await dispatch(freezeRegistrationApplication(formdata, token, toast));
    fetchData();
    setFreezeModalVisible(false);
    setIsButtonDisabled(false);
  };

  return (
    <div className={`w-full border ${Students.includes(application?.instituteStudent?.rollNo) ? 'border-red-500' : 'border-black'} rounded-xl p-4 flex flex-col gap-4 bg-white`}>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden relative">
          {imageLoading && <div className="absolute inset-0 flex items-center justify-center"><div className="loader"></div></div>}
          <img
            src={application?.instituteStudent?.image}
            alt=""
            className="w-full h-full object-cover"
            onLoadStart={() => setImageLoading(true)}
            onLoad={() => setImageLoading(false)}
          />
        </div>
        <div className="text-sm text-gray-800">
          <p><strong>Name:</strong> {application?.instituteStudent?.name}</p>
          <p><strong>Roll No:</strong> {application?.instituteStudent?.rollNo}</p>
          <p><strong>Reg. No:</strong> {application?.instituteStudent?.regNo}</p>
          <p><strong>Gender:</strong> {application?.instituteStudent?.gender === 'M' ? 'Male' : 'Female'}</p>
        </div>
      </div>

      <div className="text-sm text-gray-800 space-y-1">
        <p><strong>Email:</strong> {application?.email}</p>
        <p><strong>Year:</strong> {application?.instituteStudent?.year}</p>
        <p><strong>Branch:</strong> {application?.instituteStudent?.branch}</p>
        <p><strong>Phone:</strong> {application?.instituteStudent?.phone}</p>
      </div>

      <div className="text-sm text-gray-800 space-y-1">
        <p><strong>Payment Mode:</strong> {application?.instituteStudent?.paymentMode}</p>
        <p><strong>Paid On:</strong> {application?.instituteStudent?.paymentDate}</p>
        <p><strong>Amount:</strong> {application?.instituteStudent?.amountPaid}</p>
        {application?.instituteStudent?.instituteFeeReceipt && (
          <p><strong>Institute Fee:</strong> <a href={application?.instituteStudent?.instituteFeeReceipt} className="text-blue-600" target="_blank" rel="noreferrer">Click Here</a></p>
        )}
        {application?.instituteStudent?.hostelFeeReceipt && (
          <p><strong>Hostel Fee:</strong> <a href={application?.instituteStudent?.hostelFeeReceipt} className="text-blue-600" target="_blank" rel="noreferrer">Click Here</a></p>
        )}
      </div>

      <div className="text-sm text-gray-800 space-y-1">
        <p><strong>Hostel Block:</strong> {application?.instituteStudent?.hostelBlock?.name}</p>
        <p><strong>Room No:</strong> {application?.instituteStudent?.cot?.room?.roomNumber}</p>
        <p><strong>Floor No:</strong> {application?.instituteStudent?.cot?.room?.floorNumber}</p>
        <p><strong>Cot No:</strong> {application?.instituteStudent?.cot?.cotNo}</p>
      </div>

      <div className="flex justify-evenly mt-2">
        <MainButton text="ACCEPT" backgroundColor="#aacc00" onClick={() => setAcceptModalVisible(true)} />
        <MainButton text="REJECT" backgroundColor="#c9184a" textColor="white" onClick={() => setRejectModalVisible(true)} />
        <MainButton text="FREEZE" backgroundColor="#00b4d8" textColor="white" onClick={() => setFreezeModalVisible(true)} />
      </div>

      {acceptModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Accept Application</h2>
            <div className="flex justify-evenly mt-4">
              <button onClick={acceptHandler} disabled={isButtonDisabled} className="px-4 py-2 bg-lime-500 text-black font-semibold rounded disabled:opacity-50">Accept</button>
              <button onClick={() => setAcceptModalVisible(false)} disabled={isButtonDisabled} className="px-4 py-2 bg-gray-300 text-black font-semibold rounded disabled:opacity-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {rejectModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Reject Application</h2>
            <label className="block mb-1 text-sm font-medium">Reason for Rejection</label>
            <Controller
              control={control}
              name="remarks"
              rules={{ required: true }}
              render={({ field }) => (
                <textarea {...field} className="w-full border rounded p-2" rows={2} placeholder="Enter reason for rejection" />
              )}
            />
            {errors.remarks && <p className="text-red-500 text-sm mt-1">Remarks is required.</p>}
            <div className="flex justify-evenly mt-4">
              <button onClick={handleSubmit(rejectHandler)} disabled={isButtonDisabled} className="px-4 py-2 bg-red-600 text-white font-semibold rounded disabled:opacity-50">Reject</button>
              <button onClick={() => setRejectModalVisible(false)} disabled={isButtonDisabled} className="px-4 py-2 bg-gray-300 text-black font-semibold rounded disabled:opacity-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {freezeModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Freeze Application</h2>
            <label className="block mb-1 text-sm font-medium">Reason for Freezing</label>
            <Controller
              control={control}
              name="remarks1"
              rules={{ required: true }}
              render={({ field }) => (
                <textarea {...field} className="w-full border rounded p-2" rows={2} placeholder="Enter reason for freezing" />
              )}
            />
            {errors.remarks1 && <p className="text-red-500 text-sm mt-1">Remarks is required.</p>}
            <div className="flex justify-evenly mt-4">
              <button onClick={handleSubmit(freezeHandler)} disabled={isButtonDisabled} className="px-4 py-2 bg-sky-500 text-white font-semibold rounded disabled:opacity-50">Freeze</button>
              <button onClick={() => setFreezeModalVisible(false)} disabled={isButtonDisabled} className="px-4 py-2 bg-gray-300 text-black font-semibold rounded disabled:opacity-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
