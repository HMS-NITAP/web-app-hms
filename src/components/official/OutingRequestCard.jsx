import React, { useState } from 'react'
import { acceptPendingOutingApplication, approvePendingOutingApplication, markCompletedWithDelayOutingApplication, markCompletedWithoutDelayOutingApplication, rejectPendingOutingApplication } from '../../services/operations/OfficialAPI';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import MainButton from '../common/MainButton';
import { Modal } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

const OutingRequestCard = ({application,token,toast,fetchOutingRequest}) => {

    const { control, handleSubmit, reset, formState: { errors } } = useForm();

    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isReturnWithDelayModalOpen, setIsReturnWithDelayModalOpen] = useState(false);
    const [isReturnWithoutDelayModalOpen, setIsReturnWithoutDelayModalOpen] = useState(false);

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const dispatch = useDispatch();


    const getDateFormat = (date) => {
        const newDate = new Date(date);
        return newDate.toLocaleString();
    }

    const acceptPendingApplicationHandler = async () => {
        setIsButtonDisabled(true);
        const response = await dispatch(acceptPendingOutingApplication(application?.id,token,toast));
        if(response){
            fetchOutingRequest();
        }
        setIsAcceptModalOpen(false);
        setIsButtonDisabled(false);
    }

    const rejectPendingApplicationHandler = async(data) => {
        setIsButtonDisabled(true);
        const formData = new FormData();
        formData.append("applicationId",application?.id);
        formData.append("remarks",data?.remarks);
        const response = await dispatch(rejectPendingOutingApplication(formData,token,toast));
        if(response){
            fetchOutingRequest();
        }
        setIsRejectModalOpen(false);
        setIsButtonDisabled(false);
    }

    const markCompletedWithoutDelay = async () => {
        setIsButtonDisabled(true);
        const response = await dispatch(markCompletedWithoutDelayOutingApplication(application?.id,token,toast));
        if(response){
            fetchOutingRequest();
        }
        setIsReturnWithoutDelayModalOpen(false);
        setIsButtonDisabled(false);
    }

    const markCompletedWithDelay = async(data) => {
        setIsButtonDisabled(true);
        const formData = new FormData();
        formData.append("applicationId",application?.id);
        formData.append("remarks",data?.remarks);
        const response = await dispatch(markCompletedWithDelayOutingApplication(formData,token,toast));
        if(response){
            fetchOutingRequest();
        }
        setIsReturnWithDelayModalOpen(false);
        setIsButtonDisabled(false);
    }


  return (
    <View style={{ width: "100%", paddingHorizontal: 10, paddingVertical: 15, borderRadius: 10, borderColor: "black", borderWidth: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
            Created On: <Text style={{ fontWeight: 'normal', color: 'black' }}>{getDateFormat(application.createdAt)}</Text>
        </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
            Name: <Text style={{ fontWeight: 'normal', color: 'black' }}>{application?.instituteStudent?.name}</Text>
        </Text>
        <View style={{display:"flex", flexDirection:"row", marginBottom: 4, justifyContent:"flex-start", alignItems:"center", gap:15, flexWrap:"wrap"}}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                Room no: <Text style={{ fontWeight: 'normal', color: 'black' }}>{application?.instituteStudent?.cot?.room?.roomNumber}</Text>
            </Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                Cot no: <Text style={{ fontWeight: 'normal', color: 'black' }}>{application?.instituteStudent?.cot?.cotNo}</Text>
            </Text>
        </View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
            Reg No: <Text style={{ fontWeight: 'normal', color: 'black' }}>{application?.instituteStudent?.regNo}</Text>
        </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
            Roll No: <Text style={{ fontWeight: 'normal', color: 'black' }}>{application?.instituteStudent?.rollNo}</Text>
        </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
            From: <Text style={{ fontWeight: 'normal', color: 'black' }}>{getDateFormat(application.from)}</Text>
        </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
            To: <Text style={{ fontWeight: 'normal', color: 'black' }}>{getDateFormat(application.to)}</Text>
        </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
            Purpose: <Text style={{ fontWeight: 'normal', color: 'black' }}>{application.purpose}</Text>
        </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
            Place of Visit: <Text style={{ fontWeight: 'normal', color: 'black' }}>{application.placeOfVisit}</Text>
        </Text>
        {
            application?.status !== "PENDING" && (
                <>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>Verified By: <Text style={{ fontWeight: 'normal', color: 'black' }}>{application?.verifiedBy?.name} ({application?.verifiedBy?.designation})</Text></Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>Verified On: <Text style={{ fontWeight: 'normal', color: 'black' }}>{getDateFormat(application?.verifiedOn)}</Text></Text>
                </>
            )
        }
        {
            (application?.status === "RETURNED" || application?.status ==="COMPLETED") && (
                <>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>Returned On: <Text style={{ fontWeight: 'normal', color: 'black' }}>{getDateFormat(application?.returnedOn)}</Text></Text>
                    {
                        application?.remarks!==null && <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>Remarks: <Text style={{ fontWeight: 'normal', color: 'black' }}>{application?.remarks} (MARKED DELAYED)</Text></Text>
                    }
                </>
            )
        }
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
            Status: <Text style={{ fontWeight: '800', color: application?.status==="PENDING" ? "orange"  : application?.status==="INPROGRESS" ? "green" : application?.status==="COMPLETED" ? "green" : "red"}}>{application.status}</Text>
        </Text>
        {
            application?.status==="PENDING" && (
                <View style={{display:"flex", marginTop:10, flexDirection:"row", justifyContent:"space-evenly", alignItems:"center"}}>
                    <MainButton isButtonDisabled={isButtonDisabled} text="Accept" backgroundColor={"#99d98c"} onPress={() => setIsAcceptModalOpen(true)} />
                    <MainButton isButtonDisabled={isButtonDisabled} text="Reject" backgroundColor={"#f27059"} onPress={() => setIsRejectModalOpen(true)} />
                </View>
            )
        }
        {
            application?.status==="RETURNED" && (
                <View style={{display:"flex", marginTop:10, flexDirection:"column", justifyContent:"center", alignItems:"center", gap:10}}>
                    <MainButton isButtonDisabled={isButtonDisabled} text="Returned Without Delay" backgroundColor={"#99d98c"} onPress={() => setIsReturnWithoutDelayModalOpen(true)} />
                    <MainButton isButtonDisabled={isButtonDisabled} text="Returned With Delay" backgroundColor={"#f27059"} onPress={() => setIsReturnWithDelayModalOpen(true)} />
                </View>
            )
        }
        
        <>
            <Modal
                animationType="zoom"
                transparent={true}
                visible={isAcceptModalOpen}
                onRequestClose={() => {
                    setIsAcceptModalOpen(!isAcceptModalOpen);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, textAlign:"center", fontWeight: '500', marginBottom: 10, color:"black" }}>Are you sure, this application will be accepted.</Text>
                        <View style={{width : "100%", display:"flex", flexDirection: 'row', marginTop:15, justifyContent: 'space-evenly', alignItems:"center" }}>
                            <TouchableOpacity disabled={isButtonDisabled} onPress={acceptPendingApplicationHandler} style={{ padding: 10, backgroundColor: '#aacc00', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                <Text style={{ fontSize: 16, color: 'black', fontWeight:"600" }}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={isButtonDisabled} onPress={() => setIsAcceptModalOpen(false)} style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                <Text style={{ fontSize: 16, color:"black", fontWeight:"600" }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="zoom"
                transparent={true}
                visible={isReturnWithoutDelayModalOpen}
                onRequestClose={() => {
                    setIsReturnWithoutDelayModalOpen(!isReturnWithoutDelayModalOpen);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, textAlign:"center", fontWeight: '500', marginBottom: 10, color:"black" }}>Are you sure, this student has returned to hostel.</Text>
                        <View style={{width : "100%", display:"flex", flexDirection: 'row', marginTop:15, justifyContent: 'space-evenly', alignItems:"center" }}>
                            <TouchableOpacity disabled={isButtonDisabled} onPress={markCompletedWithoutDelay} style={{ padding: 10, backgroundColor: '#aacc00', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                <Text style={{ fontSize: 16, color: 'black', fontWeight:"600" }}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={isButtonDisabled} onPress={() => setIsReturnWithoutDelayModalOpen(false)} style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                <Text style={{ fontSize: 16, color:"black", fontWeight:"600" }}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isRejectModalOpen}
                onRequestClose={() => {
                    setIsRejectModalOpen(!isRejectModalOpen);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10,textAlign:"center", color:"black" }}>Are you sure, this Application will Rejected.</Text>
                        <Text style={{ fontSize: 14, color:"black", fontWeight: '400', marginBottom: 3 }}>Reason for Rejection</Text>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={{ padding: 10, paddingHorizontal: 10, borderWidth: 1, borderRadius: 10, borderColor: "#adb5bd", color:"black", }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Enter reason for rejection"
                                    numberOfLines={2}
                                    multiline
                                />
                            )}
                            name="remarks"
                            defaultValue=""
                        />
                        {errors.remarks && <Text style={{fontSize:14, color:"red"}}>Remarks is required.</Text>}
                        <View style={{width : "100%", display:"flex", flexDirection: 'row', marginTop:15, justifyContent: 'space-evenly', alignItems:"center" }}>
                            <TouchableOpacity disabled={isButtonDisabled} onPress={handleSubmit(rejectPendingApplicationHandler)} style={{ padding: 10, backgroundColor: '#c9184a', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                <Text style={{ fontSize: 16, color: 'white', fontWeight:"600" }}>Reject</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={isButtonDisabled} onPress={() => setIsRejectModalOpen(false)} style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                <Text style={{ fontSize: 16, color:"black", fontWeight:"600" }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isReturnWithDelayModalOpen}
                onRequestClose={() => {
                    setIsReturnWithDelayModalOpen(false);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10,textAlign:"center", color:"black" }}>Are you sure, this student has returned to hostel with delay.</Text>
                        <Text style={{ fontSize: 14, color:"black", fontWeight: '400', marginBottom: 3 }}>Reason for Delay</Text>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={{ padding: 10, paddingHorizontal: 10, borderWidth: 1, borderRadius: 10, borderColor: "#adb5bd", color:"black", }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Enter reason for delay"
                                    numberOfLines={2}
                                    multiline
                                />
                            )}
                            name="remarks"
                            defaultValue=""
                        />
                        {errors.remarks && <Text style={{fontSize:14, color:"red"}}>Remarks is required.</Text>}
                        <View style={{width : "100%", display:"flex", flexDirection: 'row', marginTop:15, justifyContent: 'space-evenly', alignItems:"center" }}>
                            <TouchableOpacity disabled={isButtonDisabled} onPress={handleSubmit(markCompletedWithDelay)} style={{ padding: 10, backgroundColor: '#c9184a', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                <Text style={{ fontSize: 16, color: 'white', fontWeight:"600" }}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={isButtonDisabled} onPress={() => setIsReturnWithDelayModalOpen(false)} style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                <Text style={{ fontSize: 16, color:"black", fontWeight:"600" }}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    </View>
  )
}

export default OutingRequestCard