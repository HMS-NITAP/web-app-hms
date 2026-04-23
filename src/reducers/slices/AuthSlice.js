import {createSlice} from '@reduxjs/toolkit'

const getStoredToken = () => {
    const storedToken = localStorage.getItem("token");

    if(!storedToken){
        return null;
    }

    try{
        return JSON.parse(storedToken);
    }catch{
        return storedToken;
    }
}

const initialState = {
    token:getStoredToken(),
    signUpData : null,
    registrationData : null,
    registrationStep : 1,
}


const AuthSlice = createSlice({
    name : "Auth",
    initialState : initialState,
    reducers : {
        setToken(state,value){
            state.token = value.payload
        },
        setSignUpData(state,value){
            state.signUpData = value.payload
        },
        setRegistrationData(state,value){
            state.registrationData = value.payload
        },
        setRegistrationStep(state,value){
            state.registrationStep = value.payload
        }
    }
})

export const {setToken,setSignUpData,setRegistrationData,setRegistrationStep} = AuthSlice.actions;
export default AuthSlice.reducer;
