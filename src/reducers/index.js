import {combineReducers} from '@reduxjs/toolkit';
import AuthReducer from "./slices/AuthSlice";
import ProfileSlice from './slices/ProfileSlice';

const rootReducer = combineReducers({
    Auth : AuthReducer,
    Profile : ProfileSlice,
})

export default rootReducer;