import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentDateRatingsAndReviews } from '../../services/operations/CommonAPI';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa';
import { Rating } from 'react-simple-star-rating';

const ViewMessFeedBack = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { token } = useSelector((state) => state.Auth);
  const { user } = useSelector((state) => state.Profile);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await dispatch(fetchCurrentDateRatingsAndReviews(toast));
    if (result) setData(result);
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="w-full px-5 py-8 flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-gray-700">Today's Feedback</h2>

      {user?.accountType === 'STUDENT' && (
        <div className="w-full flex justify-end">
          <button
            onClick={() => navigate('/give-mess-feedback')}
            className="flex items-center gap-2 bg-green-200 px-4 py-2 rounded-xl text-black font-semibold"
          >
            <FaPlusCircle className="text-gray-700" />
            Give Feedback
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-lg font-bold">Please Wait...</p>
      ) : (
        <div className="w-full flex flex-col items-center gap-8">
          {data.map((session, index) => (
            <div
              key={index}
              className="w-full border border-dotted border-black rounded-xl p-5 flex flex-col items-center gap-4"
            >
              <h3 className="text-lg font-bold text-black text-center">{session.session}</h3>

              <div className="flex flex-col items-center">
                <Rating
                  readonly
                  initialValue={Number(session.averageRating)}
                  size={30}
                  allowFraction
                />
                <p className="font-bold text-black text-center">{session.averageRating.toFixed(2)}</p>
              </div>

              <div className="w-full overflow-x-auto">
                <div className="flex gap-4">
                  {session.reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="min-w-[200px] border border-dashed border-black rounded-xl p-4 flex flex-col items-center gap-2"
                    >
                      <p className="text-center font-medium">{review.createdBy.name} ({review.createdBy.rollNo})</p>
                      <Rating
                        readonly
                        initialValue={Number(review.rating)}
                        size={20}
                        allowFraction
                      />
                      <p className="text-center text-black font-semibold">{review.review}</p>
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

export default ViewMessFeedBack;
