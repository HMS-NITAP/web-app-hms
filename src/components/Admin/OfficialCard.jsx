import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  addWardenToHostelBlock,
  deleteOfficialAccount,
  fetchAllHostelBlocksData,
  removeWardenFromHostelBlock,
} from '../../services/operations/AdminAPI';
import { FaBuildingCircleCheck, FaBuildingCircleXmark } from 'react-icons/fa6';

const OfficialCard = ({ data, token, toast, fetchData }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [hostelData, setHostelData] = useState([]);
  const [selectedHostelBlock, setSelectedHostelBlock] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchHostelBlocks = async () => {
      const response = await dispatch(fetchAllHostelBlocksData(token, toast));
      setHostelData(response);
    };
    if (editModalVisible) {
      fetchHostelBlocks();
    }
  }, [editModalVisible]);

  const handleUnallocate = async () => {
    setIsButtonDisabled(true);
    const formData = new FormData();
    formData.append('removeWardenId', data?.id);
    formData.append('hostelBlockId', data?.hostelBlock?.id);
    try {
      await dispatch(removeWardenFromHostelBlock(formData, token, toast));
    } catch (error) {
      console.error('Error in handleUnallocate:', error);
    } finally {
      fetchData();
      setEditModalVisible(false);
      setIsButtonDisabled(false);
    }
  };

  const handleAllocate = async () => {
    setIsButtonDisabled(true);
    const formData = new FormData();
    formData.append('newWardenId', data?.id);
    formData.append('hostelBlockId', selectedHostelBlock);
    try {
      await dispatch(addWardenToHostelBlock(formData, token, toast));
    } catch (error) {
      console.error('Error in handleAllocate:', error);
    } finally {
      fetchData();
      setEditModalVisible(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className="w-full border border-black rounded-lg p-4 flex justify-between gap-4 bg-white shadow-sm">
      {/* Info */}
      <div className="w-4/5 flex flex-col gap-1">
        <p className="text-black font-semibold">
          User ID: <span className="font-normal">{data.user.id}</span>
        </p>
        <p className="text-black font-semibold">
          Name: <span className="font-normal">{data.name}</span>
        </p>
        <p className="text-black font-semibold">
          Designation: <span className="font-normal">{data.designation}</span>
        </p>
        <p className="text-black font-semibold">
          Email ID: <span className="font-normal">{data.user.email}</span>
        </p>
        <p className="text-black font-semibold">
          Gender: <span className="font-normal">{data.gender === 'M' ? 'Male' : 'Female'}</span>
        </p>
        <p className="text-black font-semibold">
          Mobile No.: <span className="font-normal">{data.phone}</span>
        </p>
        {data?.hostelBlockId ? (
          <p className="text-green-600 font-semibold">
            Allotted Hostel Block:{' '}
            <span className="text-green-700 font-medium">{data.hostelBlock.name}</span>
          </p>
        ) : (
          <p className="text-red-600 font-semibold">No Hostel Block Allotted</p>
        )}
      </div>

      {/* Action */}
      <div className="w-1/5 flex flex-col items-center justify-center gap-4">
        <button
          onClick={() => setEditModalVisible(true)}
          className="border border-black rounded-full bg-green-100 p-3"
        >
          {data?.hostelBlockId ? (
            <FaBuildingCircleXmark className="text-xl text-green-900" />
          ) : (
            <FaBuildingCircleCheck className="text-xl text-green-900" />
          )}
        </button>
      </div>

      {/* Modal */}
      {editModalVisible && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
            {data?.hostelBlockId ? (
              <>
                <p className="text-lg font-semibold text-center mb-4">
                  Are you sure you want to unallocate this Official from the hostel block?
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    disabled={isButtonDisabled}
                    onClick={handleUnallocate}
                    className={`bg-red-600 text-white px-4 py-2 rounded-md ${
                      isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setEditModalVisible(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md"
                  >
                    No
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-center mb-4">Allocate a Hostel Block</p>
                <select
                  onChange={(e) => setSelectedHostelBlock(e.target.value)}
                  className="w-full border border-gray-400 rounded-md px-3 py-2 mb-5 text-sm"
                  defaultValue=""
                >
                  <option disabled value="">
                    Select Hostel Block
                  </option>
                  {hostelData.map((block) => (
                    <option key={block.id} value={block.id}>
                      {block.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-4 justify-center">
                  <button
                    disabled={isButtonDisabled || !selectedHostelBlock}
                    onClick={handleAllocate}
                    className={`bg-green-600 text-white px-4 py-2 rounded-md ${
                      isButtonDisabled || !selectedHostelBlock
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setEditModalVisible(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficialCard;
