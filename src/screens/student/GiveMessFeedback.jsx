import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createMessFeedBack } from '../../services/operations/StudentAPI';
import Rating from 'react-rating'; // npm install react-rating
import { FaStar } from 'react-icons/fa';
import MainButton from '../../components/common/MainButton';

const GiveMessFeedback = ({ navigate }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);

  const [displaySession, setDisplaySession] = useState('');
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const findSession = () => {
    const now = new Date();
    const date = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    setCurrentDate(`${date}/${month}/${year}`);

    const currentHour = now.getHours();
    if (currentHour >= 0 && currentHour < 10) setDisplaySession('Breakfast');
    else if (currentHour < 15) setDisplaySession('Lunch');
    else if (currentHour < 18) setDisplaySession('Snacks');
    else setDisplaySession('Dinner');
  };

  useEffect(() => {
    findSession();
  }, [token]);

  const onSubmit = async () => {
    if (review.trim() === '') {
      toast.error('Review field is empty');
      return;
    }

    if (!rating) {
      toast.error('Select a rating');
      return;
    }

    setIsButtonDisabled(true);

    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('review', review);
    formData.append('session', displaySession);

    const response = await dispatch(createMessFeedBack(formData, token, toast));
    if (response) {
      navigate('View Mess Feedback');
    }

    setIsButtonDisabled(false);
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-6">
      <div className="w-[90%] p-4 bg-green-50 border border-black/10 rounded-2xl text-center text-black text-base mb-6">
        Let us know how you find the food quality at mess, by sharing your valuable feedback.
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div>
          <p className="text-base font-medium text-black">Date: <span className="text-gray-600 font-semibold">{currentDate}</span></p>
          <p className="text-base font-medium text-black">Session: <span className="text-gray-600 font-semibold">{displaySession}</span></p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-black">
            Review <span className="text-red-600">*</span> :
          </label>
          <textarea
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 text-black"
            placeholder="Enter your review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-black">
            Rating <span className="text-red-600">*</span> :
          </label>
          <Rating
            initialRating={rating}
            onChange={setRating}
            emptySymbol={<FaStar className="text-gray-300 text-2xl" />}
            fullSymbol={<FaStar className="text-yellow-500 text-2xl" />}
          />
        </div>

        <div className="w-fit mt-4">
          <MainButton
            text="Submit"
            isButtonDisabled={isButtonDisabled}
            onPress={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default GiveMessFeedback;
