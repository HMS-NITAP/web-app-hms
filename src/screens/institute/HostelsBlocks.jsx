import React, { useEffect, useState } from 'react';
import AnimatedCardHostelBlock from '../../components/common/AnimatedCardHostelBlock';
import { useDispatch } from 'react-redux';
import { fetchHostelData } from '../../services/operations/CommonAPI';
import { toast } from 'react-hot-toast';

const HostelBlocks = () => {
  const [loading, setLoading] = useState(true);
  const [boysHostelData, setBoysHostelData] = useState([]);
  const [girlsHostelData, setGirlsHostelData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchHostelBlockData = async () => {
      try {
        const data = await dispatch(fetchHostelData(toast));
        if (!data) {
          toast.error('Failed to fetch hostel data');
          return;
        }

        setBoysHostelData(data.filter((item) => item.gender === 'M'));
        setGirlsHostelData(data.filter((item) => item.gender === 'F'));
        toast.success('Hostel data loaded successfully');
      } catch (error) {
        toast.error('Something went wrong while fetching hostel data');
      } finally {
        setLoading(false);
      }
    };

    fetchHostelBlockData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <p className="text-lg font-semibold">Loading Hostel Data...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-start px-4 py-6 gap-12">
      {/* Girls Hostel Blocks */}
      <div className="w-full flex flex-col items-center">
        <h2 className="text-xl font-bold text-black text-center mb-4">Girls Hostel Blocks</h2>
        <div className="w-[95%] flex md:flex-row flex-col justify-center items-start flex-wrap md:gap-[2rem] gap-[1rem]">
          {girlsHostelData.map((data, index) => (
            <AnimatedCardHostelBlock key={index} data={data} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-1 bg-gray-600 rounded-full"></div>

      {/* Boys Hostel Blocks */}
      <div className="w-full flex flex-col items-center">
        <h2 className="text-xl font-bold text-black text-center mb-4">Boys Hostel Blocks</h2>
        <div className="w-[95%] flex md:flex-row flex-col justify-center items-start flex-wrap gap-6">
          {boysHostelData.map((data, index) => (
            <AnimatedCardHostelBlock key={index} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HostelBlocks;
