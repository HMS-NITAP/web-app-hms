import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createStudentAccount } from '../../services/operations/AuthAPI';
import { createNewStudentFirstYear } from '../../services/operations/AdminAPI';

const CreateNewStudent = () => {

    const branchOptions = ["CSE","ECE","EEE","MECH","CIVIL","BIOTECH","CHEM","MME"];
    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    const dispatch = useDispatch();
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const { token } = useSelector((state) => state.Auth);


    const submitHandler = async(data) => {
        if(!selectedBranch){
            toast("Select your Branch",{icon:"⚠️"});
            return;
        }

        setIsButtonDisabled(true);
        const registrationData = {
            ...data,
            branch:selectedBranch,
            gender:selectedGender,
        }
        const formdata = new FormData();
        Object.entries(registrationData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formdata.append(key, value);
        });
        await dispatch(createNewStudentFirstYear(formdata,toast,token));
        reset();
        setSelectedBranch(null);
        setSelectedGender(null);
        setIsButtonDisabled(false);
    }

    return (
        <div className="w-full overflow-x-hidden flex flex-col justify-center items-center gap-6 pl-5 pr-5">
            <h1 className="text-lg font-bold text-black text-center pt-5 pb-5">Create New Student Account (1st Year)</h1>
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

                {/* Roll Number */}
                <div className="md:w-[48%] w-full flex flex-col gap-[0.25rem]">
                    <label className="font-medium text-black">Institute Roll Number <span className="text-xs text-red-600">*</span> :</label>
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
                    <label className="font-medium text-black">Institute Registration Number <span className="text-xs text-red-600">*</span> :</label>
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

                
                <div className='w-full overflow-hidden flex justify-center items-center'>
                    <button type="submit" className="cursor-pointer hover:scale-105 transition-all duration-200 px-[1.5rem] py-[0.5rem] rounded-xl font-bold text-lg text-black bg-yellow-400 mt-2 disabled:opacity-60" disabled={isButtonDisabled}>Submit Data</button>
                </div>
            </form>
        </div>
    )
}

export default CreateNewStudent