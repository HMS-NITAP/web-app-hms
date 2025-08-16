import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setRegistrationData, setRegistrationStep } from '../../reducers/slices/AuthSlice';
import { sendOtpToStudent } from '../../services/operations/AuthAPI';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { MAX_FEE_RECEIPT_FILE_SIZE, MAX_PROFILE_IMAGE_SIZE } from '../../config/config';

const StudentRegistrationForm = () => {
    const yearOptions = [
        { label: '1st Year', value: 1 },
        { label: '2nd Year', value: 2 },
        { label: '3rd Year', value: 3 },
        { label: '4th Year', value: 4 },
    ];
    const branchOptions = ["CSE","ECE","EEE","MECH","CIVIL","BIOTECH","CHEM","MME"];
    const communityOptions = ["GENERAL","OBC","SC","ST"];
    const paymentOption = [
        { label : "NET BANKING", value : "NET_BANKING"},
        { label : "DEBIT CARD", value : "DEBIT_CARD"},
        { label : "CREDIT CARD", value : "CREDIT_CARD"},
        { label : "UPI", value : "UPI"},
        { label : "NEFT", value : "NEFT"},
        { label : "NEFT(Educational Loan)", value : "NEFT_Educational_Loan"},
        { label : "OTHER", value : "OTHER"},
    ]

    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    const dispatch = useDispatch();

    const [imageResponse, setImageResponse] = useState(null);
    const [hostelfeeReceiptResponse, setHostelFeeReceiptResponse] = useState(null);
    const [instituteFeeReceiptResponse, setInstituteFeeReceiptResponse] = useState(null);

    const [selectedGender, setSelectedGender] = useState(null);
    const [dob, setDob] = useState("");
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [pwdStatus, setPwdStatus] = useState(null);
    const [paymentMode, setPaymentMode] = useState(null);
    const [paymentDate, setPaymentDate] = useState("");

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [secureText1, setSecureText1] = useState(true);
    const [secureText2, setSecureText2] = useState(true);

    function pickUpImage(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > MAX_PROFILE_IMAGE_SIZE) {
                toast('File size exceeds the limit of 250KB. Please select a smaller file.', { icon: '⚠️' });
            } else {
                setImageResponse(file);
            }
        }
    }

    function pickUpHostelFeeReceipt(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > MAX_FEE_RECEIPT_FILE_SIZE) {
                toast('File size exceeds the limit of 250KB. Please select a smaller file.', { icon: '⚠️' });
            } else {
                setHostelFeeReceiptResponse(file);
            }
        }
    }

    function pickUpInstituteFeeReceipt(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > MAX_FEE_RECEIPT_FILE_SIZE) {
                toast('File size exceeds the limit of 250KB. Please select a smaller file.', { icon: '⚠️' });
            } else {
                setInstituteFeeReceiptResponse(file);
            }
        }
    }

    const formatDate = (date) => {
        if (!date) return "NO DATE IS SELECTED";
        return new Date(date).toLocaleDateString();
    };

    const covertToLocalDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString('en-CA');
    }

    const submitHandler = async(data) => {
        if(!data?.email.endsWith("@student.nitandhra.ac.in") && selectedYear !== 1){
            // When 1st Years Join
            toast("Please Use Your Institute Email ID",{icon:"⚠️"});
            return;
        }else if(data?.password !== data?.confirmPassword){
            toast("Passwords are not matching",{icon:"⚠️"});
            return;
        }else if(!selectedBranch){
            toast("Select your Branch",{icon:"⚠️"});
            return;
        }else if(!selectedCommunity){
            toast("Select your Community",{icon:"⚠️"});
            return;
        }else if(!selectedGender){
            toast("Select your Gender",{icon:"⚠️"});
            return;
        }else if(!selectedYear){
            toast("Select your Year",{icon:"⚠️"});
            return;
        }else if(!dob){
            toast("Select your DOB",{icon:"⚠️"});
            return;
        }else if(!pwdStatus){
            toast("Select your PWD status",{icon:"⚠️"});
            return;
        }else if(!paymentMode){
            toast("Select Hostel Fee Payment Mode",{icon:"⚠️"});
            return;
        }else if(!paymentDate){
            toast("Select Hostel Fee Payment Date",{icon:"⚠️"});
            return;
        }else if(!hostelfeeReceiptResponse){
            toast("Upload hostel Fee Receipt",{icon:"⚠️"});
            return;
        }else if(!instituteFeeReceiptResponse){
            toast("Upload institute Fee Receipt",{icon:"⚠️"});
            return;
        }else if(!imageResponse){
            toast("Upload your Profile Image",{icon:"⚠️"});
            return;
        }
        setIsButtonDisabled(true);
        const registrationData = {
            ...data,
            branch:selectedBranch,
            community:selectedCommunity,
            gender:selectedGender,
            year:selectedYear,
            dob: covertToLocalDate(dob),
            pwd:pwdStatus,
            image:imageResponse,
            instituteFeeReceipt:instituteFeeReceiptResponse,
            hostelFeeReceipt:hostelfeeReceiptResponse,
            paymentMode,
            paymentDate:covertToLocalDate(paymentDate)
        }
        await dispatch(setRegistrationData(registrationData));
        const response = await dispatch(sendOtpToStudent(data.email,toast));
        if(response){
            await dispatch(setRegistrationStep(2));
        }
        setIsButtonDisabled(false);
    }

    return (
        <div className="w-full overflow-x-hidden flex flex-col justify-center items-center gap-6">
            <div className="w-full bg-[#e9edc9] rounded-2xl px-4 py-4 gap-2">
                <p className="text-center text-lg font-bold text-black mb-2">INSTRUCTIONS (ODD SEM REGISTRATION):</p>
                <ul className="text-black text-base font-semibold list-disc pl-5 space-y-1">
                    <li>Please complete your Institute Registration before proceeding with the Hostel Registration.</li>
                    <li>Click on the Link to Open Fee Payment Portal : <a href="https://payments.billdesk.com/bdcollect/pay?p1=5213&p2=15" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">https://payments.billdesk.com/bdcollect/pay?p1=5213&p2=15</a></li>
                    {/* <li>Ensure your Institute email address is correct.</li> */}
                    <li>Ensure your email address is correct.</li>
                    <li>Fill the details with atmost care, as once saved they can't be changed.</li>
                    <li>Upload a <strong>recent proper passport size photo</strong> of yours not exceeding 250 KB size.</li>
                    <li>Upload Image in JPG or JPEG format.</li>
                    <li>Upload Your fee Receipts in PDF Format not exceeding 250 KB size each</li>
                    <li>Contact support under Development Team, if you encounter any issues</li>
                    <li>Do not share your OTP and credentials with anyone.</li>
                </ul>
            </div>
            <form className="w-full flex md:flex-row justify-between items-center flex-wrap flex-col gap-[1rem]" onSubmit={handleSubmit(submitHandler)}>
                {/* Student Name */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Student Name <span className="text-xs text-red-600">*</span> :</label>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your name" />
                        )}
                        name="name"
                        defaultValue=""
                    />
                    {errors.name && <span className="text-red-600 text-sm">Student Name is required.</span>}
                </div>
                {/* Institute Email ID */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    {/* <label className="font-medium text-black">Institute Email ID <span className="text-xs text-red-600">*</span> :</label> */}
                    <label className="font-medium text-black">Email ID <span className="text-xs text-red-600">*</span> :</label>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your institute email ID" />
                        )}
                        name="email"
                        defaultValue=""
                    />
                    {/* {errors.email && <span className="text-red-600 text-sm">Institute Email is required.</span>} */}
                    {errors.email && <span className="text-red-600 text-sm">Email is required.</span>}
                </div>
                {/* Password */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem] relative">
                    <label className="font-medium text-black">Password <span className="text-xs text-red-600">*</span> :</label>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <input {...field} type={secureText1 ? "password" : "text"} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your password" />
                        )}
                        name="password"
                        defaultValue=""
                    />
                    <button
                        type="button"
                        className="cursor-pointer absolute right-3 top-[55%] text-gray-400"
                        onClick={() => setSecureText1(!secureText1)}
                        >
                        {secureText1 ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                    {errors.password && <span className="text-red-600 text-sm">Password is required.</span>}
                </div>
                {/* Confirm Password */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem] relative">
                    <label className="font-medium text-black">Confirm Password <span className="text-xs text-red-600">*</span> :</label>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <input {...field} type={secureText2 ? "password" : "text"} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Re-Enter your password" />
                        )}
                        name="confirmPassword"
                        defaultValue=""
                    />
                    <button type="button" className="cursor-pointer absolute right-3 top-[55%] text-gray-400" onClick={() => setSecureText2(!secureText2)}>
                        {secureText2 ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                    {errors.confirmPassword && <span className="text-red-600 text-sm">Please confirm your password.</span>}
                </div>
                {/* Profile Image */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Profile Image (Decent passport size photo) <span className="text-xs text-red-600">*</span> :</label>
                    <div className="flex w-full items-center justify-between gap-[1rem]">
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg"
                            onChange={pickUpImage}
                            className="max-w-[250px] px-[1rem] py-2 bg-blue-500 text-white font-semibold rounded-md cursor-pointer transition-transform duration-200 hover:scale-105"
                        />
                        {imageResponse ? (
                            <img src={URL.createObjectURL(imageResponse)} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover" />
                        ) : (
                            <span className="font-bold text-black text-center">No Image Selected</span>
                        )}
                    </div>
                </div>
                {/* Roll Number */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Roll Number <span className="text-xs text-red-600">*</span> :</label>
                    <Controller
                        control={control}
                        rules={{ 
                            required: true,
                            pattern: {
                                value: /^[0-9]{6}$/,
                                message: 'Roll number must be exactly 6 digits and only numbers.'
                            }
                        }}
                        render={({ field }) => (
                            <input {...field} onWheel={(e) => e.target.blur()} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your roll number" type="number" />
                        )}
                        name="rollNo"
                        defaultValue=""
                    />
                    {errors.rollNo && <span className="text-red-600 text-sm">{errors.rollNo.message}</span>}
                </div>
                {/* Registration Number */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Registration Number <span className="text-xs text-red-600">*</span> :</label>
                    <Controller
                        control={control}
                        rules={{ 
                            required: true,
                            pattern: {
                                value: /^[0-9]{6,7}$/,
                                message: 'Roll number must be exactly 6 or 7 digits.'
                            }
                        }}
                        render={({ field }) => (
                            <input {...field} onWheel={(e) => e.target.blur()} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your registration number" type="number" />
                        )}
                        name="regNo"
                        defaultValue=""
                    />
                    {errors.regNo && <span className="text-red-600 text-sm">{errors.regNo.message}</span>}
                </div>
                {/* Year */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Year <span className="text-xs text-red-600">*</span> :</label>
                    <select className="w-full p-2 border border-gray-400 rounded-lg text-black" value={selectedYear || ''} onChange={e => setSelectedYear(Number(e.target.value))}>
                        <option value="">Select Your Enrollment Year</option>
                        {yearOptions.map((year, idx) => (
                            <option key={idx} value={year.value}>{year.label}</option>
                        ))}
                    </select>
                </div>
                {/* Branch */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Branch <span className="text-xs text-red-600">*</span> :</label>
                    <select className="w-full p-2 border border-gray-400 rounded-lg text-black" value={selectedBranch || ''} onChange={e => setSelectedBranch(e.target.value)}>
                        <option value="">Select Branch</option>
                        {branchOptions.map((branch, idx) => (
                            <option key={idx} value={branch}>{branch}</option>
                        ))}
                    </select>
                </div>
                {/* Gender */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Gender <span className="text-xs text-red-600">*</span> :</label>
                    <div className="w-full flex flex-row ml-[6rem] gap-[3rem]">
                        <label className="flex items-center gap-1">
                            <input type="radio" name="gender" value="M" checked={selectedGender === 'M'} onChange={() => setSelectedGender('M')} />
                            <span className="font-bold text-black">Male</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input type="radio" name="gender" value="F" checked={selectedGender === 'F'} onChange={() => setSelectedGender('F')} />
                            <span className="font-bold text-black">Female</span>
                        </label>
                    </div>
                </div>
                {/* Community */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Community <span className="text-xs text-red-600">*</span> :</label>
                    <select className="w-full p-2 border border-gray-400 rounded-lg text-black" value={selectedCommunity || ''} onChange={e => setSelectedCommunity(e.target.value)}>
                        <option value="">Select Community</option>
                        {communityOptions.map((community, idx) => (
                            <option key={idx} value={community}>{community}</option>
                        ))}
                    </select>
                </div>
                {/* PWD Status */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">PWD Status <span className="text-xs text-red-600">*</span> :</label>
                    <div className="w-full flex flex-row ml-[6rem] gap-[3rem]">
                        <label className="flex items-center gap-1">
                            <input type="radio" name="pwdStatus" value="Yes" checked={pwdStatus === 'Yes'} onChange={() => setPwdStatus('Yes')} />
                            <span className="font-bold text-black">Yes</span>
                        </label>
                        <label className="flex items-center gap-1">
                            <input type="radio" name="pwdStatus" value="No" checked={pwdStatus === 'No'} onChange={() => setPwdStatus('No')} />
                            <span className="font-bold text-black">No</span>
                        </label>
                    </div>
                </div>
                {/* Date of Birth */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Date of Birth <span className="text-xs text-red-600">*</span> :</label>
                    <div className="flex flex-row justify-start items-center gap-[2rem] ml-[6rem]">
                        <input type="date" className="p-2 border border-gray-400 rounded-lg text-black" value={dob || ''} onChange={e => setDob(e.target.value)} max={new Date().toISOString().split('T')[0]} />
                        {/* <span className="font-bold text-center text-black">{formatDate(dob)}</span> */}
                    </div>
                </div>
                {/* Aadhaar Number */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Aadhaar Number <span className="text-xs text-red-600">*</span> :</label>
                    <Controller
                        control={control}
                        rules={{ 
                            required: true,
                            pattern: {
                                value: /^[0-9]{12}$/,
                                message: 'Aadhaar number must be exactly 12 digits and only numbers.'
                            }
                        }}
                        render={({ field }) => (
                            <input {...field} onWheel={(e) => e.target.blur()} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your aadhaar number" type="number" />
                        )}
                        name="aadhaarNumber"
                        defaultValue=""
                    />
                    {errors.aadhaarNumber && <span className="text-red-600 text-sm">{errors.aadhaarNumber.message}</span>}
                </div>
                {/* Blood Group */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Blood Group <span className="text-xs text-red-600">*</span> :</label>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your blood group" />
                        )}
                        name="bloodGroup"
                        defaultValue=""
                    />
                    {errors.bloodGroup && <span className="text-red-600 text-sm">Blood group is required.</span>}
                </div>
                {/* Institute Fee Receipt */}
                {/* <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Institute Fee Receipt <span className="text-xs text-red-600">*</span> :</label>
                    <div className="flex w-full items-center justify-between gap-[1rem]">
                        <input type="file" accept="application/pdf" onChange={pickUpInstituteFeeReceipt} className="max-w-[250px] px-[1rem] py-2 bg-blue-500 text-white font-semibold rounded-md cursor-pointer transition-transform duration-200 hover:scale-105" />
                        {instituteFeeReceiptResponse ? (
                            <span className="font-bold text-black text-wrap text-[0.75rem]">{instituteFeeReceiptResponse.name}</span>
                        ) : (
                            <span className="font-bold text-black text-wrap">No File Selected</span>
                        )}
                    </div>
                </div> */}
                {/* Hostel Fee Receipt */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Fee Receipt (containing Hostel fee payment details) <span className="text-xs text-red-600">*</span> :</label>
                    <div className="flex w-full items-center justify-between gap-[1rem]">
                        <input type="file" accept="application/pdf" onChange={pickUpHostelFeeReceipt} className="max-w-[250px] px-[1rem] py-2 bg-blue-500 text-white font-semibold rounded-md cursor-pointer transition-transform duration-200 hover:scale-105" />
                        {hostelfeeReceiptResponse ? (
                            <span className="font-bold text-black text-wrap text-[0.75rem]">{hostelfeeReceiptResponse.name}</span>
                        ) : (
                            <span className="font-bold text-black text-wrap">No File Selected</span>
                        )}
                    </div>
                </div>
                {/* Hostel Fee Payment Mode */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Hostel Fee Payment Mode <span className="text-xs text-red-600">*</span> :</label>
                    <select className="max-w-full p-2 border border-gray-400 rounded-lg text-black" value={paymentMode || ''} onChange={e => setPaymentMode(e.target.value)}>
                        <option value="">Select Your Payment Mode</option>
                        {paymentOption.map((mode, idx) => (
                            <option key={idx} value={mode.value}>{mode.label}</option>
                        ))}
                    </select>
                </div>
                {/* Hostel Fee Payment Date */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Hostel Fee Payment Date <span className="text-xs text-red-600">*</span> :</label>
                    <div className="flex flex-row justify-start items-center gap-[2rem] ml-[6rem]">
                        <input type="date" className="p-2 border border-gray-400 rounded-lg text-black" value={paymentDate || ''} onChange={e => setPaymentDate(e.target.value)} />
                        {/* <span className="font-bold text-center text-black">{formatDate(paymentDate)}</span> */}
                    </div>
                </div>
                {/* Hostel Fee Payment Amount */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Hostel Fee Payment Amount <span className="text-xs text-red-600">*</span> :</label>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <input {...field} onWheel={(e) => e.target.blur()} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter amount paid" type="number" />
                        )}
                        name="amountPaid"
                        defaultValue=""
                    />
                    {errors.amountPaid && <span className="text-red-600 text-sm">Amount Paid is required.</span>}
                </div>
                {/* Student Mobile Number */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Student Mobile Number <span className="text-xs text-red-600">*</span> :</label>
                    <Controller
                        control={control}
                        rules={{ 
                            required: true,
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: 'Mobile number must be exactly 10 digits and only numbers.'
                            }
                        }}
                        render={({ field }) => (
                            <input {...field} onWheel={(e) => e.target.blur()} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your mobile number" type="number" />
                        )}
                        name="phone"
                        defaultValue=""
                    />
                    {errors.phone && <span className="text-red-600 text-sm">{errors.phone.message}</span>}
                </div>
                {/* Father Name */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Father Name <span className="text-xs text-red-600">*</span> :</label>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your father name" />
                        )}
                        name="fatherName"
                        defaultValue=""
                    />
                    {errors.fatherName && <span className="text-red-600 text-sm">Father Name is required.</span>}
                </div>
                {/* Mother Name */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Mother Name <span className="text-xs text-red-600">*</span> :</label>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your mother name" />
                        )}
                        name="motherName"
                        defaultValue=""
                    />
                    {errors.motherName && <span className="text-red-600 text-sm">Mother Name is required.</span>}
                </div>
                {/* Parent Mobile Number */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Parent Mobile Number <span className="text-xs text-red-600">*</span> :</label>
                    <Controller
                        control={control}
                        rules={{ 
                            required: true,
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: 'Mobile number must be exactly 10 digits and only numbers.'
                            }
                        }}
                        render={({ field }) => (
                            <input {...field} onWheel={(e) => e.target.blur()} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your parent number" type="number" />
                        )}
                        name="parentsPhone"
                        defaultValue=""
                    />
                    {errors.parentsPhone && <span className="text-red-600 text-sm">{errors.parentsPhone.message}</span>}
                </div>
                {/* Emergency Contact Number */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Emergency Contact Number <span className="text-xs text-red-600">*</span> :</label>
                    <Controller
                        control={control}
                        rules={{ 
                            required: true,
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: 'Mobile number must be exactly 10 digits and only numbers.'
                            }
                        }}
                        render={({ field }) => (
                            <input {...field} onWheel={(e) => e.target.blur()} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter emergency contact number" type="number" />
                        )}
                        name="emergencyPhone"
                        defaultValue=""
                    />
                    {errors.emergencyPhone && <span className="text-red-600 text-sm">{errors.emergencyPhone.message}</span>}
                </div>
                {/* Address */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Address <span className="text-xs text-red-600">*</span> :</label>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <input {...field} className="w-full p-2 border border-gray-400 rounded-lg text-black" placeholder="Enter your address" />
                        )}
                        name="address"
                        defaultValue=""
                    />
                    {errors.address && <span className="text-red-600 text-sm">Address is required.</span>}
                </div>
                
                <div className='w-full overflow-hidden flex justify-center items-center'>
                    <button type="submit" className="cursor-pointer hover:scale-105 transition-all duration-200 px-[1.5rem] py-[0.5rem] rounded-xl font-bold text-lg text-black bg-yellow-400 mt-2 disabled:opacity-60" disabled={isButtonDisabled}>Submit Data</button>
                </div>
            </form>
        </div>
    )
}

export default StudentRegistrationForm;