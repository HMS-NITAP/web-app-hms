import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deletePendingOutingApplication, markReturnFromOuting } from '../../services/operations/StudentAPI';
import toast from 'react-hot-toast';
import MainButton from '../common/MainButton';
import { FaTrash } from 'react-icons/fa6';

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
    <div className="md:w-[30%] w-[95%] border border-black bg-gray-100 rounded-lg p-4 shadow-md">
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
            className={`cursor-pointer bg-red-100 text-red-600 border border-red-500 rounded-full flex gap-[1rem] justify-center items-center px-4 py-2 font-semibold transition ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-200'}`}
          >
            <FaTrash className="text-red-600" /> Delete
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white backdrop-blur-lg border border-white/30 shadow-xl rounded-xl flex flex-col justify-center items-center p-6 md:w-full w-[90%] max-w-md gap-[2rem]" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
            <p className="text-lg text-black text-center font-semibold">Are you sure you want to delete this Outing Application?</p>
            <div className="flex justify-between gap-4">
              <MainButton text={"Yes"} onPress={handleConfirmDelete} isButtonDisabled={isButtonDisabled} backgroundColor='bg-red-500' textColor='text-white' />
              <MainButton text={"No"} onPress={() => setModalVisible(false)} isButtonDisabled={isButtonDisabled} backgroundColor='bg-gray-300' textColor='text-black' />
            </div>
          </div>
        </div>
      )}

      {/* Mark Return Modal */}
      {markReturnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white backdrop-blur-lg border border-white/30 shadow-xl rounded-xl flex flex-col justify-center items-center p-6 md:w-full w-[90%] gap-[2rem] max-w-md" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
            <p className="text-lg text-black text-center font-semibold">Are you sure, you want to log return from vacation?</p>
            <div className="flex justify-between gap-4">
              <MainButton text={"Yes"} onPress={handleMarkReturn} isButtonDisabled={isButtonDisabled} backgroundColor='bg-green-500' textColor='text-white' />
              <MainButton text={"No"} onPress={() => setMarkReturnModalOpen(false)} isButtonDisabled={isButtonDisabled} backgroundColor='bg-gray-300' textColor='text-black' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutingApplicationCard;
