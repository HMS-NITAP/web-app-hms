import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, TouchableOpacity, Linking } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import { getAllResolvedHostelComplaints, getAllUnresolvedHostelComplaints, resolveHostelComplaint, unResolveHostelComplaint } from '../../services/operations/OfficialAPI';
import MainButton from '../../components/common/MainButton';
import { useToast } from 'react-native-toast-notifications';

const HostelComplaints = () => {

    const [complaintStatus, setComplaintStatus] = useState("UNRESOLVED");
    const [registeredComplaints,setRegisteredComplaints] = useState([]);

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const dispatch = useDispatch();

    const {token} = useSelector((state) => state.Auth);
    const toast = useToast();

    const fetchRegisteredComplaints = async () => {
        setRegisteredComplaints(null);
        let data;
        if(complaintStatus === "UNRESOLVED"){
            data = await dispatch(getAllUnresolvedHostelComplaints(token,toast));
        }else{
            data = await dispatch(getAllResolvedHostelComplaints(token,toast));
        }
        setRegisteredComplaints(data);
    }

    useEffect(() => {
        fetchRegisteredComplaints();
    },[complaintStatus]);

    const resolveHandler = async (complaintId) => {
        setIsButtonDisabled(true);
        await dispatch(resolveHostelComplaint(complaintId,token,toast));
        fetchRegisteredComplaints();
        setIsButtonDisabled(false);
    }

    const unresolveHandler = async (complaintId) => {
        setIsButtonDisabled(true);
        await dispatch(unResolveHostelComplaint(complaintId,token,toast));
        fetchRegisteredComplaints();
        setIsButtonDisabled(false);
    }

    const getDateFormat = (date) => {
        const newDate = new Date(date);
        return newDate.toLocaleString();
    }

  return (
    <ScrollView contentContainerStyle={{width:"100%", paddingHorizontal:10,paddingVertical:10,justifyContent:'start',alignItems:"center",gap:15}}>
        <View style={{width:"100%", marginHorizontal:"auto", display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", overflow:'hidden', borderWidth:1, borderColor:"black", borderRadius:10}}>
            <TouchableOpacity disabled={isButtonDisabled} style={{width:"50%", textAlign:"center", paddingVertical:8, backgroundColor:complaintStatus==="UNRESOLVED" ? "#ffb703" : "white", opacity:isButtonDisabled?0.5:1}} onPress={() => setComplaintStatus("UNRESOLVED")}><Text style={{textAlign:'center', width:"100%", color:"black"}}>In Review</Text></TouchableOpacity>
            <TouchableOpacity disabled={isButtonDisabled} style={{width:"50%", textAlign:"center", paddingVertical:8, backgroundColor:complaintStatus==="RESOLVED" ? "#ffb703" : "white", opacity:isButtonDisabled?0.5:1}} onPress={() => setComplaintStatus("RESOLVED")}><Text style={{textAlign:'center', width:"100%", color:"black"}}>Resolved</Text></TouchableOpacity>
        </View>
        {
            registeredComplaints  && complaintStatus==="UNRESOLVED" && 
                <View style={{width:"100%", display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", paddingHorizontal:15, paddingVertical:15}}>
                    <View style={{display:"flex",flexDirection:"row",gap:15,justifyContent:"center",alignItems:"center"}}>
                        <Text style={{fontWeight:"600",color:"black",fontSize:16}}>Complaints In Review</Text>
                        <Text style={{paddingVertical:5, paddingHorizontal:10, backgroundColor:"#9c89b8", color:"white", fontWeight:"800", borderRadius:100}}>{registeredComplaints?.length}</Text>
                    </View>
                </View>
        }
        {
            registeredComplaints && registeredComplaints.map((complaint) => {
                    return (
                        <View key={complaint?.id} style={{width:"100%",padding: 16,marginVertical: 8,backgroundColor: '#f9f9f9',borderRadius: 8,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,shadowRadius: 8,elevation: 2,width: '90%'}}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                Created On: <Text style={{ fontWeight: 'normal', color: '#666' }}>{getDateFormat(complaint.createdAt)}</Text>
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                Student Name: <Text style={{ fontWeight: 'normal', color: '#666' }}>{complaint.instituteStudent.name}</Text>
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                Student Room No: <Text style={{ fontWeight: 'normal', color: '#666' }}>room - {complaint?.instituteStudent?.cot?.room?.roomNumber}, Cot - {complaint?.instituteStudent?.cot?.cotNo}</Text>
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                Category: <Text style={{ fontWeight: 'normal', color: '#666' }}>{complaint.category}</Text>
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                About: <Text style={{ fontWeight: 'normal', color: '#666' }}>{complaint.about}</Text>
                            </Text>
                            {
                                complaint?.fileUrl[0] && 
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>Attachments : <Text style={{ fontWeight: 'normal', color: 'blue' }} onPress={() => Linking.openURL(complaint?.fileUrl[0])}>Click Here to See</Text></Text>
                            }
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                Status: <Text style={{ fontWeight: '800', color: complaint?.status==="UNRESOLVED" ? "orange"  : "green"}}>{complaint.status==="RESOLVED" ? "RESOLVED" : "IN REVIEW"}</Text>
                            </Text>
                            {
                                complaint?.resolvedBy && <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>Resolved By: <Text style={{ fontWeight: 'normal', color: '#666' }}>{complaint?.resolvedBy?.name} ({complaint?.resolvedBy?.designation})</Text></Text>
                            }
                            {
                                complaint?.resolvedOn && <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>Resolved On: <Text style={{ fontWeight: 'normal', color: '#666' }}>{getDateFormat(complaint?.resolvedOn)}</Text></Text>
                            }
                            {
                                complaint?.status==='UNRESOLVED' ? (
                                    <View style={{display:"flex", marginVertical:10, flexDirection:"row", justifyContent:"space-evenly", alignItems:"center"}}>
                                        <MainButton isButtonDisabled={isButtonDisabled} text="Resolve Complaint" backgroundColor={"#99d98c"} onPress={() => resolveHandler(complaint?.id)} />
                                    </View>
                                ) : (
                                    <View style={{display:"flex", marginVertical:10, flexDirection:"row", justifyContent:"space-evenly", alignItems:"center"}}>
                                        <MainButton isButtonDisabled={isButtonDisabled} text="Move to In Review" backgroundColor={"#f27059"} onPress={() => unresolveHandler(complaint?.id)} />
                                    </View>
                                )
                            }
                            {

                            }
                        </View>
                    )
                })
            
        }
    </ScrollView>
  )
}

export default HostelComplaints