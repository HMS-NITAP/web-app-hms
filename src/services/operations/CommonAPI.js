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
        let id = toast("Please Wait...");
        try{
            const response = await APIconnector("GET",GET_ALL_ANNOUNCEMENTS_API,null);
            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response?.data?.message);
                throw new Error(response.data.message);
            }
            toast.dismiss(id);
            toast.success("Fetched all Announcements Successfully");
            return (response?.data?.data);            
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Fetched all Announcements Successfully";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log(e);
            return [];
        }
    }
}

export const fetchHostelData = (toast) => {
    return async () => {
        let id = toast("Please wait...");
        try {
            const response = await APIconnector("GET", FETCH_ALL_HOSTEL_DATA_API);
    
            if (!response.data.success) {
                toast.dismiss(id);
                toast.error(response?.data?.message);
                throw new Error(response.data.message);
            }
    
            toast.dismiss(id);
            toast.success(response?.data?.message);
            return response?.data?.data;
        } catch (e) {
            const errorMessage = e?.response?.data?.message || "Failed to Fetch Hostel Data";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log("Error", e);
            return null;
        }
    };
  };

export const fetchHostelBlockNames = (toast) => {
    return async() => {
        let id = toast("Please Wait...");
        try{ 
            const response = await APIconnector("GET",FETCH_HOSTEL_BLOCKS_NAME);
            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response?.data?.message);
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            toast.success(response?.data?.message);
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Hostel Blocks";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log(e);
            return null;
        }
    }
}

export const fetchHostelBlockRooms = (hostelBlockId,toast) => {
    return async() => {
        let id = toast("Please Wait...");
        try{ 
            const response = await APIconnector("POST",FETCH_HOSTEL_BLOCKS_ROOMS,{hostelBlockId});
            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response?.data?.message);
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            toast.success(response?.data?.message);
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Hostel Block Rooms";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log("Erroiror",e);
            return null;
        }
    }
}

export const fetchCurrentDateRatingsAndReviews = (toast) => {
    return async() => {
        let id = toast("Please Wait...");
        try{ 
            const response = await APIconnector("GET",FETCH_CURRENT_DATE_MESS_RATING_AND_REVIEW,);
            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response?.data?.message);
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            toast.success(response?.data?.message);
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Hostel Block Rooms";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log("Error",e);
            return null;
        }
    }
}

export const fetchCurrentSessionMessMenu = (currentDay, currentSession, toast) => {
    return async() => {
        let id = toast("Please Wait...");
        try{ 
            const response = await APIconnector("POST",FETCH_CURRENT_SESSION_MESS_MENU_API,{currentDay, currentSession});
            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response?.data?.message);
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            // toast.success(response?.data?.message);
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Mess Menu For Current Session";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log("Error",errorMessage);
            return null;
        }
    }
}

export const fetchDetailedMessMenu = (toast) => {
    return async() => {
        let id = toast("Please Wait...");
        try{ 
            const response = await APIconnector("GET",FETCH_DETAILED_MESS_MENU_API);
            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response?.data?.message);
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            // toast.success(response?.data?.message);
            return response?.data?.data;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to fetch Mess Menu";
            toast.dismiss(id);
            toast.error(errorMessage);
            console.log("Error",errorMessage);
            return null;
        }
    }
}