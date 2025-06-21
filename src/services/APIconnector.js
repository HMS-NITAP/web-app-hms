import axios from "axios";

export const axiosinstance = axios.create({});

export const APIconnector = (method,url,bodyData,headers,params) => {
    return axiosinstance({
        method:`${method}`,
        url:`${url}`,
        data:bodyData ? bodyData : null,
        headers:headers? headers:null,
        params:params ? params : null
    });
}