import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  changeStudentProfilePhoto,
  deleteStudentAccount,
  fetchStudentByRollNoAndRegNo,
  sendAcknowledgementLetter,
} from '../../services/operations/AdminAPI';
// import { AirbnbRating } from 'react-native-ratings'; // Replace with stars or similar if needed
// import MainButton from '../../components/common/MainButton'; // Replace with button
// import DocumentPicker from 'react-native-document-picker'; // Use <input type="file" />
// import { useFocusEffect } from '@react-navigation/native'; // Use useEffect

const MAX_IMAGE_SIZE = 250 * 1024;

const ManageStudentAccounts = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [tabChoice, setTabChoice] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [sendAcknowledgementLetterModalVisible, setSendAcknowledgementLetterModalVisible] = useState(false);
  const [deleteStudentAccountModalVisible, setDeleteStudentAccountModalVisible] = useState(false);
  const [changeProfilePicModalVisible, setChangeProfilePicModalVisible] = useState(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [imageResponse, setImageResponse] = useState(null);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);

  // File picker for image
  const pickUpImage = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        toast('File size exceeds the limit of 250KB. Please select a smaller file.', { icon: '⚠️' });
      } else {
        setImageResponse(file);
      }
    }
  }, []);

  const getRatingLabel = (rating) => {
    rating = parseFloat(rating);
    if (rating > 4 && rating <= 5) return 'Excellent';
    else if (rating > 3 && rating <= 4) return 'Good';
    else if (rating > 2 && rating <= 3) return 'Average';
    else if (rating > 1 && rating <= 2) return 'Poor';
    else if (rating > 0 && rating <= 1) return 'Bad';
    else return 'Not Rated';
  };

  const getDateFormat = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleString();
  };

  const searchStudentWithId = async () => {
    setIsButtonDisabled(true);
    if (searchQuery.length === 6 || searchQuery.length === 7) {
      setStudentData(null);
      const response = await dispatch(fetchStudentByRollNoAndRegNo(searchQuery, token, toast));
      setStudentData(response);
    } else {
      toast('Invalid Input !', { icon: '⚠️' });
    }
    setIsButtonDisabled(false);
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      searchStudentWithId();
    }
    // eslint-disable-next-line
  }, [token]);

  const sendAcknowledgementLetterHandler = async () => {
    setIsButtonDisabled(true);
    await dispatch(sendAcknowledgementLetter(studentData?.user?.id, token, toast));
    setSendAcknowledgementLetterModalVisible(false);
    setIsButtonDisabled(false);
  };

  const deleteStudentAccountHandler = async () => {
    setIsButtonDisabled(true);
    await dispatch(deleteStudentAccount(studentData?.user?.id, token, toast));
    setStudentData(null);
    setDeleteStudentAccountModalVisible(false);
    setIsButtonDisabled(false);
  };

  const changeStudentProfilePhotoHandler = async () => {
    setIsButtonDisabled(true);
    if (!studentData) {
      toast('Something Went wrong', { icon: '⚠️' });
      setIsButtonDisabled(false);
      setChangeProfilePicModalVisible(false);
      return;
    }
    if (imageResponse === null) {
      toast('Image Not Selected', { icon: '⚠️' });
      setIsButtonDisabled(false);
      return;
    }
    let formData = new FormData();
    formData.append('instituteStudentId', studentData?.id);
    formData.append('newProfilePic', imageResponse);
    const response = await dispatch(changeStudentProfilePhoto(formData, token, toast));
    setChangeProfilePicModalVisible(false);
    setIsButtonDisabled(false);
    if (response) searchStudentWithId();
  };

  const changeStudentCotHandler = () => {
    // navigation.navigate("Change Student Cot", { currentCotId: studentData?.cot?.id, userId: studentData?.user?.id });
    // For web, use react-router-dom's useNavigate
    window.location.href = `/admin/change-student-cot/${studentData?.cot?.id}/${studentData?.user?.id}`;
  };

  return (
    <div className="w-full flex flex-col items-center px-4 py-6">
      <div className="flex flex-row w-[95%] items-center gap-2 mb-4">
        <input
          className="w-4/5 p-2 border border-gray-400 rounded-lg text-black"
          placeholder="Search with Roll No / Reg No"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          disabled={isButtonDisabled}
          onClick={searchStudentWithId}
          className="p-2 border border-black border-dotted rounded-full"
        >
          <span role="img" aria-label="search">
            🔍
          </span>
        </button>
      </div>

      {!studentData && (
        <div className="text-gray-500 my-4 text-lg font-bold text-center">
          Please Search for a Student / Student Not Found
        </div>
      )}

      {studentData && (
        <div className="w-full flex flex-col items-center">
          <div className="w-full flex flex-row justify-center items-center my-4 rounded-lg border border-black overflow-hidden">
            <button
              className={`w-1/3 py-2 ${tabChoice === 1 ? 'bg-yellow-400' : 'bg-white'} text-black`}
              onClick={() => setTabChoice(1)}
            >
              About
            </button>
            <button
              className={`w-1/3 py-2 ${tabChoice === 2 ? 'bg-yellow-400' : 'bg-white'} text-black`}
              onClick={() => setTabChoice(2)}
            >
              Complaints
            </button>
            <button
              className={`w-1/3 py-2 ${tabChoice === 3 ? 'bg-yellow-400' : 'bg-white'} text-black`}
              onClick={() => setTabChoice(3)}
            >
              Outings
            </button>
          </div>
        </div>
      )}

      {/* About Tab */}
      {studentData && tabChoice === 1 && (
        <div className="w-full flex flex-col items-center">
          {/* Ratings */}
          <div className="flex flex-row justify-between w-full mb-4">
            <div className="flex flex-col items-center flex-1 p-4 rounded-lg bg-[#dcedc8] mx-2">
              <span className="font-bold text-base text-gray-700">Discipline Rating</span>
              {/* Replace with stars if needed */}
              <span className="text-lg font-bold">{getRatingLabel(studentData?.disciplineRating)}</span>
              <span>{studentData?.disciplineRating}</span>
            </div>
            <div className="flex flex-col items-center flex-1 p-4 rounded-lg bg-[#dcedc8] mx-2">
              <span className="font-bold text-base text-gray-700">Outing Rating</span>
              {/* Replace with stars if needed */}
              <span className="text-lg font-bold">{getRatingLabel(studentData?.outingRating)}</span>
              <span>{studentData?.outingRating}</span>
            </div>
          </div>
          {/* Profile Image */}
          <div className="flex flex-col items-center my-4">
            {isLoading && <div className="flex justify-center items-center mt-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-black text-lg font-bold">Please Wait...</p>
                </div>
              </div>
            }
            <div className="flex flex-row items-center gap-4">
              <img
                src={studentData?.image}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
                onLoadStart={() => setIsLoading(true)}
                onLoad={() => setIsLoading(false)}
              />
              <button
                onClick={() => setChangeProfilePicModalVisible(true)}
                className="p-2 border border-black bg-yellow-300 rounded-lg flex flex-col items-center"
              >
                <span role="img" aria-label="edit">
                  ✏️
                </span>
              </button>
            </div>
            <span className="text-xl font-extrabold text-black">{studentData?.name}</span>
            <span
              className={`text-base font-bold ${
                studentData?.user?.status === 'ACTIVE'
                  ? 'text-green-600'
                  : studentData?.user?.status === 'INACTIVE'
                  ? 'text-red-600'
                  : 'text-blue-600'
              }`}
            >
              ({studentData?.user?.status})
            </span>
          </div>
          {/* Details */}
          <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-white w-full max-w-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <span className="font-semibold text-black">Reg No: {studentData?.regNo}</span>
              <span className="font-semibold text-black">Roll No: {studentData?.rollNo}</span>
              <span className="font-semibold text-black">Email: {studentData?.user?.email}</span>
              <span className="font-semibold text-black">Gender: {studentData?.gender === 'M' ? 'Male' : 'Female'}</span>
              <span className="font-semibold text-black">DOB: {new Date(studentData?.dob).toLocaleDateString()}</span>
              <span className="font-semibold text-black">Year: {studentData?.year}</span>
              <span className="font-semibold text-black">Branch: {studentData?.branch}</span>
              <span className="font-semibold text-black">Blood Group: {studentData?.bloodGroup}</span>
              <span className="font-semibold text-black">Aadhaar Number: {studentData?.aadhaarNumber}</span>
              <span className="font-semibold text-black">Contact No: {studentData?.phone}</span>
              <span className="font-semibold text-black">Father's Name: {studentData?.fatherName}</span>
              <span className="font-semibold text-black">Mother's Name: {studentData?.motherName}</span>
              <span className="font-semibold text-black">Parents' Contact: {studentData?.parentsPhone}</span>
              <span className="font-semibold text-black">Emergency Contact: {studentData?.emergencyPhone}</span>
              <span className="font-semibold text-black">Address: {studentData?.address}</span>
            </div>
          </div>
          {/* Section: Hostel, Room, Mess, Payment */}
          <div className="w-full overflow-x-auto mb-4">
            <div className="flex flex-row gap-4">
              {/* Hostel Details */}
              <div className="min-w-[220px] p-4 border border-gray-300 rounded-lg bg-white">
                <span className="font-bold text-green-700 block mb-2">Hostel Details</span>
                <span className="font-semibold text-black block">Hostel Name: {studentData?.cot?.room?.hostelBlock?.name}</span>
                <span className="font-semibold text-black block">Capacity: {studentData?.cot?.room?.hostelBlock?.capacity}</span>
                <span className="font-semibold text-black block">
                  Gender: {studentData?.cot?.room?.hostelBlock?.gender === 'M' ? 'Boys Hostel' : 'Girls Hostel'}
                </span>
                <img
                  src={studentData?.cot?.room?.hostelBlock?.image}
                  alt="Hostel"
                  className="w-full h-24 object-cover rounded-lg my-2"
                />
              </div>
              {/* Room Details */}
              <div className="min-w-[220px] p-4 border border-gray-300 rounded-lg bg-white">
                <span className="font-bold text-green-700 block mb-2">Room Details</span>
                <span className="font-semibold text-black block">Room Type: {studentData?.cot?.room?.hostelBlock?.roomType}</span>
                <span className="font-semibold text-black block">Room Number: {studentData?.cot?.room?.roomNumber}</span>
                <span className="font-semibold text-black block">Floor Number: {studentData?.cot?.room?.floorNumber}</span>
                <span className="font-semibold text-black block">Cot Number: {studentData?.cot?.cotNo}</span>
              </div>
              {/* Mess Details */}
              <div className="min-w-[220px] p-4 border border-gray-300 rounded-lg bg-white">
                <span className="font-bold text-green-700 block mb-2">Mess Details</span>
                {studentData?.messHall ? (
                  <>
                    <span className="font-semibold text-black block">Mess Name: {studentData?.messHall?.hallName}</span>
                    <span className="font-semibold text-black block">Capacity: {studentData?.messHall?.capacity}</span>
                  </>
                ) : (
                  <span className="font-semibold text-red-600 block">Mess Hall not assigned</span>
                )}
              </div>
              {/* Payment Details */}
              <div className="min-w-[220px] p-4 border border-gray-300 rounded-lg bg-white">
                <span className="font-bold text-green-700 block mb-2">Payment Details</span>
                <a href={studentData?.hostelFeeReceipt} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline block mb-2">
                  Hostel Fee Receipt
                </a>
                {studentData?.instituteFeeReceipt && (
                  <a href={studentData?.instituteFeeReceipt} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline block">
                    Institute Fee Receipt
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complaints Tab */}
      {studentData && tabChoice === 2 && (
        <div className="w-full flex flex-col items-center">
          {studentData?.hostelComplaints.length === 0 ? (
            <div className="text-gray-500 font-bold text-lg text-center">No Complaints Registered!</div>
          ) : (
            studentData?.hostelComplaints.map((complaint) => (
              <div
                key={complaint?.id}
                className="w-full max-w-xl p-4 my-2 bg-gray-50 rounded-lg border border-gray-200 shadow"
              >
                <div className="font-bold text-base mb-1 text-gray-800">
                  Registered On:{' '}
                  <span className="font-normal text-gray-600">{getDateFormat(complaint.createdAt)}</span>
                </div>
                <div className="font-bold text-base mb-1 text-gray-800">
                  Category:{' '}
                  <span className="font-normal text-gray-600">{complaint.category}</span>
                </div>
                <div className="font-bold text-base mb-1 text-gray-800">
                  About:{' '}
                  <span className="font-normal text-gray-600">{complaint.about}</span>
                </div>
                <div className="font-bold text-base mb-1 text-gray-800">
                  Status:{' '}
                  <span className={`font-extrabold ${complaint?.status === 'RESOLVED' ? 'text-green-600' : 'text-red-600'}`}>
                    {complaint.status === 'RESOLVED' ? 'RESOLVED' : 'IN REVIEW'}
                  </span>
                </div>
                {complaint?.fileUrl[0] && (
                  <div className="font-bold text-base mb-1 text-gray-800">
                    Attachments:{' '}
                    <a href={complaint?.fileUrl[0]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      Click Here to See
                    </a>
                  </div>
                )}
                {complaint?.resolvedOn && (
                  <div className="font-bold text-base mb-1 text-gray-800">
                    Resolved On:{' '}
                    <span className="font-normal text-gray-600">{getDateFormat(complaint?.resolvedOn)}</span>
                  </div>
                )}
                {complaint?.resolvedById && (
                  <div className="font-bold text-base mb-1 text-gray-800">
                    Resolved By:{' '}
                    <span className="font-normal text-gray-600">
                      {complaint?.resolvedBy?.name} ({complaint?.resolvedBy?.designation})
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Outings Tab */}
      {studentData && tabChoice === 3 && (
        <div className="w-full flex flex-col items-center">
          {studentData?.outingApplication.length === 0 ? (
            <div className="text-gray-500 font-bold text-lg text-center">No Outing Application Found!</div>
          ) : (
            studentData?.outingApplication.map((application, index) => (
              <div
                key={index}
                className="w-full max-w-xl p-4 my-2 bg-gray-50 rounded-lg border border-black shadow"
              >
                <div className="font-bold text-base mb-1 text-gray-800">
                  Created On:{' '}
                  <span className="font-normal text-gray-600">{getDateFormat(application?.createdAt)}</span>
                </div>
                <div className="font-bold text-base mb-1 text-gray-800">
                  From:{' '}
                  <span className="font-normal text-gray-600">{getDateFormat(application?.from)}</span>
                </div>
                <div className="font-bold text-base mb-1 text-gray-800">
                  To:{' '}
                  <span className="font-normal text-gray-600">{getDateFormat(application?.to)}</span>
                </div>
                <div className="font-bold text-base mb-1 text-gray-800">
                  Purpose:{' '}
                  <span className="font-normal text-gray-600">{application?.purpose}</span>
                </div>
                <div className="font-bold text-base mb-1 text-gray-800">
                  Place of Visit:{' '}
                  <span className="font-normal text-gray-600">{application?.placeOfVisit}</span>
                </div>
                {/* Status-specific details */}
                {['REJECTED', 'INPROGRESS', 'RETURNED', 'COMPLETED'].includes(application?.status) && (
                  <>
                    <div className="font-bold text-base mb-1 text-gray-800">
                      Verified By:{' '}
                      <span className="font-normal text-gray-600">
                        {application?.verifiedBy?.name} ({application?.verifiedBy?.designation})
                      </span>
                    </div>
                    <div className="font-bold text-base mb-1 text-gray-800">
                      Verified At:{' '}
                      <span className="font-normal text-gray-600">{getDateFormat(application?.verifiedOn)}</span>
                    </div>
                  </>
                )}
                {application?.status === 'REJECTED' && (
                  <div className="font-bold text-base mb-1 text-gray-800">
                    Remarks:{' '}
                    <span className="font-normal text-gray-600">{application?.remarks}</span>
                  </div>
                )}
                {['RETURNED', 'COMPLETED'].includes(application?.status) && (
                  <div className="font-bold text-base mb-1 text-gray-800">
                    Returned On:{' '}
                    <span className="font-normal text-gray-600">{getDateFormat(application?.returnedOn)}</span>
                  </div>
                )}
                {application?.status === 'COMPLETED' && application?.remarks !== null && (
                  <div className="font-bold text-base mb-1 text-gray-800">
                    Remarks:{' '}
                    <span className="font-normal text-black">{application?.remarks} (MARKED DELAYED)</span>
                  </div>
                )}
                <div className="font-bold text-base mb-1 text-gray-800">
                  Status:{' '}
                  <span
                    className={`font-extrabold ${
                      application?.status === 'PENDING'
                        ? 'text-orange-500'
                        : application?.status === 'INPROGRESS'
                        ? 'text-green-600'
                        : application?.status === 'RETURNED'
                        ? 'text-purple-600'
                        : application?.status === 'COMPLETED'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {application.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Action Buttons */}
      {studentData && (studentData?.user?.status === 'ACTIVE' || studentData?.user?.status === 'ACTIVE1') && (
        <div className="mt-6 flex flex-col w-[90%] gap-3">
          <button
            className="w-full py-3 rounded-xl font-bold text-lg text-black bg-[#aacc00]"
            onClick={() => setSendAcknowledgementLetterModalVisible(true)}
          >
            Send Acknowledgement Letter
          </button>
          <button
            className="w-full py-3 rounded-xl font-bold text-lg text-white bg-[#c9184a]"
            onClick={() => setDeleteStudentAccountModalVisible(true)}
          >
            Delete Student Account
          </button>
          <button
            className="w-full py-3 rounded-xl font-bold text-lg text-white bg-[#023047]"
            onClick={changeStudentCotHandler}
          >
            Swap / Exchange Student Cot
          </button>
        </div>
      )}

      {/* Modals */}
      {sendAcknowledgementLetterModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 w-[90vw] max-w-md">
            <span className="text-lg font-semibold text-center">
              Do you want to send Acknowledgement Letter to this student.
            </span>
            <div className="flex flex-row gap-4 w-full justify-center">
              <button
                disabled={isButtonDisabled}
                className={`flex-1 bg-[#aacc00] py-2 rounded text-black font-bold ${isButtonDisabled ? 'opacity-50' : ''}`}
                onClick={sendAcknowledgementLetterHandler}
              >
                Continue
              </button>
              <button
                disabled={isButtonDisabled}
                className={`flex-1 bg-gray-300 py-2 rounded text-black font-bold ${isButtonDisabled ? 'opacity-50' : ''}`}
                onClick={() => setSendAcknowledgementLetterModalVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteStudentAccountModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 w-[90vw] max-w-md">
            <span className="text-lg font-semibold text-center">
              Are you sure, this student will be deleted permanently.
            </span>
            <div className="flex flex-row gap-4 w-full justify-center">
              <button
                disabled={isButtonDisabled}
                className={`flex-1 bg-[#c9184a] py-2 rounded text-white font-bold ${isButtonDisabled ? 'opacity-50' : ''}`}
                onClick={deleteStudentAccountHandler}
              >
                Delete
              </button>
              <button
                disabled={isButtonDisabled}
                className={`flex-1 bg-gray-300 py-2 rounded text-black font-bold ${isButtonDisabled ? 'opacity-50' : ''}`}
                onClick={() => setDeleteStudentAccountModalVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {changeProfilePicModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 w-[90vw] max-w-md">
            <span className="text-lg font-semibold text-center">
              Upload new Profile Picture below 250KB.
            </span>
            <div className="flex flex-col items-center gap-2 my-2">
              <input type="file" accept="image/jpeg,image/jpg" onChange={pickUpImage} />
              {imageResponse ? (
                <img src={URL.createObjectURL(imageResponse)} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <span className="font-bold text-black">No Image Selected</span>
              )}
            </div>
            <div className="flex flex-row gap-4 w-full justify-center">
              <button
                disabled={isButtonDisabled}
                className={`flex-1 bg-[#aacc00] py-2 rounded text-black font-bold ${isButtonDisabled ? 'opacity-50' : ''}`}
                onClick={changeStudentProfilePhotoHandler}
              >
                Update
              </button>
              <button
                disabled={isButtonDisabled}
                className={`flex-1 bg-gray-300 py-2 rounded text-black font-bold ${isButtonDisabled ? 'opacity-50' : ''}`}
                onClick={() => setChangeProfilePicModalVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudentAccounts;