import React, { useState } from 'react';
import { ActivityIndicator, Image, Linking, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import MainButton from '../common/MainButton';
import { useDispatch } from 'react-redux';
import { acceptRegistrationApplication, freezeRegistrationApplication, rejectRegistrationApplication } from '../../services/operations/AdminAPI';
import { Students } from '../../static/IndisciplinaryStudents';

const ApplicationCard = ({ application, toast, token, fetchData }) => {
    const [imageLoading, setImageLoading] = useState(false);
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [acceptModalVisible, setAcceptModalVisible] = useState(false);
    const [freezeModalVisible, setFreezeModalVisible] = useState(false);

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm();
    const dispatch = useDispatch();

    const acceptHandler = async() => {
        setIsButtonDisabled(true);
        let formdata = new FormData();
        formdata.append("userId",application?.id);
        await dispatch(acceptRegistrationApplication(formdata,token,toast));
        fetchData();
        setAcceptModalVisible(false);
        setIsButtonDisabled(false);
    }

    const rejectHandler = async(data) => {
        setIsButtonDisabled(true);
        let formdata = new FormData();
        formdata.append("userId",application?.id);
        formdata.append("remarks",data?.remarks);
        await dispatch(rejectRegistrationApplication(formdata,token,toast));
        fetchData();
        setRejectModalVisible(false);
        setIsButtonDisabled(false);
    }

    const freezeHandler = async(data) => {
        setIsButtonDisabled(true);
        let formdata = new FormData();
        formdata.append("userId",application?.id);
        formdata.append("remarks",data?.remarks1);
        await dispatch(freezeRegistrationApplication(formdata,token,toast));
        fetchData();
        setFreezeModalVisible(false);
        setIsButtonDisabled(false);
    } 

    return (
        <View style={{ width: "100%", paddingHorizontal: 10, paddingVertical: 15, borderRadius: 10, borderColor:Students.includes(application?.instituteStudent?.rollNo) ? "red" : "black", borderWidth: Students.includes(application?.instituteStudent?.rollNo) ? 2 : 1  }}>
            <View style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 15 }}>
                <View style={{ width: 80, height: 80, borderRadius: 40, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', }}>
                    {imageLoading && (
                        <ActivityIndicator size="large" color="#0000ff" style={{ position: 'absolute', zIndex: 1 }} />
                    )}
                    <Image
                        source={{ uri: application?.instituteStudent?.image }}
                        style={{ width: 80, height: 80, }}
                        onLoadStart={() => setImageLoading(true)}
                        onLoad={() => setImageLoading(false)}
                    />
                </View>
                <View>
                    <Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>Name: <Text style={{ fontWeight: "500" }}>{application?.instituteStudent?.name}</Text></Text>
                    <Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>Roll No: <Text style={{ fontWeight: "500" }}>{application?.instituteStudent?.rollNo}</Text></Text>
                    <Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>Reg. No: <Text style={{ fontWeight: "500" }}>{application?.instituteStudent?.regNo}</Text></Text>
                    <Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>Gender: <Text style={{ fontWeight: "500" }}>{application?.instituteStudent?.gender === "M" ? "Male" : "Female"}</Text></Text>
                </View>
            </View>
            <View style={{ width: "100%", display: "flex", flexDirection: "column", gap: 2, marginVertical: 10 }}>
                <Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>Email ID: <Text style={{ fontWeight: "500" }}>{application?.email}</Text></Text>
                <Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>Year: <Text style={{ fontWeight: "500" }}>{application?.instituteStudent?.year}</Text></Text>
                <Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>Branch: <Text style={{ fontWeight: "500" }}>{application?.instituteStudent?.branch}</Text></Text>
                <Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>Contact : <Text style={{ fontWeight: "500" }}>{application?.instituteStudent?.phone}</Text></Text>
            </View>
            <View style={{ width: "100%", display: "flex", flexDirection: "column", gap: 2, marginVertical: 10 }}>
                <Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>Payment Mode: <Text style={{ fontWeight: "500" }}>{application?.instituteStudent?.paymentMode}</Text></Text>
                <Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>Paid On: <Text style={{ fontWeight: "500" }}>{application?.instituteStudent?.paymentDate}</Text></Text>
                <Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>Amount: <Text style={{ fontWeight: "500" }}>{application?.instituteStudent?.amountPaid}</Text></Text>
                {
                    application?.instituteStudent?.instituteFeeReceipt &&
                    <Text style={{ color: "black", fontSize: 15, fontWeight: "500" }}>Institute Fee : <Text style={{ color: "blue" }} onPress={() => Linking.openURL(application?.instituteStudent?.instituteFeeReceipt)}><Text>Click Here</Text></Text></Text>
                }
                {
                    application?.instituteStudent?.hostelFeeReceipt &&
                    <Text style={{ color: "black", fontSize: 15, fontWeight: "500" }}>Hostel Fee : <Text style={{ color: "blue" }} onPress={() => Linking.openURL(application?.instituteStudent?.hostelFeeReceipt)}><Text>Click Here</Text></Text></Text>
                }
            </View>
            <View style={{ width: "100%", display: "flex", flexDirection: "column", gap: 2, marginVertical: 10 }}>
                <Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>Hostel Block: <Text style={{ fontWeight: "500" }}>{application?.instituteStudent?.hostelBlock?.name}</Text></Text>
                <Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>Room No: <Text style={{ fontWeight: "500" }}>{application?.instituteStudent?.cot?.room?.roomNumber}</Text></Text>
                <Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>Floor No: <Text style={{ fontWeight: "500" }}>{application?.instituteStudent?.cot?.room?.floorNumber}</Text></Text>
                <Text style={{ color: "black", fontSize: 16, fontWeight: "600" }}>Cot No: <Text style={{ fontWeight: "500" }}>{application?.instituteStudent?.cot?.cotNo}</Text></Text>
            </View>
            <View style={{ width: "100%", display: "flex", flexDirection: "row", gap: 10, justifyContent: "space-evenly", alignItems: "center", marginTop: 10 }}>
                <MainButton text={"ACCEPT"} backgroundColor={"#aacc00"} onPress={() => setAcceptModalVisible(true)} />
                <MainButton text={"REJECT"} backgroundColor={"#c9184a"} textColor={"white"} onPress={() => setRejectModalVisible(true)} />
                <MainButton text={"FREEZE"} backgroundColor={"#00b4d8"} textColor={"white"} onPress={() => setFreezeModalVisible(true)} />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={rejectModalVisible}
                onRequestClose={() => {
                    setRejectModalVisible(!rejectModalVisible);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10,textAlign:"center" }}>Are you sure, this Application will Rejected.</Text>
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
                            <TouchableOpacity disabled={isButtonDisabled} onPress={handleSubmit(rejectHandler)} style={{ padding: 10, backgroundColor: '#c9184a', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                <Text style={{ fontSize: 16, color: 'white', fontWeight:"600" }}>Reject</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={isButtonDisabled} onPress={() => setRejectModalVisible(false)} style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                <Text style={{ fontSize: 16, color:"black", fontWeight:"600" }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={acceptModalVisible}
                onRequestClose={() => {
                    setAcceptModalVisible(!acceptModalVisible);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, textAlign:"center", fontWeight: '500', marginBottom: 10, color:"black" }}>Are you sure, this application will be accepted.</Text>
                        <View style={{width : "100%", display:"flex", flexDirection: 'row', marginTop:15, justifyContent: 'space-evenly', alignItems:"center" }}>
                            <TouchableOpacity disabled={isButtonDisabled} onPress={acceptHandler} style={{ padding: 10, backgroundColor: '#aacc00', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                <Text style={{ fontSize: 16, color: 'black', fontWeight:"600" }}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={isButtonDisabled} onPress={() => setAcceptModalVisible(false)} style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                <Text style={{ fontSize: 16, color:"black", fontWeight:"600" }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={freezeModalVisible}
                onRequestClose={() => {
                    setFreezeModalVisible(!freezeModalVisible);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10,textAlign:"center" }}>Are you sure, this Application will Freezed.</Text>
                        <Text style={{ fontSize: 14, color:"black", fontWeight: '400', marginBottom: 3 }}>Reason for Freezing</Text>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={{ padding: 10, paddingHorizontal: 10, borderWidth: 1, borderRadius: 10, borderColor: "#adb5bd", color:"black", }}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Enter reason for Freezing"
                                    numberOfLines={2}
                                    multiline
                                />
                            )}
                            name="remarks1"
                            defaultValue=""
                        />
                        {errors.remarks1 && <Text style={{fontSize:14, color:"red"}}>Remarks is required.</Text>}
                        <View style={{width : "100%", display:"flex", flexDirection: 'row', marginTop:15, justifyContent: 'space-evenly', alignItems:"center" }}>
                            <TouchableOpacity disabled={isButtonDisabled} onPress={handleSubmit(freezeHandler)} style={{ padding: 10, backgroundColor: '#00b4d8', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                <Text style={{ fontSize: 16, color: 'white', fontWeight:"600" }}>Freeze</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={isButtonDisabled} onPress={() => setFreezeModalVisible(false)} style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                <Text style={{ fontSize: 16, color:"black", fontWeight:"600" }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ApplicationCard;
