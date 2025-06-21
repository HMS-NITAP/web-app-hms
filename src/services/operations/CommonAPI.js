import { APIconnector } from "../APIconnector";
import { commonEndPoints } from "../APIs";

const {
    GET_ALL_ANNOUNCEMENTS_API,
    FETCH_ALL_HOSTEL_DATA_API,
    FETCH_HOSTEL_BLOCKS_NAME,
    FETCH_HOSTEL_BLOCKS_ROOMS,
    FETCH_CURRENT_DATE_MESS_RATING_AND_REVIEW,
    FETCH_CURRENT_SESSION_MESS_MENU_API,
    FETCH_DETAILED_MESS_MENU_API,
} = commonEndPoints;

export const getAllAnnouncements = (toast) => {
    return async() => {
        let id = toast.show("Please Wait...", {type:'normal'});
        try{
            const response = await APIconnector("GET",GET_ALL_ANNOUNCEMENTS_API,null);
            if(!response.data.success){
                toast.hide(id);
                throw new Error(response.data.message);
            }
            toast.hide(id);
            toast.show("Fetched all Announcements Successfully",{type:"success"});
            console.log("fdsf",response?.data?.data);
            return (response?.data?.data);            
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Fetched all Announcements Successfully";
            toast.hide(id);
            toast.show(errorMessage,{type:"danger"});
            console.log(e);
            return [];
        }
    }
}

export const fetchHostelData = (toast) => {
    return async () => {
        let id = toast.show("Fetching Data...", {type:'normal'});
        try {
            const response = await APIconnector("GET", FETCH_ALL_HOSTEL_DATA_API);
    
            if (!response.data.success) {
            toast.hide(id);
            toast.show(response?.data?.message, { type: "danger" });
            throw new Error(response.data.message);
            }
    
            toast.hide(id);
            toast.show(response?.data?.message, { type: "success" });
            return response?.data?.data;
        } catch (e) {
            const errorMessage = e?.response?.data?.message || "Failed to Fetch Hostel Data";
            toast.hide(id);
            toast.show(errorMessage, { type: "danger" });
            console.log("Error", e);
            return null;
        }
    };
  };

export const fetchHostelBlockNames = (toast) => {
    return async() => {
        let id = toast.show("Please Wait...", {type:'normal'});
        try{ 
            const response = await APIconnector("GET",FETCH_HOSTEL_BLOCKS_NAME);
            if(!response.data.success){
                toast.hide(id);
                toast.show(response?.data?.message, { type: "danger" });
                throw new Error(response.data.message);
            }

            toast.hide(id);
            toast.show(response?.data?.message, { type: "success" });
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Hostel Blocks";
            toast.hide(id);
            toast.show(errorMessage, {type: "danger"});
            console.log(e);
            return null;
        }
    }
}

export const fetchHostelBlockRooms = (hostelBlockId,toast) => {
    return async() => {
        let id = toast.show("Please Wait...", {type:'normal'});
        try{ 
            const response = await APIconnector("POST",FETCH_HOSTEL_BLOCKS_ROOMS,{hostelBlockId});
            if(!response.data.success){
                toast.hide(id);
                toast.show(response?.data?.message, { type: "danger" });
                throw new Error(response.data.message);
            }

            toast.hide(id);
            toast.show(response?.data?.message, { type: "success" });
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Hostel Block Rooms";
            toast.hide(id);
            toast.show(errorMessage, {type: "danger"});
            console.log("Erroiror",e);
            return null;
        }
    }
}

export const fetchCurrentDateRatingsAndReviews = (toast) => {
    return async() => {
        let id = toast.show("Please Wait...", {type:'normal'});
        try{ 
            const response = await APIconnector("GET",FETCH_CURRENT_DATE_MESS_RATING_AND_REVIEW,);
            if(!response.data.success){
                toast.hide(id);
                toast.show(response?.data?.message, { type: "danger" });
                throw new Error(response.data.message);
            }

            toast.hide(id);
            toast.show(response?.data?.message, { type: "success" });
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Hostel Block Rooms";
            toast.hide(id);
            toast.show(errorMessage, {type: "danger"});
            console.log("Error",e);
            return null;
        }
    }
}

export const fetchCurrentSessionMessMenu = (currentDay, currentSession, toast) => {
    return async() => {
        let id = toast.show("Please Wait...", {type:'normal'});
        try{ 
            const response = await APIconnector("POST",FETCH_CURRENT_SESSION_MESS_MENU_API,{currentDay, currentSession});
            if(!response.data.success){
                toast.hide(id);
                toast.show(response?.data?.message, { type: "danger" });
                throw new Error(response.data.message);
            }

            toast.hide(id);
            // toast.show(response?.data?.message, { type: "success" });
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Mess Menu For Current Session";
            toast.hide(id);
            toast.show(errorMessage, {type: "danger"});
            console.log("Error",errorMessage);
            return null;
        }
    }
}

export const fetchDetailedMessMenu = (toast) => {
    return async() => {
        let id = toast.show("Please Wait...", {type:'normal'});
        try{ 
            const response = await APIconnector("GET",FETCH_DETAILED_MESS_MENU_API);
            console.log("Res", response.data.success);
            if(!response.data.success){
                toast.hide(id);
                toast.show(response?.data?.message, { type: "danger" });
                throw new Error(response.data.message);
            }

            toast.hide(id);
            // toast.show(response?.data?.message, { type: "success" });
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Mess Menu";
            toast.hide(id);
            toast.show(errorMessage, {type: "danger"});
            console.log("Error",errorMessage);
            return null;
        }
    }
}