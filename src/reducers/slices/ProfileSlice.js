import {createSlice} from '@reduxjs/toolkit'

const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");

    if(!storedUser){
        return null;
    }

    try{
        return JSON.parse(storedUser);
    }catch{
        return null;
    }
}

const initialState = {
    user:getStoredUser(),
}

const ProfileSlice = createSlice({
    name : "Profile",
    initialState : initialState,
    reducers : {
        setUser(state,value){
            state.user = value.payload
        }
    }
})

export const {setUser} = ProfileSlice.actions;
export default ProfileSlice.reducer;
