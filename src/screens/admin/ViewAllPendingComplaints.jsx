import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPendingComplaints } from "../../services/operations/AdminAPI";
import toast from "react-hot-toast";

const ViewAllPendingComplaints = () => {
    const [registeredComplaints, setRegisteredComplaints] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.Auth);

    const fetchRegisteredComplaints = async () => {
        setRegisteredComplaints(null);
        const data = await dispatch(fetchAllPendingComplaints(token, toast));
        setRegisteredComplaints(data);
    };

    useEffect(() => {
        fetchRegisteredComplaints();
    }, []);

    const getDateFormat = (date) => new Date(date).toLocaleString();

    return (
        <div className="w-full py-6 flex flex-col justify-center items-center gap-[1rem]">

            {registeredComplaints && (
                <div className="w-full flex items-center justify-center gap-3">
                    <p className="text-lg font-semibold text-black">Complaints In Review</p>
                    <span className="bg-purple-400 text-white font-bold px-3 py-1 rounded-full">
                        {registeredComplaints.length}
                    </span>
                </div>
            )}

            <div className='w-[95%] flex md:flex-row flex-col gap-[1rem] justify-center mx-auto items-stretch flex-wrap'>
                {
                registeredComplaints && (registeredComplaints.length === 0 ? (<p className="w-full text-lg text-center font-bold text-black">No Unresolved Complaints</p>) : (
                    registeredComplaints.map((complaint) => (
                    <div
                        key={complaint?.id}
                        className="md:w-[30%] w-full bg-gray-100 shadow-md rounded-md p-6 gap-[1rem] flex flex-col justify-between items-start"
                    >
                        <div className='flex flex-col gap-[0.5rem] justify-center items-start'>
                            <p><strong>Created On:</strong> {getDateFormat(complaint?.createdAt)}</p>
                            <p><strong>Student Name:</strong> {complaint?.instituteStudent?.name}</p>
                            <strong>
                                Room No. - {complaint?.instituteStudent?.cot?.room.roomNumber}, Cot No. - {complaint?.instituteStudent?.cot?.cotNo} ({complaint?.instituteStudent?.hostelBlock?.name})
                            </strong>
                            <p><strong>Category:</strong> {complaint?.category}</p>
                            <p><strong>About:</strong> {complaint?.about}</p>

                            {complaint?.fileUrl[0] && (
                                <p>
                                    <strong>Attachments:</strong>{' '}
                                    <a
                                        href={complaint?.fileUrl[0]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        Click Here to See
                                    </a>
                                </p>
                            )}

                            <p>
                                <strong>Status:</strong>{' '}
                                <span
                                    className={`font-bold text-orange-500`}
                                >
                                    UNRESOLVED
                                </span>
                            </p>
                        </div>
                    </div>
                    ))
                ))
                }
            </div>
            </div>
    )
}

export default ViewAllPendingComplaints;