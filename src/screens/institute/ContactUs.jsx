import React from 'react';
import { hostelCommiteeData, medicalAndSecurityOfficerData, securitySepervisorsData, hostelOfficeStaffData } from '../../static/ContactUsData';
import AnimatedCardPerson from '../../components/common/AnimatedCardPerson';

const ContactUs = () => {
  return (
    <div className="w-full overflow-y-auto px-0 py-4 flex flex-col items-start gap-12">

      {/* Hostel Committee */}
      <div className="w-full flex flex-col items-center">
        <h2 className="text-lg font-bold text-black text-center">NIT Andhra Pradesh Hostel Committee</h2>
        <div className="w-[95%] flex md:flex-row flex-col justify-center items-start flex-wrap md:gap-[2rem] gap-[1rem]">
          {hostelCommiteeData.map((data, index) => (
            <AnimatedCardPerson key={index} data={data} />
          ))}
        </div>
      </div>

      <div className="w-full h-[2px] bg-gray-600 rounded-full"></div>

      {/* Hostel Office Staff */}
      <div className="w-full flex flex-col items-center">
        <h2 className="text-lg font-bold text-black text-center">Hostel Office Staff</h2>
        <div className="w-[95%] flex md:flex-row flex-col justify-center items-start flex-wrap md:gap-[2rem] gap-[1rem]">
          {hostelOfficeStaffData.map((data, index) => (
            <AnimatedCardPerson key={index} data={data} />
          ))}
        </div>
      </div>

      <div className="w-full h-[2px] bg-gray-600 rounded-full"></div>

      {/* Medical and Security Officer */}
      <div className="w-full flex flex-col items-center">
        <h2 className="text-lg font-bold text-black text-center">Medical and Security Officer</h2>
        <div className="w-[95%] flex md:flex-row flex-col justify-center items-start flex-wrap md:gap-[2rem] gap-[1rem]">
          {medicalAndSecurityOfficerData.map((data, index) => (
            <AnimatedCardPerson key={index} data={data} />
          ))}
        </div>
      </div>

      <div className="w-full h-[2px] bg-gray-600 rounded-full"></div>

      {/* Security Supervisors */}
      <div className="w-full flex flex-col items-center">
        <h2 className="text-lg font-bold text-black text-center">Security Supervisors</h2>
        <div className="w-[95%] flex md:flex-row flex-col justify-center items-start flex-wrap md:gap-[2rem] gap-[1rem]">
          {securitySepervisorsData.map((data, index) => (
            <AnimatedCardPerson key={index} data={data} />
          ))}
        </div>
      </div>

      {/* Account Deletion Notice */}
      <div className="w-full my-4 mx-10">
        <p className="text-center text-[#4a4e69]">
          If you want to delete your account, please contact us at{" "}
          <a
            href="mailto:hmsnitap@gmail.com"
            className="text-blue-600 underline"
          >
            hmsnitap@gmail.com
          </a>{" "}
          from your registered mail ID along with the reason for account deletion.
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
