import { setToken } from "../../reducer/slices/AuthSlice";
import { setUser } from "../../reducer/slices/ProfileSlice";
import { APIconnector } from "../APIconnector";
import { authEndPoints } from "../APIs";
import localStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const {SENDOTP_API,SIGNUP_API,LOGIN_API,RESET_PASSWORD_TOKEN,RESET_PASSWORD,VERIFY_OTP,CREATE_STUDENT_ACCOUNT_API} = authEndPoints;

export const sendOTP = (email,navigation,toast) => {
    return async() => {
        try{ 
            const response = await APIconnector("POST",SENDOTP_API,{email});
            if(!response.data.success){
                toast.error(response.data.message);
                throw new Error(response.data.message);
            }
            toast.success("OTP Sent Successfully");
            navigation.navigate("OtpInput");
        }catch(e){
            const errorMessage = e?.response?.data?.message || "OTP generation Unsuccessful";
            toast.show(errorMessage);
            console.log(e);
        }
    }
}

export const signUp = (data,otp,navigation,toast) => {
    return async() => {
        let id = toast("Creating your Account...");
        try{
            let id = toast.show("Creating your Account...");
            const {email,password,confirmPassword,accountType} = data;
            const response = await APIconnector("POST",SIGNUP_API,{email,password,confirmPassword,accountType,otp});
            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response.data.message);
                throw new Error(response.data.message);
            }
            toast.dismiss(id);
            toast.show("Account created Successfully");
            navigation.navigate("Login");
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Signup Unsuccessful";
            toast.dismiss(id);
            toast.show(errorMessage);
            console.log(e);
        }
    }
}

export const login = (email,password,toast) => {
    return async(dispatch) => {
        let id = toast.show("Please Wait...", {type:"normal"});
        try{
            const response = await APIconnector("POST",LOGIN_API,{email,password});

            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response.data.message);
                throw new Error(response.data.message);
            }

            await dispatch(setToken(response?.data?.token));
            await localStorage.setItem("token",JSON.stringify(response.data.token));
            await localStorage.setItem("user",JSON.stringify(response?.data?.user));
            await dispatch(setUser(response?.data?.user));

            toast.dismiss(id);
            toast.show("Login Successful");
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Login Failed";
            toast.dismiss(id);
            toast.show(errorMessage);
        }
    }
}

export const sendResetPasswordEmail = (email,navigation,toast) => {
    return async() => {
        let id = toast.show("Please Wait...", {type:"normal"});
        try{
            const response = await APIconnector("POST",RESET_PASSWORD_TOKEN,{email});

            if(!response?.data?.success){
                toast.dismiss(id);
                toast.error(response.data.message);
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            toast.show(response?.data?.message, { type: "success" });
            navigation.navigate("Reset Password Email Sent");
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to send mail";
            toast.dismiss(id);
            toast.show(errorMessage);
            console.log(e);
        }
    }
}

export const resetPassword = (token,newPassword,confirmNewPassword,navigation,toast) => {
    return async() => {
        let id = toast.show("Please Wait...", {type:"normal"});
        try{
            const response = await APIconnector("POST",RESET_PASSWORD,{token,newPassword,confirmNewPassword});

            if(!response?.data?.success){
                toast.dismiss(id);
                toast.error(response.data.message);
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            toast.show(response?.data?.message, { type: "success" });
            navigation.navigate("Reset Password Success");
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to reset password";
            toast.dismiss(id);
            toast.show(errorMessage);
            console.log(e);
        }
    }
}

export const logout = (toast) => {
    return async(dispatch) => {
        try{
            await dispatch(setToken(null));
            await dispatch(setUser(null));
            await localStorage.removeItem("token");
            await localStorage.removeItem("user");
            toast.show("Successfully Logged Out from Account");
        }catch(e){
            toast.show("Logout Unsuccessful");
            console.log("Logout modal Error",e);
        }
    }
}

export const sendOtpToStudent = (email,toast) => {
    return async() => {
        let id = toast.show("Please Wait...", {type:'normal'});
        try{ 
            const response = await APIconnector("POST",SENDOTP_API,{email});
            if(!response.data.success){
                toast.dismiss(id);
                toast.show(response?.data?.message, { type: "danger" });
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            toast.show(response?.data?.message, { type: "success" });
            return true;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to Send OTP to Student";
            toast.dismiss(id);
            toast.show(errorMessage);
            console.log(e);
            return false;
        }
    }
}

export const verifyOtp = (formData,toast) => {
    return async() => {
        let id = toast.show("Please Wait...", {type:'normal'});
        try{ 
            const response = await APIconnector("POST",VERIFY_OTP,formData,{"Content-Type": "multipart/form-data"});
            if(!response.data.success){
                toast.dismiss(id);
                toast.show(response?.data?.message, { type: "danger" });
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            toast.show(response?.data?.message, { type: "success" });
            return true;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Invalid OTP";
            toast.dismiss(id);
            toast.show(errorMessage);
            console.log("Error",e);
            return false;
        }
    }
}

export const createStudentAccount = (formData,toast) => {
    return async() => {
        let id = toast.show("Please Wait...", {type:'normal'});
        try{ 
            const response = await APIconnector("POST",CREATE_STUDENT_ACCOUNT_API,formData,{"Content-Type": "multipart/form-data"});
            if(!response.data.success){
                toast.dismiss(id);
                toast.show(response?.data?.message, { type: "danger" });
                throw new Error(response.data.message);
            }

            toast.dismiss(id);
            toast.show(response?.data?.message, { type: "success" });
            return true;
        }catch(e){
            const errorMessage = e?.response?.data?.message || "Unable to Complete Registration";
            toast.dismiss(id);
            toast.show(errorMessage);
            console.log("Error",e);
            return false;
        }
    }
}