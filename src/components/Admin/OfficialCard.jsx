import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaBuildingCircleCheck, FaBuildingCircleXmark } from 'react-icons/fa6';
import {
  addWardenToHostelBlock,
  // deleteOfficialAccount,
  fetchAllHostelBlocksData,
  removeWardenFromHostelBlock
} from '../../services/operations/AdminAPI';

const OfficialCard = ({ data, token, toast, fetchData }) => {
  // const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [hostelData, setHostelData] = useState([]);
  const [selectedHostelBlock, setSelectedHostelBlock] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (editModalVisible) {
      const fetchHostelBlocks = async () => {
        const response = await dispatch(fetchAllHostelBlocksData(token, toast));
        setHostelData(response);
      };
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
    } catch (err) {
      console.log(err);
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
    } catch (err) {
      console.log(err);
    } finally {
      fetchData();
      setEditModalVisible(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className="w-full border border-black rounded-lg bg-white p-4 shadow-md flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-black text-sm">
        <p><strong>User ID:</strong> {data?.user?.id}</p>
        <p><strong>Name:</strong> {data?.name}</p>
        <p><strong>Designation:</strong> {data?.designation}</p>
        <p><strong>Email:</strong> {data?.user?.email}</p>
        <p><strong>Gender:</strong> {data?.gender === 'M' ? 'Male' : 'Female'}</p>
        <p><strong>Mobile:</strong> {data?.phone}</p>
        {
          data?.hostelBlockId ? (
            <p className="text-green-700 font-semibold">Allotted Hostel Block: <span className="font-medium">{data.hostelBlock?.name}</span></p>
          ) : (
            <p className="text-red-600 font-semibold">No Hostel Block Allotted</p>
          )
        }
      </div>
      <div className="flex justify-end gap-4">
        {/* Allocation Button */}
        <button
          className="p-2 bg-green-100 border border-green-900 rounded-full"
          onClick={() => setEditModalVisible(true)}
        >
          {
            data?.hostelBlockId ? (
              <FaBuildingCircleXmark className="text-xl text-green-900" />
            ) : (
              <FaBuildingCircleCheck className="text-xl text-green-900" />
            )
          }
        </button>
      </div>

      {editModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg">
            {
              data?.hostelBlockId ? (
                <>
                  <h2 className="text-lg font-bold text-center mb-4">Are you sure you want to unallocate this official?</h2>
                  <div className="flex justify-center gap-4">
                    <button
                      disabled={isButtonDisabled}
                      onClick={handleUnallocate}
                      className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50"
                    >Yes</button>
                    <button
                      disabled={isButtonDisabled}
                      onClick={() => setEditModalVisible(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:opacity-50"
                    >No</button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-center mb-4">Allocate Hostel Block</h2>
                  <select
                    className="w-full border border-gray-400 p-2 rounded mb-4"
                    onChange={(e) => setSelectedHostelBlock(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Select Hostel Block</option>
                    {hostelData.map(block => (
                      <option key={block.id} value={block.id}>{block.name}</option>
                    ))}
                  </select>
                  <div className="flex justify-center gap-4">
                    <button
                      disabled={isButtonDisabled}
                      onClick={handleAllocate}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                    >Confirm</button>
                    <button
                      disabled={isButtonDisabled}
                      onClick={() => setEditModalVisible(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:opacity-50"
                    >Cancel</button>
                  </div>
                </>
              )
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficialCard;
