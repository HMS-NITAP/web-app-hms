import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAnnouncements } from '../../services/operations/CommonAPI';
import { deleteAnnouncement } from '../../services/operations/AdminAPI';
import { toast } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa6';

const Announcements = () => {
  const [announcementData, setAnnouncementData] = useState([]);
  const [announcementId, setAnnouncementId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [bgColor, setBgColor] = useState(false);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);
  const { user } = useSelector((state) => state.Profile);

  const fetchAnnouncements = useCallback(async () => {
    const data = await dispatch(getAllAnnouncements(toast));
    setAnnouncementData(data);
  }, [dispatch]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgColor((prev) => !prev);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const convertDate = (date) => new Date(date).toLocaleString('en-US');

  const isNew = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const differenceInDays = (now - createdDate) / (1000 * 3600 * 24);
    return differenceInDays <= 2;
  };

  const handleDeleteClick = (id) => {
    setAnnouncementId(id);
    setIsModalOpen(true);
  };

  const deleteAnnouncementHandler = async () => {
    if (!announcementId) return;
    setIsButtonDisabled(true);
    const response = await dispatch(deleteAnnouncement(announcementId, token, toast));
    if (response) fetchAnnouncements();
    setIsButtonDisabled(false);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full px-4 py-6 space-y-6">
      {announcementData.length === 0 ? (
        <p className="text-center font-bold text-lg text-black">No Announcements Found</p>
      ) : (
        announcementData.map((announcement) => (
          <div key={announcement.id} className="border border-black rounded-lg p-4 bg-white shadow-md relative">
            {isNew(announcement.createdAt) && (
              <div
                className={`absolute right-0 top-0 px-3 py-1 rounded-bl-xl text-white font-bold text-xs ${
                  bgColor ? 'bg-red-700' : 'bg-red-500'
                }`}
              >
                New
              </div>
            )}
            <p className="text-gray-600 text-sm">Created At: {convertDate(announcement.createdAt)}</p>
            <p className="text-gray-600 text-sm">
              Created By: <span className="text-black font-semibold">{announcement.createdBy?.name} ({announcement.createdBy?.designation})</span>
            </p>
            <p className="text-lg font-bold text-black">{announcement.title}</p>
            <p className="text-base text-black">{announcement.textContent}</p>
            {announcement.fileUrl[0] && (
              <p className="text-sm text-gray-600">
                Attachments:{" "}
                <a href={announcement.fileUrl[0]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Click Here to See
                </a>
              </p>
            )}
            {user?.accountType === "ADMIN" && (
              <button
                onClick={() => handleDeleteClick(announcement.id)}
                className="mt-4 w-full flex items-center justify-center bg-red-200 hover:bg-red-300 text-black font-semibold py-2 rounded"
              >
                <FaTrash className="mr-2 text-red-700" /> Delete
              </button>
            )}
          </div>
        ))
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <p className="text-center font-medium text-lg text-black mb-4">Are you sure you want to delete this announcement?</p>
            <div className="flex justify-center gap-4">
              <button
                disabled={isButtonDisabled}
                onClick={deleteAnnouncementHandler}
                className={`bg-red-500 text-white px-4 py-2 rounded ${isButtonDisabled ? 'opacity-50' : ''}`}
              >
                Delete
              </button>
              <button
                disabled={isButtonDisabled}
                onClick={() => setIsModalOpen(false)}
                className={`bg-gray-300 text-black px-4 py-2 rounded ${isButtonDisabled ? 'opacity-50' : ''}`}
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

export default Announcements;
