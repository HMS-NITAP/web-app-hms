import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAnnouncements } from '../../services/operations/CommonAPI';
import { deleteAnnouncement } from '../../services/operations/AdminAPI';
import toast from 'react-hot-toast';
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
    const created = new Date(createdAt);
    return (now - created) / (1000 * 60 * 60 * 24) <= 2;
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
    <div className="w-full flex flex-col gap-5 px-4 py-6">
      {announcementData?.length === 0 ? (
        <p className="text-center text-lg font-bold text-black">No Announcements Found</p>
      ) : (
        <div className="flex md:flex-row flex-wrap flex-col gap-[1.5rem] justify-start items-start">
          {announcementData.map((announcement) => (
            <div
              key={announcement.id}
              className="md:w-[45%] w-[90%] bg-white shadow-md rounded-xl p-4 flex flex-col gap-3 relative transition-all duration-300"
            >
              {isNew(announcement.createdAt) && (
                <div
                  className={`absolute top-[-10px] right-[-10px] px-3 py-1 rounded-full text-white font-bold text-sm ${
                    bgColor ? 'bg-[rgba(128,15,47,0.8)]' : 'bg-[rgba(128,15,47,0.65)]'
                  }`}
                >
                  New
                </div>
              )}

              <div className="w-full flex md:flex-row flex-col justify-between items-start text-sm text-gray-600">
                <p>
                  Created At:{' '}
                  <span className="font-medium text-black">{convertDate(announcement.createdAt)}</span>
                </p>
                <p>
                  Created By:{' '}
                  <span className="font-semibold text-black">
                    {announcement.createdBy?.name} ({announcement.createdBy?.designation})
                  </span>
                </p>
              </div>

              <p className="text-lg font-bold text-black text-center">{announcement.title}</p>
              <p className="text-base font-medium text-black">{announcement.textContent}</p>

              {announcement.fileUrl?.[0] && (
                <p className="text-sm text-gray-600">
                  Attachments:{' '}
                  <a
                    href={announcement.fileUrl[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Click Here to See
                  </a>
                </p>
              )}

              {user?.accountType === 'ADMIN' && (
                <button
                  onClick={() => {
                    setAnnouncementId(announcement.id);
                    setIsModalOpen(true);
                  }}
                  className="flex justify-center items-center bg-pink-200 hover:bg-pink-300 text-red-700 p-2 rounded-lg transition"
                >
                  <FaTrash size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[90%] max-w-md rounded-lg p-6 flex flex-col gap-4">
            <p className="text-center text-lg font-semibold text-black">
              Are you sure? This announcement will be deleted.
            </p>
            <div className="flex justify-evenly mt-2">
              <button
                disabled={isButtonDisabled}
                onClick={deleteAnnouncementHandler}
                className={`px-4 py-2 rounded-md bg-red-500 text-white font-medium ${
                  isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
                }`}
              >
                Delete
              </button>
              <button
                disabled={isButtonDisabled}
                onClick={() => setIsModalOpen(false)}
                className={`px-4 py-2 rounded-md bg-gray-300 text-black font-medium ${
                  isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'
                }`}
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
