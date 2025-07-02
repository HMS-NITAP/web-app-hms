import { APIconnector } from "../APIconnector";
import { studentEndPoints } from "../APIs";

const { CREATE_OUTING_APPLICATION_API,
    DELETE_PENDING_OUTING_APPLICATION_API,
    GET_STUDENT_ALL_OUTING_APPLICATIONS_API,
    MARK_RETURN_FROM_OUTING_API,
    CREATE_HOSTEL_COMPLAINT_API,
    DELETE_HOSTEL_COMPLAINT_API,
    SHOW_ALL_STUDENT_COMPLAINT_API,
    FETCH_MESS_HALLS_AND_GENDER_API,
    CREATE_MESS_FEEDBACK_API,
    DELETE_MESS_FEEDBACK_API,
    GENERATE_MESS_SESSION_RECEIPT_API,
    FETCH_MESS_RECEIPTS_API,
    GET_STUDENT_DASHBOARD_DATA_APT,
    EDIT_STUDENT_PROFILE_API,
    GET_STUDENT_ATTENDENCE_API,
    ADD_EVEN_SEM_FEE_RECEIPT_API,
} = studentEndPoints;


export const CreateOutingApplication = (formData,token,toast) => {
    return async() => {
        let id = toast("Creating Outing Application...");
        try{
            const response = await APIconnector("POST",CREATE_OUTING_APPLICATION_API,formData,{"Content-Type": "multipart/form-data",Authorization: `Bearer ${token}`});

            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response?.data?.message);
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            toast.success("Outing Application Created Successfully");
            return true;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Failed to create Outing Application";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log("Eror",e);
            return false;
        }
    }
}

export const getStudentAllOutingApplication = (token,toast) => {
    return async () => {
        let id = toast("Please Wait...");
        try{
            const response = await APIconnector("GET",GET_STUDENT_ALL_OUTING_APPLICATIONS_API,null,{Authorization: `Bearer ${token}`});
            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response?.data?.message);
                throw new Error(response?.data?.message);

            }
            
            toast.dismiss(id);
            toast.success("Fetched All Applications");
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Application";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log(e)
        }
    }
}

export const deletePendingOutingApplication = (applicationId,token,toast) => {
    return async() => {
        let id = toast("Deleting Outing Application...");
        try{
            const response = await APIconnector("DELETE",DELETE_PENDING_OUTING_APPLICATION_API,{applicationId},{Authorization: `Bearer ${token}`});

            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response?.data?.message);
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            toast.success(response?.data?.message);
            return true;
            
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to Delete Outing Application";
            toast.dismiss(id);
            toast.error(errorMessage);
            return false;
        }
    }
}

export const markReturnFromOuting = (applicationId,token,toast) => {
    return async() => {
        let id = toast("Please Wait...");
        try{
            const response = await APIconnector("PUT",MARK_RETURN_FROM_OUTING_API,{applicationId},{Authorization: `Bearer ${token}`});

            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response?.data?.message);
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            toast.success(response?.data?.message);
            return true;
            
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to Mark Return";
            console.log(e);
            toast.dismiss(id);
            toast.error(errorMessage);
            return false;
        }
    }
}

export const createHostelComplaint = (formData,token,toast) => {
    return async () => {
        let id = toast("Please Wait...");
        try{
            const response = await APIconnector("POST",CREATE_HOSTEL_COMPLAINT_API,formData,{"Content-Type": "multipart/form-data",Authorization: `Bearer ${token}`});
            
            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response.data.message);
                throw new Error(response.data.message);
            }
            
            toast.dismiss(id);
            toast.success("Created Hostel Complaint Successfully");
            return true;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to create hostel Complaint";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log(e);
            return false;
        }
    }
}

export const getAllStudentHostelComplaint = (token,toast) => {
    return async () => {
        let id = toast("Please Wait...");
        try{
            const response = await APIconnector("GET",SHOW_ALL_STUDENT_COMPLAINT_API,null,{Authorization: `Bearer ${token}`});
            
            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response.data.message);
                throw new Error(response.data.message);
            }
            
            toast.dismiss(id);
            toast.success("Fetched Complaints Successfully");
            return response.data.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch hostel Complaints";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log(e)
        }
    }
}

