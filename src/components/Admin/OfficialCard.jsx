import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  addWardenToHostelBlock,
  deleteOfficialAccount,
  fetchAllHostelBlocksData,
  removeWardenFromHostelBlock,
} from '../../services/operations/AdminAPI';
import { FaBuildingCircleCheck, FaBuildingCircleXmark } from 'react-icons/fa6';
import MainButton from '../common/MainButton';

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
    <div className="md:w-[32%] w-full border border-black rounded-lg p-4 flex justify-between gap-4 bg-white shadow-sm">
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
          className="border cursor-pointer border-black rounded-full bg-green-100 hover:bg-green-200 transition-all duration-200 p-3"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white flex justify-center flex-col gap-[1rem] backdrop-blur-lg border border-white/30 shadow-xl rounded-xl p-6 md:w-full w-[90%] max-w-md" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
            {data?.hostelBlockId ? (
              <>
                <p className="text-lg font-semibold text-center mb-4">
                  Are you sure you want to unallocate this Official from the hostel block?
                </p>
                <div className="flex gap-4 justify-center">
                  <MainButton text="Yes" isButtonDisabled={isButtonDisabled} onPress={handleUnallocate} backgroundColor='bg-green-500' textColor='text-white' />
                  <MainButton text="No" isButtonDisabled={isButtonDisabled} onPress={() => setEditModalVisible(false)} backgroundColor='bg-gray-300' textColor='text-black' />
                </div>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-center mb-4">Allocate a Hostel Block</p>
                <select
                  onChange={(e) => setSelectedHostelBlock(e.target.value)}
                  className="w-full cursor-pointer border border-gray-400 rounded-md px-3 py-2 mb-5 text-sm"
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
                  <MainButton text="Confirm" isButtonDisabled={isButtonDisabled || !selectedHostelBlock} onPress={handleAllocate} backgroundColor='bg-green-500' textColor='text-white' />
                  <MainButton text="Cancel" isButtonDisabled={isButtonDisabled} onPress={() => setEditModalVisible(false)} backgroundColor='bg-gray-300' textColor='text-black' />
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
