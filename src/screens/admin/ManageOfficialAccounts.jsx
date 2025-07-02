import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOfficialAccounts } from '../../services/operations/AdminAPI';
import { toast } from 'react-hot-toast';
import OfficialCard from '../../components/Admin/OfficialCard';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa6';

const ManageOfficialAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await dispatch(fetchOfficialAccounts(token, toast));
    setAccounts(response);
    setLoading(false);
  }, [token, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-3">
      {!loading && (
        <div className="w-full max-w-5xl">
          {/* Header Section */}
          <div className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-300 mb-6">
            <div className="flex flex-col items-center gap-1">
              <p className="font-semibold text-sm text-black">Total Official Account</p>
              <div className="h-6 w-6 bg-purple-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{accounts.length}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/create-official-account')}
              className="bg-blue-900 p-2 rounded-md border border-black"
            >
              <FaUserPlus size={20} color="white" />
            </button>
          </div>

          {/* Accounts List */}
          <div className="w-full flex flex-col items-center gap-4">
            {accounts?.map((account, index) => (
              <OfficialCard
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

export default ManageOfficialAccounts;
