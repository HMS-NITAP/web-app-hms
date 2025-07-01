import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deletePendingOutingApplication, markReturnFromOuting } from '../../services/operations/StudentAPI';
import MainButton from '../common/MainButton';
import { FaTrash } from 'react-icons/fa6';

const OutingApplicationCard = ({ application, token, toast, fetchData }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [markReturnModalOpen, setMarkReturnModalOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const dispatch = useDispatch();

  const getDateFormat = (date) => new Date(date).toLocaleString();

  const handleConfirmDelete = async () => {
    setIsButtonDisabled(true);
    const response = await dispatch(deletePendingOutingApplication(application?.id, token, toast));
    if (response) fetchData();
    setIsButtonDisabled(false);
    setModalVisible(false);
  };

  const handleMarkReturn = async () => {
    setIsButtonDisabled(true);
    const response = await dispatch(markReturnFromOuting(application?.id, token, toast));
    if (response) fetchData();
    setIsButtonDisabled(false);
    setMarkReturnModalOpen(false);
  };

  const statusColors = {
    PENDING: 'text-orange-500',
    INPROGRESS: 'text-green-600',
    RETURNED: 'text-purple-700',
    COMPLETED: 'text-green-600',
    REJECTED: 'text-red-500',
  };

  return (
    <div className="w-full p-4 my-2 bg-gray-100 border border-black rounded shadow-md">
      <p><strong>Created On:</strong> {getDateFormat(application?.createdAt)}</p>
      <p><strong>From:</strong> {getDateFormat(application?.from)}</p>
      <p><strong>To:</strong> {getDateFormat(application?.to)}</p>
      <p><strong>Purpose:</strong> {application?.purpose}</p>
      <p><strong>Place of Visit:</strong> {application?.placeOfVisit}</p>

      {(application?.status === "REJECTED" || application?.status === "INPROGRESS" || application?.status === "RETURNED" || application?.status === "COMPLETED") && (
        <>
          <p><strong>Verified By:</strong> {application?.verifiedBy?.name} ({application?.verifiedBy?.designation})</p>
          <p><strong>Verified At:</strong> {getDateFormat(application?.verifiedOn)}</p>
        </>
      )}

      {application?.status === "RETURNED" && (
        <p><strong>Returned On:</strong> {getDateFormat(application?.returnedOn)}</p>
      )}

      {application?.status === "COMPLETED" && (
        <>
          <p><strong>Returned On:</strong> {getDateFormat(application?.returnedOn)}</p>
          {application?.remarks !== null && (
            <p><strong>Remarks:</strong> <span className="text-black">{application?.remarks} (MARKED DELAYED)</span></p>
          )}
        </>
      )}

      {application?.status === "REJECTED" && (
        <p><strong>Remarks:</strong> {application?.remarks}</p>
      )}

      <p><strong>Status:</strong> <span className={`font-bold ${statusColors[application?.status]}`}>{application.status}</span></p>

      {application?.status === "INPROGRESS" && (
        <div className="mt-4 flex justify-center">
          <MainButton
            isButtonDisabled={isButtonDisabled}
            onPress={() => setMarkReturnModalOpen(true)}
            backgroundColor="#95d5b2"
            text="Mark Return"
          />
        </div>
      )}

      {application?.status === "PENDING" && (
        <div className="mt-4">
          <button
            disabled={isButtonDisabled}
            onClick={() => setModalVisible(true)}
            className={`flex items-center gap-2 px-4 py-2 border border-red-700 bg-red-200 rounded-full ${isButtonDisabled ? 'opacity-50' : ''}`}
          >
            <FaTrash className="text-red-700" />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4 w-80">
            <p className="text-center text-lg text-black">Are you sure you want to delete this Outing Application?</p>
            <div className="flex justify-between">
              <button
                disabled={isButtonDisabled}
                onClick={handleConfirmDelete}
                className={`flex-1 bg-red-700 text-white py-2 rounded mr-2 ${isButtonDisabled ? 'opacity-50' : ''}`}
              >
                Yes
              </button>
              <button
                disabled={isButtonDisabled}
                onClick={() => setModalVisible(false)}
                className={`flex-1 bg-gray-500 text-white py-2 rounded ml-2 ${isButtonDisabled ? 'opacity-50' : ''}`}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark Return Modal */}
      {markReturnModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4 w-80">
            <p className="text-center text-lg text-black">Are you sure you want to log return from vacation?</p>
            <div className="flex justify-between">
              <button
                disabled={isButtonDisabled}
                onClick={handleMarkReturn}
                className={`flex-1 bg-green-600 text-white py-2 rounded mr-2 ${isButtonDisabled ? 'opacity-50' : ''}`}
              >
                Yes
              </button>
              <button
                disabled={isButtonDisabled}
                onClick={() => setMarkReturnModalOpen(false)}
                className={`flex-1 bg-gray-500 text-white py-2 rounded ml-2 ${isButtonDisabled ? 'opacity-50' : ''}`}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutingApplicationCard;
