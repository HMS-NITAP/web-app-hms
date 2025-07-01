import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOfficialAccounts } from '../../services/operations/AdminAPI';
import OfficialCard from '../../components/Admin/OfficialCard';
import { FaUserPlus } from 'react-icons/fa6';
import toast from 'react-hot-toast'; // ✅ Import toast

const ManageOfficialAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    const response = await dispatch(fetchOfficialAccounts(token, toast)); // ✅ Pass toast
    setAccounts(response || []); // Avoid setting undefined
    setLoading(false);
  }, [dispatch, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="w-full flex flex-col items-center px-4 py-3">
      {!loading && (
        <>
          <div className="w-full flex flex-row justify-between items-center px-4 py-3">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-black text-sm">Total Official Account</span>
              <div className="h-6 w-6 rounded-full flex justify-center items-center bg-purple-400">
                <span className="text-white font-bold text-sm">{accounts.length}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/create-official-account')}
              className="px-3 py-2 rounded-md border border-black bg-blue-900"
            >
              <FaUserPlus size={20} color="white" />
            </button>
          </div>

          <div className="w-full flex flex-col items-center gap-3">
            {accounts.map((account, index) => (
              <OfficialCard
                key={index}
                data={account}
                token={token}
                fetchData={fetchData}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageOfficialAccounts;
