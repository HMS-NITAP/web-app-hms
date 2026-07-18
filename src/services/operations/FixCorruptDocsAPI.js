import { APIconnector } from "../APIconnector";
import { fixCorruptDocsEndPoints } from "../APIs";

const { FIX_DOC_LOGIN_API, FIX_DOC_UPLOAD_API } = fixCorruptDocsEndPoints;

export const fixDocLogin = async (email, password, toast) => {
    const id = toast("Please Wait...");
    try {
        const response = await APIconnector("POST", FIX_DOC_LOGIN_API, { email, password });
        if (!response?.data?.success) {
            toast.dismiss(id);
            toast.error(response?.data?.message);
            return null;
        }
        toast.dismiss(id);
        toast.success(response?.data?.message);
        return { token: response?.data?.token, student: response?.data?.student };
    } catch (e) {
        const errorMessage = e?.response?.data?.message || "Verification Failed";
        toast.dismiss(id);
        toast.error(errorMessage);
        return null;
    }
};

export const fixDocUpload = async (formData, token, toast) => {
    const id = toast("Please Wait...");
    try {
        const response = await APIconnector("POST", FIX_DOC_UPLOAD_API, formData, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        });
        if (!response?.data?.success) {
            toast.dismiss(id);
            toast.error(response?.data?.message);
            return false;
        }
        toast.dismiss(id);
        toast.success(response?.data?.message);
        return true;
    } catch (e) {
        const errorMessage = e?.response?.data?.message || "Upload Failed";
        toast.dismiss(id);
        toast.error(errorMessage);
        return false;
    }
};
