import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import MainButton from '../common/MainButton'; // Assuming your MainButton supports className
import {
  acceptPendingOutingApplication,
  rejectPendingOutingApplication,
  markCompletedWithDelayOutingApplication,
  markCompletedWithoutDelayOutingApplication,
} from '../../services/operations/OfficialAPI';
import { useDispatch } from 'react-redux';

const OutingRequestCard = ({ application, token, toast, fetchOutingRequest }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isReturnWithDelayModalOpen, setIsReturnWithDelayModalOpen] = useState(false);
  const [isReturnWithoutDelayModalOpen, setIsReturnWithoutDelayModalOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const getDateFormat = (date) => new Date(date).toLocaleString();

  const acceptPendingApplicationHandler = async () => {
    setIsButtonDisabled(true);
    const res = await dispatch(acceptPendingOutingApplication(application.id, token, toast));
    if (res) fetchOutingRequest();
    setIsAcceptModalOpen(false);
    setIsButtonDisabled(false);
  };

  const rejectPendingApplicationHandler = async (data) => {
    setIsButtonDisabled(true);
    const formData = new FormData();
    formData.append('applicationId', application.id);
    formData.append('remarks', data.remarks);
    const res = await dispatch(rejectPendingOutingApplication(formData, token, toast));
    if (res) fetchOutingRequest();
    setIsRejectModalOpen(false);
    setIsButtonDisabled(false);
  };

  const markCompletedWithoutDelay = async () => {
    setIsButtonDisabled(true);
    const res = await dispatch(markCompletedWithoutDelayOutingApplication(application.id, token, toast));
    if (res) fetchOutingRequest();
    setIsReturnWithoutDelayModalOpen(false);
    setIsButtonDisabled(false);
  };

  const markCompletedWithDelay = async (data) => {
    setIsButtonDisabled(true);
    const formData = new FormData();
    formData.append('applicationId', application.id);
    formData.append('remarks', data.remarks);
    const res = await dispatch(markCompletedWithDelayOutingApplication(formData, token, toast));
    if (res) fetchOutingRequest();
    setIsReturnWithDelayModalOpen(false);
    setIsButtonDisabled(false);
  };

  return (
    <div className="md:w-[350px] w-[95%] border border-black rounded-lg p-4 space-y-2">
      <p><strong>Created On:</strong> {getDateFormat(application.createdAt)}</p>
      <p><strong>Name:</strong> {application?.instituteStudent?.name}</p>
      <div className="flex flex-wrap gap-4">
        <p><strong>Room no:</strong> {application?.instituteStudent?.cot?.room?.roomNumber}</p>
        <p><strong>Cot no:</strong> {application?.instituteStudent?.cot?.cotNo}</p>
      </div>
      <p><strong>Reg No:</strong> {application?.instituteStudent?.regNo}</p>
      <p><strong>Roll No:</strong> {application?.instituteStudent?.rollNo}</p>
      <p><strong>From:</strong> {getDateFormat(application.from)}</p>
      <p><strong>To:</strong> {getDateFormat(application.to)}</p>
      <p><strong>Purpose:</strong> {application.purpose}</p>
      <p><strong>Place of Visit:</strong> {application.placeOfVisit}</p>

      {application.status !== 'PENDING' && (
        <>
          <p><strong>Verified By:</strong> {application?.verifiedBy?.name} ({application?.verifiedBy?.designation})</p>
          <p><strong>Verified On:</strong> {getDateFormat(application?.verifiedOn)}</p>
        </>
      )}
      {(application.status === 'RETURNED' || application.status === 'COMPLETED') && (
        <>
          <p><strong>Returned On:</strong> {getDateFormat(application?.returnedOn)}</p>
          {application.remarks && (
            <p><strong>Remarks:</strong> {application.remarks} (MARKED DELAYED)</p>
          )}
        </>
      )}

      <p>
        <strong>Status:</strong>{" "}
        <span className={`font-bold ${application.status === "PENDING" ? "text-orange-500" : application.status === "COMPLETED" ? "text-green-600" : application.status === "RETURNED" ? "text-red-600" : "text-black"}`}>
          {application.status}
        </span>
      </p>

      {application.status === 'PENDING' && (
        <div className="flex justify-evenly mt-4">
          <MainButton text="Accept" isButtonDisabled={isButtonDisabled} onClick={() => setIsAcceptModalOpen(true)} backgroundColor="#99d98c" />
          <MainButton text="Reject" isButtonDisabled={isButtonDisabled} onClick={() => setIsRejectModalOpen(true)} backgroundColor="#f27059" />
        </div>
      )}

      {application.status === 'RETURNED' && (
        <div className="flex flex-col items-center gap-3 mt-4">
          <MainButton text="Returned Without Delay" isButtonDisabled={isButtonDisabled} onClick={() => setIsReturnWithoutDelayModalOpen(true)} backgroundColor="#99d98c" />
          <MainButton text="Returned With Delay" isButtonDisabled={isButtonDisabled} onClick={() => setIsReturnWithDelayModalOpen(true)} backgroundColor="#f27059" />
        </div>
      )}

      {/* Modals */}
      {isAcceptModalOpen && (
        <ModalPopup
          title="Are you sure you want to accept this application?"
          onConfirm={acceptPendingApplicationHandler}
          onCancel={() => setIsAcceptModalOpen(false)}
          isButtonDisabled={isButtonDisabled}
        />
      )}
      {isRejectModalOpen && (
        <FormModal
          title="Reject Application"
          onSubmit={handleSubmit(rejectPendingApplicationHandler)}
          onCancel={() => setIsRejectModalOpen(false)}
          control={control}
          errors={errors}
          placeholder="Enter reason for rejection"
          isButtonDisabled={isButtonDisabled}
        />
      )}
      {isReturnWithoutDelayModalOpen && (
        <ModalPopup
          title="Confirm return without delay?"
          onConfirm={markCompletedWithoutDelay}
          onCancel={() => setIsReturnWithoutDelayModalOpen(false)}
          isButtonDisabled={isButtonDisabled}
        />
      )}
      {isReturnWithDelayModalOpen && (
        <FormModal
          title="Return With Delay"
          onSubmit={handleSubmit(markCompletedWithDelay)}
          onCancel={() => setIsReturnWithDelayModalOpen(false)}
          control={control}
          errors={errors}
          placeholder="Enter reason for delay"
          isButtonDisabled={isButtonDisabled}
        />
      )}
    </div>
  );
};

