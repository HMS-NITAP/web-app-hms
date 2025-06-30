import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { acceptPendingOutingApplication, markCompletedWithDelayOutingApplication, markCompletedWithoutDelayOutingApplication, rejectPendingOutingApplication } from '../../services/operations/OfficialAPI';
import MainButton from '../common/MainButton';

const OutingRequestCard = ({ application, token, toast, fetchOutingRequest }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();

  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isReturnWithDelayModalOpen, setIsReturnWithDelayModalOpen] = useState(false);
  const [isReturnWithoutDelayModalOpen, setIsReturnWithoutDelayModalOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const getDateFormat = (date) => new Date(date).toLocaleString();

  const handleAccept = async () => {
    setIsButtonDisabled(true);
    const res = await dispatch(acceptPendingOutingApplication(application?.id, token, toast));
    if (res) fetchOutingRequest();
    setIsAcceptModalOpen(false);
    setIsButtonDisabled(false);
  };

  const handleReject = async (data) => {
    setIsButtonDisabled(true);
    const formData = new FormData();
    formData.append('applicationId', application?.id);
    formData.append('remarks', data?.remarks);
    const res = await dispatch(rejectPendingOutingApplication(formData, token, toast));
    if (res) fetchOutingRequest();
    setIsRejectModalOpen(false);
    setIsButtonDisabled(false);
  };

  const handleReturnWithoutDelay = async () => {
    setIsButtonDisabled(true);
    const res = await dispatch(markCompletedWithoutDelayOutingApplication(application?.id, token, toast));
    if (res) fetchOutingRequest();
    setIsReturnWithoutDelayModalOpen(false);
    setIsButtonDisabled(false);
  };

  const handleReturnWithDelay = async (data) => {
    setIsButtonDisabled(true);
    const formData = new FormData();
    formData.append('applicationId', application?.id);
    formData.append('remarks', data?.remarks);
    const res = await dispatch(markCompletedWithDelayOutingApplication(formData, token, toast));
    if (res) fetchOutingRequest();
    setIsReturnWithDelayModalOpen(false);
    setIsButtonDisabled(false);
  };

  const StatusColor = {
    PENDING: 'text-orange-500',
    INPROGRESS: 'text-green-600',
    COMPLETED: 'text-green-600',
    RETURNED: 'text-red-500',
  };

  return (
    <div className="w-full p-4 border border-black rounded-lg space-y-2 bg-white shadow">
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

      {application?.status !== 'PENDING' && (
        <>
          <p><strong>Verified By:</strong> {application?.verifiedBy?.name} ({application?.verifiedBy?.designation})</p>
          <p><strong>Verified On:</strong> {getDateFormat(application?.verifiedOn)}</p>
        </>
      )}

      {(application?.status === 'RETURNED' || application?.status === 'COMPLETED') && (
        <>
          <p><strong>Returned On:</strong> {getDateFormat(application?.returnedOn)}</p>
          {application?.remarks && (
            <p><strong>Remarks:</strong> {application?.remarks} (MARKED DELAYED)</p>
          )}
        </>
      )}

      <p><strong>Status:</strong> <span className={`font-bold ${StatusColor[application?.status]}`}>{application?.status}</span></p>

      {/* Action Buttons */}
      {application?.status === 'PENDING' && (
        <div className="flex justify-evenly mt-3">
          <MainButton isButtonDisabled={isButtonDisabled} text="Accept" backgroundColor="#99d98c" onPress={() => setIsAcceptModalOpen(true)} />
          <MainButton isButtonDisabled={isButtonDisabled} text="Reject" backgroundColor="#f27059" onPress={() => setIsRejectModalOpen(true)} />
        </div>
      )}

      {application?.status === 'RETURNED' && (
        <div className="flex flex-col items-center gap-2 mt-3">
          <MainButton isButtonDisabled={isButtonDisabled} text="Returned Without Delay" backgroundColor="#99d98c" onPress={() => setIsReturnWithoutDelayModalOpen(true)} />
          <MainButton isButtonDisabled={isButtonDisabled} text="Returned With Delay" backgroundColor="#f27059" onPress={() => setIsReturnWithDelayModalOpen(true)} />
        </div>
      )}

      {/* Accept Modal */}
      {isAcceptModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <p className="text-center font-semibold">Are you sure you want to accept this application?</p>
            <div className="flex justify-evenly">
              <button disabled={isButtonDisabled} onClick={handleAccept} className={`px-4 py-2 rounded bg-lime-400 font-semibold ${isButtonDisabled && 'opacity-50'}`}>Accept</button>
              <button disabled={isButtonDisabled} onClick={() => setIsAcceptModalOpen(false)} className={`px-4 py-2 rounded bg-gray-300 font-semibold ${isButtonDisabled && 'opacity-50'}`}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <p className="text-center font-semibold">Are you sure you want to reject this application?</p>
            <form onSubmit={handleSubmit(handleReject)} className="space-y-2">
              <Controller
                name="remarks"
                control={control}
                rules={{ required: 'Remarks required' }}
                render={({ field }) => (
                  <textarea {...field} placeholder="Enter reason for rejection" className="w-full p-2 border rounded text-black" rows={2} />
                )}
              />
              {errors.remarks && <p className="text-red-500 text-sm">{errors.remarks.message}</p>}
              <div className="flex justify-evenly">
                <button disabled={isButtonDisabled} type="submit" className={`px-4 py-2 rounded bg-red-600 text-white ${isButtonDisabled && 'opacity-50'}`}>Reject</button>
                <button disabled={isButtonDisabled} type="button" onClick={() => setIsRejectModalOpen(false)} className={`px-4 py-2 rounded bg-gray-300 ${isButtonDisabled && 'opacity-50'}`}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Without Delay Modal */}
      {isReturnWithoutDelayModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <p className="text-center font-semibold">Confirm student returned without delay?</p>
            <div className="flex justify-evenly">
              <button disabled={isButtonDisabled} onClick={handleReturnWithoutDelay} className={`px-4 py-2 rounded bg-lime-400 font-semibold ${isButtonDisabled && 'opacity-50'}`}>Yes</button>
              <button disabled={isButtonDisabled} onClick={() => setIsReturnWithoutDelayModalOpen(false)} className={`px-4 py-2 rounded bg-gray-300 font-semibold ${isButtonDisabled && 'opacity-50'}`}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Return With Delay Modal */}
      {isReturnWithDelayModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <p className="text-center font-semibold">Confirm student returned with delay?</p>
            <form onSubmit={handleSubmit(handleReturnWithDelay)} className="space-y-2">
              <Controller
                name="remarks"
                control={control}
                rules={{ required: 'Remarks required' }}
                render={({ field }) => (
                  <textarea {...field} placeholder="Enter reason for delay" className="w-full p-2 border rounded text-black" rows={2} />
                )}
              />
              {errors.remarks && <p className="text-red-500 text-sm">{errors.remarks.message}</p>}
              <div className="flex justify-evenly">
                <button disabled={isButtonDisabled} type="submit" className={`px-4 py-2 rounded bg-red-600 text-white ${isButtonDisabled && 'opacity-50'}`}>Yes</button>
                <button disabled={isButtonDisabled} type="button" onClick={() => setIsReturnWithDelayModalOpen(false)} className={`px-4 py-2 rounded bg-gray-300 ${isButtonDisabled && 'opacity-50'}`}>No</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutingRequestCard;
