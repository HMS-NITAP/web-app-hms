import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { acceptRegistrationApplication, freezeRegistrationApplication, rejectRegistrationApplication } from '../../services/operations/AdminAPI';
import MainButton from '../common/MainButton';
import { Students } from '../../static/IndisciplinaryStudents';

const ApplicationCard = ({ application, toast, token, fetchData }) => {
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [freezeModalVisible, setFreezeModalVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();

  const acceptHandler = async () => {
    setIsButtonDisabled(true);
    const formdata = new FormData();
    formdata.append("userId", application?.id);
    await dispatch(acceptRegistrationApplication(formdata, token, toast));
    fetchData();
    setAcceptModalVisible(false);
    setIsButtonDisabled(false);
  };

  const rejectHandler = async (data) => {
    setIsButtonDisabled(true);
    const formdata = new FormData();
    formdata.append("userId", application?.id);
    formdata.append("remarks", data?.remarks);
    await dispatch(rejectRegistrationApplication(formdata, token, toast));
    fetchData();
    setRejectModalVisible(false);
    setIsButtonDisabled(false);
  };

  const freezeHandler = async (data) => {
    setIsButtonDisabled(true);
    const formdata = new FormData();
    formdata.append("userId", application?.id);
    formdata.append("remarks", data?.remarks1);
    await dispatch(freezeRegistrationApplication(formdata, token, toast));
    fetchData();
    setFreezeModalVisible(false);
    setIsButtonDisabled(false);
  };

  const modalWrapper = (visible, setVisible, title, field, submitFn, placeholderText) => {
    if (!visible) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-md w-[90%] max-w-md">
          <h2 className="text-lg font-semibold text-center mb-4">{title}</h2>
          <label className="text-sm text-gray-800">Reason</label>
          <Controller
            control={control}
            name={field}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <textarea
                {...field}
                rows={3}
                placeholder={placeholderText}
                className="w-full border border-gray-300 p-2 rounded text-black mt-1"
              />
            )}
          />
          {errors[field] && <p className="text-red-500 text-sm mt-1">Remarks is required.</p>}
          <div className="flex justify-between mt-4">
            <button
              disabled={isButtonDisabled}
              onClick={handleSubmit(submitFn)}
              className={`px-4 py-2 rounded text-white font-semibold ${isButtonDisabled ? 'opacity-50' : ''} ${field === "remarks" ? 'bg-red-600' : 'bg-sky-600'}`}
            >
              {field === "remarks" ? 'Reject' : 'Freeze'}
            </button>
            <button
              disabled={isButtonDisabled}
              onClick={() => setVisible(false)}
              className="px-4 py-2 rounded bg-gray-300 text-black font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const acceptModal = () => (
    acceptModalVisible && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-md w-[90%] max-w-md text-center">
          <h2 className="text-lg font-semibold mb-4 text-black">Are you sure you want to accept this application?</h2>
          <div className="flex justify-between mt-4">
            <button
              disabled={isButtonDisabled}
              onClick={acceptHandler}
              className={`px-4 py-2 rounded font-semibold ${isButtonDisabled ? 'opacity-50' : ''} bg-lime-500 text-black`}
            >
              Accept
            </button>
            <button
              disabled={isButtonDisabled}
              onClick={() => setAcceptModalVisible(false)}
              className="px-4 py-2 rounded bg-gray-300 text-black font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className={`w-full border p-4 rounded-lg mb-4 ${Students.includes(application?.instituteStudent?.rollNo) ? 'border-red-500' : 'border-black'}`}>
      <div className="flex items-start gap-4">
        <img
          src={application?.instituteStudent?.image}
          alt="student"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="text-black">
          <p><strong>Name:</strong> {application?.instituteStudent?.name}</p>
          <p><strong>Roll No:</strong> {application?.instituteStudent?.rollNo}</p>
          <p><strong>Reg. No:</strong> {application?.instituteStudent?.regNo}</p>
          <p><strong>Gender:</strong> {application?.instituteStudent?.gender === 'M' ? 'Male' : 'Female'}</p>
        </div>
      </div>

      <div className="mt-3 text-black space-y-1">
        <p><strong>Email:</strong> {application?.email}</p>
        <p><strong>Year:</strong> {application?.instituteStudent?.year}</p>
        <p><strong>Branch:</strong> {application?.instituteStudent?.branch}</p>
        <p><strong>Phone:</strong> {application?.instituteStudent?.phone}</p>
        <p><strong>Payment Mode:</strong> {application?.instituteStudent?.paymentMode}</p>
        <p><strong>Paid On:</strong> {application?.instituteStudent?.paymentDate}</p>
        <p><strong>Amount:</strong> {application?.instituteStudent?.amountPaid}</p>
        {application?.instituteStudent?.instituteFeeReceipt && (
          <p><strong>Institute Fee:</strong> <a className="text-blue-500 underline" href={application.instituteStudent.instituteFeeReceipt} target="_blank">Click Here</a></p>
        )}
        {application?.instituteStudent?.hostelFeeReceipt && (
          <p><strong>Hostel Fee:</strong> <a className="text-blue-500 underline" href={application.instituteStudent.hostelFeeReceipt} target="_blank">Click Here</a></p>
        )}
        <p><strong>Hostel Block:</strong> {application?.instituteStudent?.hostelBlock?.name}</p>
        <p><strong>Room No:</strong> {application?.instituteStudent?.cot?.room?.roomNumber}</p>
        <p><strong>Floor No:</strong> {application?.instituteStudent?.cot?.room?.floorNumber}</p>
        <p><strong>Cot No:</strong> {application?.instituteStudent?.cot?.cotNo}</p>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
        <MainButton text="ACCEPT" backgroundColor="#aacc00" onPress={() => setAcceptModalVisible(true)} />
        <MainButton text="REJECT" backgroundColor="#c9184a" textColor="white" onPress={() => setRejectModalVisible(true)} />
        <MainButton text="FREEZE" backgroundColor="#00b4d8" textColor="white" onPress={() => setFreezeModalVisible(true)} />
      </div>

      {/* Modals */}
      {modalWrapper(rejectModalVisible, setRejectModalVisible, "Reject this Application", "remarks", rejectHandler, "Enter reason for rejection")}
      {modalWrapper(freezeModalVisible, setFreezeModalVisible, "Freeze this Application", "remarks1", freezeHandler, "Enter reason for freezing")}
      {acceptModal()}
    </div>
  );
};

export default ApplicationCard;
