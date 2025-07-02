import { USER_ROLES } from "../../config/config";
import { setToken } from "../../reducers/slices/AuthSlice";
import { setUser } from "../../reducers/slices/ProfileSlice";
import { APIconnector } from "../APIconnector";
import { authEndPoints } from "../APIs";

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
            toast.error(errorMessage);
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

export const login = (email,password,toast,navigate) => {
    return async(dispatch) => {
        let id = toast("Please Wait...");
        try{
            const response = await APIconnector("POST",LOGIN_API,{email,password});

            console.log("RESPONSE", response?.data);
            if(!response.data.success){
                toast.dismiss(id);
                toast.error(response.data.message);
                throw new Error(response.data.message);
            }

            localStorage.setItem("token",JSON.stringify(response.data.token));
            localStorage.setItem("user",JSON.stringify(response?.data?.user));
            dispatch(setToken(response?.data?.token));
            dispatch(setUser(response?.data?.user));

            console.log(response?.data?.user?.accountType, response?.data?.user?.accountType === USER_ROLES.OFFICIAL);

            if(response?.data?.user?.accountType === USER_ROLES.STUDENT){
                navigate('/student/dashboard');
            }else if(response?.data?.user?.accountType === USER_ROLES.OFFICIAL){
                console.log("FDFDGFG");
                navigate('/official/dashboard');
            }else if(response?.data?.user?.accountType === USER_ROLES.ADMIN){
                navigate('/admin/dashboard');
            }

            toast.dismiss(id);
            toast.success("Login Successful");
        }catch(e){
            console.log("e", e);
            const errorMessage = e?.response?.data?.message || "Login Failed";
            toast.dismiss(id);
            toast.error(errorMessage);
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

export const logout = (toast, navigate) => {
    return async(dispatch) => {
        try{
            await dispatch(setToken(null));
            await dispatch(setUser(null));
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.success("Successfully Logged Out from Account");
            navigate("/");
        }catch(e){
            toast.error("Logout Unsuccessful");
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