export const getStudentDashboardData = (token,toast) => {
    return async() => {
        let id = toast("Please Wait...");
        try{
            const response = await APIconnector("GET",GET_STUDENT_DASHBOARD_DATA_APT,null,{Authorization: `Bearer ${token}`});
            
            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response.data.message);
                throw new Error(response.data.message);
            }
            
            toast.dismiss(id);
            toast.success(response?.data?.message);
            return response.data.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch student dashboard data";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log(e)
        }
    }
}

export const editStudentProfile = (formData,token,toast) => {
    return async() => {
        let id = toast("Please Wait...");
        try{
            const response = await APIconnector("PUT",EDIT_STUDENT_PROFILE_API,formData,{"Content-Type": "multipart/form-data",Authorization: `Bearer ${token}`});
            
            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response.data.message);
                throw new Error(response.data.message);
            }
            
            toast.dismiss(id);
            toast.success(response?.data?.message);
            return response.data.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to Edit student Profile data";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log(e)
        }
    }
}

export const fetchMessHallsAndStudentGender = (token,toast) => {
    return async() => {
        let id = toast("Please Wait...");
        try{
            const response = await APIconnector("GET",FETCH_MESS_HALLS_AND_GENDER_API,null,{Authorization: `Bearer ${token}`});

            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response?.data?.message);
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Failed to fetch Mess Hall";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log("Error",e);
        }
    }
}

export const createMessFeedBack = (formData,token,toast) => {
    return async() => {
        let id = toast("Creating Mess Feedback...");
        try{
            const response = await APIconnector("POST",CREATE_MESS_FEEDBACK_API,formData,{"Content-Type": "multipart/form-data",Authorization: `Bearer ${token}`});

            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response?.data?.message);
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            toast.success(response?.data?.message);
            return true;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Failed to Mess Feedback";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log("Eror",e);
            return false;
        }
    }
}

export const generateMessSessionReceipt = (formData,token,toast) => {
    return async() => {
        let id = toast("Generating receipt...");
        try{
            const response = await APIconnector("POST",GENERATE_MESS_SESSION_RECEIPT_API,formData,{"Content-Type": "multipart/form-data",Authorization: `Bearer ${token}`});

            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response?.data?.message);
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            toast.success(response?.data?.message);
            return true;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Failed to Generate Receipt";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log("Error",e);
            return false;
        }
    }
}

export const fetchStudentMessReceipts = (token,toast) => {
    return async() => {
        let id = toast("Please Wait...");
        try{
            const response = await APIconnector("GET",FETCH_MESS_RECEIPTS_API,null,{Authorization: `Bearer ${token}`});

            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response?.data?.message);
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            toast.success(response?.data?.message);
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "unable to fetch Receipts";
            toast.dismiss(id);
            toast.error(errorMessage);
            return null;
        }
    }
}

export const getStudentAttendance = (token,toast) => {
    return async() => {
        let id = toast("Please Wait...");
        try{
            const response = await APIconnector("GET",GET_STUDENT_ATTENDENCE_API,null,{Authorization: `Bearer ${token}`});
            
            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response.data.message);
                throw new Error(response.data.message);
            }
            
            toast.dismiss(id);
            toast.success(response?.data?.message);
            return response.data.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch student attendance data";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log(e)
        }
    }
}

export const addEvenSemFeeReceipt = (formData,token,toast) => {
    return async () => {
        let id = toast("Please Wait...");
        try{
            // if (typeof formData === "object" && formData !== null) {
            //     for (const key in formData) {
            //       if (formData.hasOwnProperty(key)) {
            //         console.log(`12 ${key}:`, formData[key]);
            //       }
            //     }
            //   } else {
            //     console.error("formData is not an object or is null");
            // }
              
            const response = await APIconnector("PUT",ADD_EVEN_SEM_FEE_RECEIPT_API,formData,{"Content-Type": "multipart/form-data",Authorization: `Bearer ${token}`});
            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response.data.message);
                throw new Error(response.data.message);
            }
            
            toast.dismiss(id);
            toast.success(response?.data?.message);
            return true;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to Attach Fee Receipt";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log("Error",e);
            return false;
        }
    }
}