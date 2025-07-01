import React, { useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import Rating from 'react-rating';
import { FaStar, FaRegStar, FaSearch, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  fetchStudentByRollNoAndRegNo,
  sendAcknowledgementLetter,
  deleteStudentAccount,
  changeStudentProfilePhoto
} from '../../services/operations/AdminAPI';

const MAX_IMAGE_SIZE = 250 * 1024;

const ManageStudentAccounts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [tabChoice, setTabChoice] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const dispatch = useDispatch();
  const { token } = useSelector(state => state.Auth);
  const navigate = useNavigate();

  const searchStudentWithId = async () => {
    setIsButtonDisabled(true);
    if (searchQuery.length === 6 || searchQuery.length === 7) {
      setStudentData(null);
      const response = await dispatch(fetchStudentByRollNoAndRegNo(searchQuery, token, toast));
      setStudentData(response);
    } else {
      toast.error("Invalid Input!");
    }
    setIsButtonDisabled(false);
  };

  useEffect(() => {
    if (searchQuery.length > 0) searchStudentWithId();
  }, [token]);

  const getRatingLabel = rating => {
    rating = parseFloat(rating);
    if (rating > 4) return "Excellent";
    if (rating > 3) return "Good";
    if (rating > 2) return "Average";
    if (rating > 1) return "Poor";
    if (rating > 0) return "Bad";
    return "Not Rated";
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image exceeds 250KB. Please select a smaller file.");
    } else {
      setImageFile(file);
    }
  };

  const handleChangeProfilePhoto = async () => {
    if (!imageFile || !studentData) return;
    setIsButtonDisabled(true);
    const formData = new FormData();
    formData.append("instituteStudentId", studentData?.id);
    formData.append("newProfilePic", imageFile);
    const response = await dispatch(changeStudentProfilePhoto(formData, token, toast));
    if (response) await searchStudentWithId();
    setIsButtonDisabled(false);
  };

  const handleSendAcknowledgement = async () => {
    setIsButtonDisabled(true);
    await dispatch(sendAcknowledgementLetter(studentData?.user?.id, token, toast));
    setIsButtonDisabled(false);
  };

  const handleDeleteStudent = async () => {
    setIsButtonDisabled(true);
    await dispatch(deleteStudentAccount(studentData?.user?.id, token, toast));
    setStudentData(null);
    setIsButtonDisabled(false);
  };

  const handleSwapCot = () => {
    navigate("/swap-cot", {
      state: {
        currentCotId: studentData?.cot?.id,
        userId: studentData?.user?.id
      }
    });
  };

  return (
    <div className="p-4 w-full max-w-7xl mx-auto">
      <div className="flex gap-2 items-center mb-4">
        <input
          className="border rounded px-4 py-2 w-full"
          placeholder="Search with Roll No / Reg No"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button onClick={searchStudentWithId} disabled={isButtonDisabled} className="p-2 border rounded">
          <FaSearch size={18} className="text-gray-600" />
        </button>
      </div>

      {!studentData && (
        <p className="text-center text-gray-500 font-semibold">Please Search for a Student / Student Not Found</p>
      )}

      {studentData && (
        <>
          {/* Tabs */}
          <div className="flex w-full rounded border overflow-hidden mb-4">
            {["About", "Complaints", "Outings"].map((label, idx) => (
              <button
                key={idx}
                onClick={() => setTabChoice(idx + 1)}
                className={`w-full py-2 text-center ${tabChoice === idx + 1 ? 'bg-yellow-400' : 'bg-white'} text-black`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* About Tab */}
          {tabChoice === 1 && (
            <div className="bg-white p-4 rounded shadow space-y-4">
              <div className="flex justify-around">
                {['Discipline Rating', 'Outing Rating'].map((label, index) => {
                  const rating = index === 0 ? studentData?.disciplineRating : studentData?.outingRating;
                  return (
                    <div key={label} className="text-center">
                      <p className="font-bold text-gray-700">{label}</p>
                      <Rating
                        initialRating={parseFloat(rating)}
                        emptySymbol={<FaRegStar color="gray" size={20} />}
                        fullSymbol={<FaStar color="gold" size={20} />}
                        readonly
                      />
                      <p className="text-sm text-gray-600">{getRatingLabel(rating)}</p>
                      <p>{rating}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4">
                <img src={studentData?.image} alt="Profile" className="w-24 h-24 rounded-full" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <FaEdit />
                  <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                  <span className="underline">Change Photo</span>
                </label>
                {imageFile && (
                  <button onClick={handleChangeProfilePhoto} disabled={isButtonDisabled} className="bg-blue-500 px-3 py-1 rounded text-white">
                    Upload
                  </button>
                )}
              </div>
              <p className="text-lg font-bold">{studentData?.name} <span className="text-sm font-semibold text-green-600">({studentData?.user?.status})</span></p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <p><b>Reg No:</b> {studentData?.regNo}</p>
                <p><b>Roll No:</b> {studentData?.rollNo}</p>
                <p><b>Email:</b> {studentData?.user?.email}</p>
                <p><b>Gender:</b> {studentData?.gender === "M" ? "Male" : "Female"}</p>
                <p><b>DOB:</b> {new Date(studentData?.dob).toLocaleDateString()}</p>
                <p><b>Branch:</b> {studentData?.branch}</p>
                <p><b>Phone:</b> {studentData?.phone}</p>
                <p><b>Father:</b> {studentData?.fatherName}</p>
                <p><b>Mother:</b> {studentData?.motherName}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {(studentData?.user?.status === "ACTIVE" || studentData?.user?.status === "ACTIVE1") && (
            <div className="flex flex-col md:flex-row gap-3 mt-6">
              <button onClick={handleSendAcknowledgement} className="bg-lime-500 text-black font-semibold px-4 py-2 rounded">
                Send Acknowledgement
              </button>
              <button onClick={handleDeleteStudent} className="bg-red-600 text-white font-semibold px-4 py-2 rounded">
                Delete Student Account
              </button>
              <button onClick={handleSwapCot} className="bg-blue-800 text-white font-semibold px-4 py-2 rounded">
                Swap Student Cot
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageStudentAccounts;
