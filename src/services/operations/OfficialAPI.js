import { APIconnector } from "../APIconnector";
import { officialEndPoints } from "../APIs";

const {FETCH_DASHBOARD_DATA_API,
    CREATE_ANNOUNCEMENT_API,
    GET_PENDING_OUTING_APPLICATION_BY_WARDEN_BLOCK_API,
    GET_COMPLETED_OUTING_APPLICATION_BY_WARDEN_BLOCK_API,
    GET_INPROGRESS_OUTING_APPLICATION_BY_WARDEN_BLOCK_API,
    GET_RETURNED_OUTING_APPLICATION_BY_WARDEN_BLOCK_API,
    ACCEPT_PENDING_OUTING_APPLICATION_API,
    REJECT_PENDING_OUTING_APPLICATION_API,
    MARK_COMPLETD_OUTING_WITHOUT_DELAY_API,
    MARK_COMPLETD_OUTING_WITH_DELAY_API,
    GET_ALL_UNRESOLVED_COMPLAINTS_BY_HOSTEL_BLOCK_API,
    GET_ALL_RESOLVED_COMPLAINTS_BY_HOSTEL_BLOCK_API,
    RESOLVE_HOSTEL_COMPLAINT_API,
    UNRESOLVE_HOSTEL_COMPLAINT_API,
    MARK_STUDENT_PRESENT_API,
    MARK_STUDENT_ABSENT_API,
    UNMARK_STUDENT_PRESENT_API,
    UNMARK_STUDENT_ABSENT_API,
    FETCH_ATTENDANCE_DATA_IN_HOSTEL_BLOCK,
} = officialEndPoints;

export const fetchDashboardData = (token,toast) => {
    return async() => {
        let id = toast.show("Fetching Data...",{type: "normal"});
        try{        
            const response = await APIconnector("GET",FETCH_DASHBOARD_DATA_API,null,{Authorization: `Bearer ${token}`});

            if(!response.data.success){
                toast.hide(id);
                throw new Error(response.data.message);
            }

            toast.hide(id);
            toast.show(response.data.message,{type: "success"});
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to Fetch Dashbaord Data";
            toast.hide(id);
            toast.show(errorMessage, {type: "danger"});
            console.log(e);
            return null;
        }
    }
}

export const createAnnouncement = (formData,token,toast) => {
    return async() => {
        let id = toast.show("Creating announcement...",{type: "normal"});
        try{        
            const response = await APIconnector("POST",CREATE_ANNOUNCEMENT_API,formData,{"Content-Type": "multipart/form-data",Authorization: `Bearer ${token}`});

            if(!response.data.success){
                toast.hide(id);
                throw new Error(response.data.message);
            }

            toast.hide(id);
            toast.show("Announcement created Successfully",{type: "success"});
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Announcement creation failed";
            toast.hide(id);
            toast.show(errorMessage, {type: "danger"});
            console.log(e);
        }
    }
}

export const getAllPendingApplicationByHostelBlock = (token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            const response = await APIconnector("GET",GET_PENDING_OUTING_APPLICATION_BY_WARDEN_BLOCK_API,null,{Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show("Fetched Applications Successfully",{type:"success"});
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Applications";
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return null;
        }
    }
}

export const getAllCompletedApplicationByHostelBlock = (token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            const response = await APIconnector("GET",GET_COMPLETED_OUTING_APPLICATION_BY_WARDEN_BLOCK_API,null,{Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show("Fetched Applications Successfully",{type:"success"});
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Applications";
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return null;
        }
    }
}

export const getAllInprogressApplicationByHostelBlock = (token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            const response = await APIconnector("GET",GET_INPROGRESS_OUTING_APPLICATION_BY_WARDEN_BLOCK_API,null,{Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show("Fetched Applications Successfully",{type:"success"});
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Applications";
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return null;
        }
    }
}

export const getAllReturnedApplicationByHostelBlock = (token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            const response = await APIconnector("GET",GET_RETURNED_OUTING_APPLICATION_BY_WARDEN_BLOCK_API,null,{Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show("Fetched Applications Successfully",{type:"success"});
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Applications";
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return null;
        }
    }
}

export const acceptPendingOutingApplication = (applicationId,token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            const response = await APIconnector("PUT",ACCEPT_PENDING_OUTING_APPLICATION_API,{applicationId},{Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show(response?.data?.message,{type:"success"});
            return true;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to Accept Application";
            console.log(e);
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return false;
        }
    }
}

