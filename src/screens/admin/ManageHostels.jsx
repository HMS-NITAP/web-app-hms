import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllHostelBlocksData } from '../../services/operations/AdminAPI';
import { toast } from 'react-hot-toast';
import { FaHouseMedical } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import HostelCard from '../../components/Admin/HostelCard';

const ManageHostels = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await dispatch(fetchAllHostelBlocksData(token, toast));
    setAccounts(response);
    setLoading(false);
  }, [dispatch, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-3">
      {!loading && (
        <div className="w-full max-w-5xl">
          {/* Header */}
          <div className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-300 mb-6">
            <div className="flex flex-col items-center gap-1">
              <p className="font-semibold text-sm text-black">Total Hostel Blocks</p>
              <span className="bg-purple-400 text-white text-sm font-bold px-3 py-1 rounded-full">
                {accounts.length}
              </span>
            </div>
            <button
              onClick={() => navigate('/admin/create-hostel-block')}
              className="bg-blue-900 p-2 rounded-md border border-black"
            >
              <FaHouseMedical className="text-white text-xl" />
            </button>
          </div>

          {/* Hostel Cards */}
          <div className="w-full flex flex-col items-center gap-4">
            {accounts &&
              accounts.map((account, index) => (
                <HostelCard
                  key={index}
                  data={account}
                  token={token}
                  toast={toast}
                  fetchData={fetchData}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHostels;
