import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentDateRatingsAndReviews } from '../../services/operations/CommonAPI';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaCirclePlus } from 'react-icons/fa6';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ value, size = 24 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <FaStar
        key={i}
        size={size}
        className={i <= value ? 'text-yellow-500' : 'text-gray-300'}
      />
    );
  }
  return <div className="flex gap-1 justify-center">{stars}</div>;
};

const ViewMessFeedback = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.Auth);
  const { user } = useSelector((state) => state.Profile);

  const fetchData = async () => {
    const result = await dispatch(fetchCurrentDateRatingsAndReviews(toast));
    if (!result) return;
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full px-6 py-10 flex flex-col items-center gap-8">
      <h2 className="text-2xl font-bold text-gray-700">Today's Feedback</h2>

      {user && user?.accountType === 'STUDENT' && (
        <div className="w-full flex justify-end">
          <button
            onClick={() => navigate('/student/give-feedback')}
            className="flex items-center gap-2 bg-[#ccd5ae] text-black px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            <FaCirclePlus size={20} className="text-gray-600" />
            <span className="font-semibold">Give Feedback</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center mt-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-black text-lg font-bold">Please Wait...</p>
                </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center gap-8">
          {data.map((session, index) => (
            <div
              key={index}
              className="w-full border border-dashed border-black rounded-2xl p-6 flex flex-col items-center gap-6"
            >
              <h3 className="text-xl font-bold text-black text-center">{session?.session}</h3>

              <div className="flex flex-col items-center gap-1">
                <StarRating value={Math.round(session?.averageRating)} size={30} />
                <p className="text-lg font-bold text-black text-center">
                  {session?.averageRating.toFixed(2)}
                </p>
              </div>

              <div className="w-full overflow-x-auto">
                <div className="flex gap-4 w-full min-w-max">
                  {session?.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="w-52 border border-dashed border-black rounded-xl p-4 flex flex-col items-center gap-2 bg-white shadow-sm"
                    >
                      <p className="text-center font-medium text-sm">
                        {review?.createdBy?.name} ({review?.createdBy?.rollNo})
                      </p>
                      <StarRating value={Math.round(review?.rating)} size={18} />
                      <p className="text-center text-black font-semibold text-sm">{review?.review}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewMessFeedback;