export const rejectPendingOutingApplication = (formData,token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            const response = await APIconnector("PUT",REJECT_PENDING_OUTING_APPLICATION_API,formData,{"Content-Type": "multipart/form-data",Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show(response?.data?.message,{type:"success"});
            return true;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to reject Application";
            console.log(e);
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return false;
        }
    }
}

export const markCompletedWithoutDelayOutingApplication = (applicationId,token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            const response = await APIconnector("PUT",MARK_COMPLETD_OUTING_WITHOUT_DELAY_API,{applicationId},{Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show(response?.data?.message,{type:"success"});
            return true;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to mark completed";
            console.log(e);
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return false;
        }
    }
}

export const markCompletedWithDelayOutingApplication = (formData,token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            console.log("HERE");
            const response = await APIconnector("PUT",MARK_COMPLETD_OUTING_WITH_DELAY_API,formData,{"Content-Type": "multipart/form-data",Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show(response?.data?.message,{type:"success"});
            return true;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to mark completed";
            console.log(e);
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return false;
        }
    }
}

export const getAllUnresolvedHostelComplaints = (token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            const response = await APIconnector("GET",GET_ALL_UNRESOLVED_COMPLAINTS_BY_HOSTEL_BLOCK_API,null,{Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show("Fetched All Unresolved issues Successfully",{type:"success"});
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Unresolved Issues";
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return null;
        }
    }
}

export const getAllResolvedHostelComplaints = (token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            const response = await APIconnector("GET",GET_ALL_RESOLVED_COMPLAINTS_BY_HOSTEL_BLOCK_API,null,{Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show("Fetched All resolved issues Successfully",{type:"success"});
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch resolved Issues";
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return null;
        }
    }
}

export const resolveHostelComplaint = (complaintId,token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            const response = await APIconnector("PUT",RESOLVE_HOSTEL_COMPLAINT_API,{complaintId},{Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show("Resolved Complaint Successfully",{type:"success"});
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to resolve complaint";
            console.log(e);
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return null;
        }
    }
}

export const unResolveHostelComplaint = (complaintId,token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            const response = await APIconnector("PUT",UNRESOLVE_HOSTEL_COMPLAINT_API,{complaintId},{Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show("Unresolved Complaint Successfully",{type:"success"});
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to unresolve complaint";
            console.log(e);
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return null;
        }
    }
}

export const markStudentPresent = (presentDate,attendenceRecordId,token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            const response = await APIconnector("PUT",MARK_STUDENT_PRESENT_API,{presentDate,attendenceRecordId},{Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show(response?.data?.message,{type:"success"});
            return true;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to mark present";
            console.log(e);
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return false;
        }
    }
}

export const markStudentAbsent = (absentDate,attendenceRecordId,token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            const response = await APIconnector("PUT",MARK_STUDENT_ABSENT_API,{absentDate,attendenceRecordId},{Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show(response?.data?.message,{type:"success"});
            return true;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to mark absent";
            console.log(e);
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return false;
        }
    }
}

export const unmarkStudentPresent = (presentDate,attendenceRecordId,token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            const response = await APIconnector("PUT",UNMARK_STUDENT_PRESENT_API,{presentDate,attendenceRecordId},{Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show(response?.data?.message,{type:"success"});
            return true;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to unmark present";
            console.log(e);
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return false;
        }
    }
}

export const unmarkStudentAbsent = (absentDate,attendenceRecordId,token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            const response = await APIconnector("PUT",UNMARK_STUDENT_ABSENT_API,{absentDate,attendenceRecordId},{Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show(response?.data?.message,{type:"success"});
            return true;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to unmark absent";
            console.log(e);
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return false;
        }
    }
}

export const fetchHostelBlockRoomsForAttendance = (token,toast) => {
    return async() => {
        let id = toast.show("Please Wait...",{type:"normal"});
        try{    
            const response = await APIconnector("GET",FETCH_ATTENDANCE_DATA_IN_HOSTEL_BLOCK,null,{Authorization: `Bearer ${token}`});
            if(!response?.data?.success){
                toast.hide(id);
                toast.show(response?.data?.message,{type:"danger"});
                throw new Error(response?.data?.message);
            }

            toast.hide(id);
            toast.show(response?.data?.message,{type:"success"});
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Data";
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            return null;
        }
    }
}