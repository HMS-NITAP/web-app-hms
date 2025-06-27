import React from 'react';
import { hostelOfficeAdvisorsData, developmentTeamData } from '../../static/DevelopmentTeamData';
import AnimatedCardPerson from '../../components/common/AnimatedCardPerson';

const DevelopmentTeam = () => {
  return (
    <div className="w-full max-h-screen overflow-y-auto px-4 py-6 flex flex-col items-start gap-12">

      {/* Hostel Office Advisors */}
      <div className="w-full flex flex-col items-center">
        <h2 className="text-lg font-bold text-black text-center">Hostel Office Advisors</h2>
        <div className="w-[95%] flex flex-col gap-6 py-6">
          {hostelOfficeAdvisorsData.map((data, index) => (
            <AnimatedCardPerson key={index} data={data} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[2px] bg-gray-600 rounded-full"></div>

      {/* Developers Team */}
      <div className="w-full flex flex-col items-center">
        <h2 className="text-lg font-bold text-black text-center">Developers Team</h2>
        <div className="w-[95%] flex flex-col gap-6 py-6">
          {developmentTeamData.map((data, index) => (
            <AnimatedCardPerson key={index} data={data} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default DevelopmentTeam;
