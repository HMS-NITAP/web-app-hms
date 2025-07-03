import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deletePendingOutingApplication, markReturnFromOuting } from '../../services/operations/StudentAPI';
import toast from 'react-hot-toast';
import MainButton from '../common/MainButton';

const OutingApplicationCard = ({ application, token, fetchData }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [markReturnModalOpen, setMarkReturnModalOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const getDateFormat = (date) => new Date(date).toLocaleString();

  const handleConfirmDelete = async () => {
    setIsButtonDisabled(true);
    const res = await dispatch(deletePendingOutingApplication(application?.id, token, toast));
    if (res) fetchData();
    setIsButtonDisabled(false);
    setModalVisible(false);
  };

  const handleMarkReturn = async () => {
    setIsButtonDisabled(true);
    const res = await dispatch(markReturnFromOuting(application?.id, token, toast));
    if (res) fetchData();
    setIsButtonDisabled(false);
    setMarkReturnModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "text-orange-500";
      case "INPROGRESS":
        return "text-green-600";
      case "RETURNED":
        return "text-purple-700";
      case "COMPLETED":
        return "text-green-700";
      default:
        return "text-red-600";
    }
  };

  return (
    <div className="md:w-[350px] w-[95%] border border-black bg-gray-100 rounded-lg p-4 shadow-md">
      <p><strong>Created On:</strong> <span className="text-gray-600">{getDateFormat(application.createdAt)}</span></p>
      <p><strong>From:</strong> <span className="text-gray-600">{getDateFormat(application.from)}</span></p>
      <p><strong>To:</strong> <span className="text-gray-600">{getDateFormat(application.to)}</span></p>
      <p><strong>Purpose:</strong> <span className="text-gray-600">{application.purpose}</span></p>
      <p><strong>Place of Visit:</strong> <span className="text-gray-600">{application.placeOfVisit}</span></p>

      {["REJECTED", "INPROGRESS", "RETURNED", "COMPLETED"].includes(application.status) && (
        <>
          <p><strong>Verified By:</strong> <span className="text-gray-600">{application.verifiedBy?.name} ({application.verifiedBy?.designation})</span></p>
          <p><strong>Verified At:</strong> <span className="text-gray-600">{getDateFormat(application.verifiedOn)}</span></p>
        </>
      )}

      {["RETURNED", "COMPLETED"].includes(application.status) && (
        <p><strong>Returned On:</strong> <span className="text-gray-600">{getDateFormat(application.returnedOn)}</span></p>
      )}

      {application.status === "REJECTED" && (
        <p><strong>Remarks:</strong> <span className="text-gray-600">{application.remarks}</span></p>
      )}

      {application.status === "COMPLETED" && application.remarks !== null && (
        <p><strong>Remarks:</strong> <span className="text-black">{application.remarks} (MARKED DELAYED)</span></p>
      )}

      <p className="mt-2"><strong>Status:</strong> <span className={`font-bold ${getStatusColor(application.status)}`}>{application.status}</span></p>

      {/* Action Buttons */}
      {application.status === "INPROGRESS" && (
        <div className="mt-4 flex justify-center">
          <MainButton
            isButtonDisabled={isButtonDisabled}
            onPress={() => setMarkReturnModalOpen(true)}
            text={"Mark Return"}
          />
        </div>
      )}

      {application.status === "PENDING" && (
        <div className="mt-4 flex justify-center">
          <button
            disabled={isButtonDisabled}
            onClick={() => setModalVisible(true)}
            className={`cursor-pointer bg-red-100 text-red-600 border border-red-500 rounded-full px-4 py-2 font-semibold transition ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-200'}`}
          >
            🗑 Delete
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-[300px] text-center space-y-4">
            <p className="text-lg text-black">Are you sure you want to delete this Outing Application?</p>
            <div className="flex justify-between gap-4">
              <button
                disabled={isButtonDisabled}
                onClick={handleConfirmDelete}
                className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
              >
                Yes
              </button>
              <button
                onClick={() => setModalVisible(false)}
                className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded w-full"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark Return Modal */}
      {markReturnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-[300px] text-center space-y-4">
            <p className="text-lg text-black">Are you sure you want to log return from vacation?</p>
            <div className="flex justify-between gap-4">
              <button
                disabled={isButtonDisabled}
                onClick={handleMarkReturn}
                className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
              >
                Yes
              </button>
              <button
                onClick={() => setMarkReturnModalOpen(false)}
                className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded w-full"
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
