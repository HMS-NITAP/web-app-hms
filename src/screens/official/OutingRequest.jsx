import React, { useCallback, useState } from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import { getAllPendingApplicationByHostelBlock, rejectPendingOutingApplication, approvePendingOutingApplication, getAllInprogressApplicationByHostelBlock, getAllCompletedApplicationByHostelBlock, getAllReturnedApplicationByHostelBlock } from '../../services/operations/OfficialAPI';
import MainButton from '../../components/common/MainButton';
import { useToast } from 'react-native-toast-notifications';
import { useFocusEffect } from '@react-navigation/native';
import OutingRequestCard from '../../components/official/OutingRequestCard';

const OutingRequest = () => {

    const [applicationType, setApplicationType] = useState("PENDING");
    const [outingApplication,setOutingApplication] = useState([]);
    const dispatch = useDispatch();

    const {token} = useSelector((state) => state.Auth);
    const toast = useToast();

    const fetchOutingRequest = async() => {
        setOutingApplication(null);
        let data;
        if(applicationType === "PENDING"){
            data = await dispatch(getAllPendingApplicationByHostelBlock(token,toast));
        }else if(applicationType === "INPROGRESS"){
            data = await dispatch(getAllInprogressApplicationByHostelBlock(token,toast));
        }else if(applicationType === "COMPLETED"){
            data = await dispatch(getAllCompletedApplicationByHostelBlock(token,toast));
        }else if(applicationType === "RETURNED"){
            data = await dispatch(getAllReturnedApplicationByHostelBlock(token,toast));
        }
        setOutingApplication(data);
    }

    useFocusEffect(
        useCallback(() => {
          fetchOutingRequest();
        }, [token, toast, applicationType])
    );

  return (
    <ScrollView contentContainerStyle={{width:"100%",display:"flex",justifyContent:"center", alignItems:"center", paddingHorizontal:15, paddingVertical:20,gap:20}}>
        <View style={{width:"100%", marginHorizontal:"auto", display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", overflow:'hidden', borderWidth:1, borderColor:"black", borderRadius:10}}>
            <TouchableOpacity style={{width:"25%", textAlign:"center", paddingVertical:8, backgroundColor:applicationType==="PENDING" ? "#ffb703" : "white",}} onPress={() => setApplicationType("PENDING")}><Text style={{textAlign:'center', width:"100%", color:"black"}}>Pending</Text></TouchableOpacity>
            <TouchableOpacity style={{width:"25%", textAlign:"center", paddingVertical:8, backgroundColor:applicationType==="INPROGRESS" ? "#ffb703" : "white",}} onPress={() => setApplicationType("INPROGRESS")}><Text style={{textAlign:'center', width:"100%", color:"black"}}>In Progress</Text></TouchableOpacity>
            <TouchableOpacity style={{width:"25%", textAlign:"center", paddingVertical:8, backgroundColor:applicationType==="RETURNED" ? "#ffb703" : "white",}} onPress={() => setApplicationType("RETURNED")}><Text style={{textAlign:'center', width:"100%", color:"black"}}>Returned</Text></TouchableOpacity>
            <TouchableOpacity style={{width:"25%", textAlign:"center", paddingVertical:8, backgroundColor:applicationType==="COMPLETED" ? "#ffb703" : "white",}} onPress={() => setApplicationType("COMPLETED")}><Text style={{textAlign:'center', width:"100%", color:"black"}}>Completed</Text></TouchableOpacity>
        </View>
        <View style={{width:"100%",display:"flex",justifyContent:"center", alignItems:"center", gap:10}}>
            {
                !outingApplication ? (<Text style={{fontWeight:"700", color:"black", fontSize:16}}>Please Wait...</Text>) : outingApplication.length===0 ? (<Text style={{fontWeight:"600", fontSize:16, color:"black"}}>No Applications Found</Text>) : (
                    outingApplication.map((application,index) => (
                        <OutingRequestCard key={index} application={application} toast={toast} token={token} fetchOutingRequest={fetchOutingRequest} />
                    ))
                )
            }
        </View>
    </ScrollView>
  )
}

export default OutingRequest