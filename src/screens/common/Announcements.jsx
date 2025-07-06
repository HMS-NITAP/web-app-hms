import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAnnouncements } from '../../services/operations/CommonAPI';
import { deleteAnnouncement } from '../../services/operations/AdminAPI';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa6';
import MainButton from '../../components/common/MainButton';

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
        <div className="flex w-[95%] mx-auto md:flex-row flex-wrap flex-col gap-[1.5rem] justify-center items-stretch">
          {announcementData.map((announcement) => (
            <div
              key={announcement.id}
              className="md:w-[48%] w-full bg-white shadow-md rounded-xl p-4 flex flex-col gap-3 relative transition-all duration-300"
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
                <MainButton 
                  onPress={() => {
                    setAnnouncementId(announcement.id);
                    setIsModalOpen(true);
                  }} 
                  width='w-full'
                  textColor='text-red-800'
                  backgroundColor='bg-red-300'
                  text={<FaTrash size={18} />}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white backdrop-blur-lg border border-white/30 shadow-xl rounded-xl p-6 md:w-full w-[90%] max-w-md" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
            <p className="text-center text-lg font-semibold text-black">
              Are you sure? This announcement will be deleted.
            </p>
            <div className="flex justify-evenly mt-2">
              <MainButton text={"Delete"} onPress={deleteAnnouncementHandler} isButtonDisabled={isButtonDisabled} backgroundColor='bg-red-500' textColor='text-white' />
              <MainButton text={"Cancel"} onPress={() => setIsModalOpen(false)} isButtonDisabled={isButtonDisabled} backgroundColor='bg-gray-300' textColor='text-black' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