const ModalPopup = ({ title, onConfirm, onCancel, isButtonDisabled }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-md w-[90%] max-w-md space-y-4">
      <p className="text-lg font-semibold text-center">{title}</p>
      <div className="flex justify-evenly">
        <button onClick={onConfirm} disabled={isButtonDisabled} className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50">Yes</button>
        <button onClick={onCancel} disabled={isButtonDisabled} className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50">Cancel</button>
      </div>
    </div>
  </div>
);

const FormModal = ({ title, onSubmit, onCancel, control, errors, placeholder, isButtonDisabled }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-md w-[90%] max-w-md space-y-4">
      <p className="text-lg font-semibold text-center">{title}</p>
      <Controller
        control={control}
        name="remarks"
        rules={{ required: true }}
        render={({ field }) => (
          <textarea {...field} placeholder={placeholder} className="w-full p-2 border rounded" rows={3} />
        )}
      />
      {errors.remarks && <p className="text-red-500 text-sm">Remarks is required.</p>}
      <div className="flex justify-evenly">
        <button onClick={onSubmit} disabled={isButtonDisabled} className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50">Submit</button>
        <button onClick={onCancel} disabled={isButtonDisabled} className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50">Cancel</button>
      </div>
    </div>
  </div>
);

export default OutingRequestCard;
