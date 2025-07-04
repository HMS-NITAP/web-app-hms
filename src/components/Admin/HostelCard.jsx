import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteHostelBlock } from '../../services/operations/AdminAPI';
import { FaTrash } from 'react-icons/fa';

const HostelCard = ({ data, token, toast, fetchData }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleConfirmDelete = async () => {
    setModalVisible(false);
    await dispatch(deleteHostelBlock(data?.id, token, toast));
    fetchData();
  };

  return (
    <div className="md:w-[32%] w-full border border-black rounded-lg p-4 flex flex-col justify-between gap-4 bg-white shadow-sm">
      {/* Top Section */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden flex justify-center items-center">
          {isLoading && (
            <div className="absolute z-10">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={data.image}
            alt="hostel"
            className="w-full h-full object-cover"
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-black font-semibold text-base">
            Name:{' '}
            <span className="font-medium text-lg">{data.name}</span>
          </p>
          <p className="text-black font-semibold text-base">
            Capacity:{' '}
            <span className="font-medium text-sm">{data.capacity} students</span>
          </p>
          <p className="text-black font-semibold text-base">
            Room Type:{' '}
            <span className="font-medium text-sm">{data.roomType}</span>
          </p>
          <p className="text-black font-semibold text-base">
            Floor Count:{' '}
            <span className="font-medium text-sm">
              {data.floorCount === '2' ? 'G+2' : 'G+4'}
            </span>
          </p>
          <p className="text-black font-semibold text-base">
            Gender:{' '}
            <span className="font-medium text-sm">
              {data.gender === 'M' ? 'Male' : 'Female'}
            </span>
          </p>
          <p className="text-black font-semibold text-base">
            Year Assigned to:{' '}
            <span className="font-medium text-sm">{data.year}</span>
          </p>
        </div>
      </div>

      {/* Warden Info */}
      {data?.wardens.length === 0 ? (
        <div className="w-full text-center text-red-700 font-bold text-sm">
          No Warden Assigned
        </div>
      ) : (
        <div>
          <p className="text-[#14213d] font-extrabold mb-2">Warden(s):</p>
          {
            data?.wardens.map((warden, index) => (
            <p key={index} className="text-[#003554] font-bold text-sm">
              {index + 1}) {warden.name} ( +91 {warden.phone} )
            </p>
          ))}
        </div>
      )}

      {/* Uncomment below for delete functionality */}
      {/* <div className="flex justify-end">
        <button
          className="bg-red-100 border border-red-700 rounded-full p-2"
          onClick={() => setModalVisible(true)}
        >
          <FaTrash className="text-red-700" />
        </button>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-[300px]">
            <p className="text-center text-lg mb-4">
              Are you sure you want to delete this Hostel Block?
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-md"
              >
                Yes
              </button>
              <button
                onClick={() => setModalVisible(false)}
                className="flex-1 bg-gray-600 text-white py-2 rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default HostelCard;
