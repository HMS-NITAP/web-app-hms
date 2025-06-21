import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Image, Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useToast } from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useDispatch, useSelector } from 'react-redux';
import { changeStudentProfilePhoto, deleteStudentAccount, fetchStudentByRollNoAndRegNo, sendAcknowledgementLetter } from '../../services/operations/AdminAPI';
import { AirbnbRating } from 'react-native-ratings';
import MainButton from '../../components/common/MainButton';
import DocumentPicker from 'react-native-document-picker';
import { useFocusEffect } from '@react-navigation/native';

const MAX_IMAGE_SIZE = 250 * 1024;

const ManageStudentAccounts = ({navigation}) => {

    const [searchQuery, setSearchQuery] = useState("");
    const [studentData, setStudentData] = useState(null);
    const [tabChoice, setTabChoice] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [sendAcknowledgementLetterModalVisible, setSendAcknowledgementLetterModalVisible] = useState(false);
    const [deleteStudentAccountModalVisible, setDeleteStudentAccountModalVisible] = useState(false);
    const [changeProfilePicModalVisible, setChangeProfilePicModalVisible] = useState(false);

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [imageResponse, setImageResponse] = useState(null);

    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.Auth);
    const toast = useToast();

    const pickUpImage = useCallback(async () => {
        try{
          const response = await DocumentPicker.pick({
            type: [DocumentPicker.types.images],
            presentationStyle: 'fullScreen',
          })

          if(response[0].size > MAX_IMAGE_SIZE){
            toast.show('File size exceeds the limit of 250KB. Please select a smaller file.', { type: 'warning' });
          }else{
            setImageResponse(response);
          }
        }catch(err){
          console.warn(err);
        }
    }, []);

    const getRatingLabel = (rating) => {
      rating = parseFloat(rating);
    
      if(rating>4 && rating<=5){
        return "Excellent";
      }else if(rating>3 && rating <= 4){
        return "Good";
      }else if(rating>2 && rating<=3){
        return "Average";
      }else if(rating>1 && rating<=2){
        return "Poor";
      }else if(rating>0 && rating<=1){
        return "Bad";
      }else{
        return "Not Rated";
      }
    };

    const getDateFormat = (date) => {
      const newDate = new Date(date);
      return newDate.toLocaleString();
    }

    const searchStudentWithId = async() => {
      setIsButtonDisabled(true);
        if(searchQuery.length===6 || searchQuery.length===7){
          setStudentData(null);
          const response = await dispatch(fetchStudentByRollNoAndRegNo(searchQuery,token,toast));
          setStudentData(response);
        }else{
          toast.show("Invalid Input !", {type : "warning"});
        }
      setIsButtonDisabled(false);
    }

    useFocusEffect(
      useCallback(() => {
        if(searchQuery.length > 0){
          searchStudentWithId();
        }
      }, [token,toast])
  );

    const sendAcknowledgementLetterHandler = async() => {
      setIsButtonDisabled(true);
      await dispatch(sendAcknowledgementLetter(studentData?.user?.id,token,toast));
      setSendAcknowledgementLetterModalVisible(false);
      setIsButtonDisabled(false);
    }

    const deleteStudentAccountHandler = async() => {
      setIsButtonDisabled(true);
      await dispatch(deleteStudentAccount(studentData?.user?.id,token,toast));
      setStudentData(null);
      setDeleteStudentAccountModalVisible(false);
      setIsButtonDisabled(false);
    }

    const changeStudentProfilePhotoHandler = async() => {
      setIsButtonDisabled(true);
      if(!studentData){
        toast.show("Something Went wrong", {type:"warning"});
        setIsButtonDisabled(false);
        setChangeProfilePicModalVisible(false);
        return;
      }

      if(imageResponse === null){
        toast.show("Image Not Selected", {type : "warning"});
        setIsButtonDisabled(false);
        return;
      }

      let formData = new FormData();
      formData.append("instituteStudentId",studentData?.id);
      formData.append("newProfilePic",{uri:imageResponse[0]?.uri, type:imageResponse[0]?.type, name:imageResponse[0]?.name});

      const response = await dispatch(changeStudentProfilePhoto(formData,token,toast));
      setChangeProfilePicModalVisible(false);
      setIsButtonDisabled(false);

      if(response) searchStudentWithId();
    }

    const changeStudentCotHandler = () => {
      navigation.navigate("Change Student Cot",
        {
          currentCotId : studentData?.cot?.id,
          userId : studentData?.user?.id,
        }
      )
    }

  return (
    <ScrollView contentContainerStyle={{width:"100%",display:"flex",justifyContent:"center", alignItems:"center", paddingHorizontal:10, paddingVertical:20}}>
        <View style={styles.subFormView}>
            <TextInput
                style={styles.input}
                placeholder="Search with Roll No / Reg No"
                placeholderTextColor={"#adb5bd"}
                onChangeText={(e) => setSearchQuery(e)}   
            />
            <TouchableOpacity disabled={isButtonDisabled} onPress={searchStudentWithId} style={{padding:10, borderColor:"black", borderWidth:1, borderRadius:100, borderStyle:"dotted"}}><Icon name="magnifying-glass" color="grey" size={25} /></TouchableOpacity>
        </View>

        {
          !studentData && <Text style={{color:"grey", marginVertical:15, fontSize:16, fontWeight:"700", textAlign:"center"}}>Please Search for a Student / Student Not Found</Text>
        }

        {
          studentData && (
            <View style={styles.subFormView}>
                <View style={{ width: "100%", marginHorizontal: "auto", display: "flex", marginVertical:15, flexDirection: "row", justifyContent: "center", alignItems: "center", overflow: 'hidden', borderWidth: 1, borderColor: "black", borderRadius: 10 }}>
                  <TouchableOpacity style={{ width: "33%", textAlign: "center", paddingVertical: 8, backgroundColor: tabChoice === 1 ? "#ffb703" : "white", }} onPress={() => setTabChoice(1)}><Text style={{ textAlign: 'center', width: "100%", color: "black" }}>About</Text></TouchableOpacity>
                  <TouchableOpacity style={{ width: "33%", textAlign: "center", paddingVertical: 8, backgroundColor: tabChoice === 2 ? "#ffb703" : "white", }} onPress={() => setTabChoice(2)}><Text style={{ textAlign: 'center', width: "100%", color: "black" }}>Complaints</Text></TouchableOpacity>
                  <TouchableOpacity style={{ width: "33%", textAlign: "center", paddingVertical: 8, backgroundColor: tabChoice === 3 ? "#ffb703" : "white", }} onPress={() => setTabChoice(3)}><Text style={{ textAlign: 'center', width: "100%", color: "black" }}>Outings</Text></TouchableOpacity>
                </View>
            </View>
          )
        }

        {
          studentData && tabChoice===1 && (
            <View style={styles.container}>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingBox}>
                <Text style={styles.ratingLabel}>Discipline Rating</Text>
                <AirbnbRating
                  defaultRating={Math.round(parseFloat(studentData?.disciplineRating, 10))}
                  isDisabled
                  showRating={false}
                  size={20}
                />
                <Text style={styles.ratingText}>{getRatingLabel(studentData?.disciplineRating)}</Text>
                <Text>{studentData?.disciplineRating}</Text>
              </View>
              <View style={styles.ratingBox}>
                <Text style={styles.ratingLabel}>Outing Rating</Text>
                <AirbnbRating
                  defaultRating={Math.round(parseFloat(studentData?.outingRating, 10))}
                  isDisabled
                  showRating={false}
                  size={20}
                />
                <Text style={styles.ratingText}>{getRatingLabel(studentData?.outingRating)}</Text>
                <Text>{studentData?.outingRating}</Text>
              </View>
            </View>
            <View style={styles.imageContainer}>
                {isLoading && (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
                )}
                <View style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", gap:15}}>
                  <Image 
                      source={{ uri: studentData?.image }} 
                      style={styles.image} 
                      onLoadStart={() => setIsLoading(true)}
                      onLoad={() => setIsLoading(false)}
                  />
                  <TouchableOpacity onPress={() => setChangeProfilePicModalVisible(true)} style={{padding:10, borderColor:"black", backgroundColor:"#f9c74f", borderWidth:0.5, borderRadius:15, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                    <Icon name="edit" size={20} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.name}>{studentData?.name}</Text>
                <Text style={{fontSize:14, fontWeight:"600", color : studentData?.user?.status==="ACTIVE" ? "green" : studentData?.user?.status==="INACTIVE" ? "red" : "#00b4d8"}}>({studentData?.user?.status})</Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}>Reg No: {studentData?.regNo}</Text>
              <Text style={styles.detailsText}>Roll No: {studentData?.rollNo}</Text>
              <Text style={styles.detailsText}>Email: {studentData?.user?.email}</Text>
              <Text style={styles.detailsText}>Gender: {studentData?.gender==="M" ? "Male" : "Female"}</Text>
              <Text style={styles.detailsText}>DOB: {new Date(studentData?.dob).toLocaleDateString()}</Text>
              <Text style={styles.detailsText}>Year: {studentData?.year}</Text>
              <Text style={styles.detailsText}>Branch: {studentData?.branch}</Text>
              <Text style={styles.detailsText}>Blood Group: {studentData?.bloodGroup}</Text>
              <Text style={styles.detailsText}>Aadhaar Number: {studentData?.aadhaarNumber}</Text>
              <Text style={styles.detailsText}>Contact No: {studentData?.phone}</Text>
              <Text style={styles.detailsText}>Father's Name: {studentData?.fatherName}</Text>
              <Text style={styles.detailsText}>Mother's Name: {studentData?.motherName}</Text>
              <Text style={styles.detailsText}>Parents' Contact: {studentData?.parentsPhone}</Text>
              <Text style={styles.detailsText}>Emergency Contact: {studentData?.emergencyPhone}</Text>
              <Text style={styles.detailsText}>Address: {studentData?.address}</Text>
            </View>
            <View style={styles.sectionContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                <View style={styles.column}>
                  <Text style={styles.columnTitle}>Hostel Details</Text>
                  <Text style={styles.detailsText}>Hostel Name: {studentData?.cot?.room?.hostelBlock?.name}</Text>
                  <Text style={styles.detailsText}>Capacity: {studentData?.cot?.room?.hostelBlock?.capacity}</Text>
                  <Text style={styles.detailsText}>Gender: {studentData?.cot?.room?.hostelBlock?.gender==="M" ? "Boys Hostel" : "Girls Hostel"}</Text>
                  <Image source={{ uri: studentData?.cot?.room?.hostelBlock?.image }} style={styles.hostelImage} />
                </View>
                <View style={styles.column}>
                  <Text style={styles.columnTitle}>Room Details</Text>
                  <Text style={styles.detailsText}>Room Type: {studentData?.cot?.room?.hostelBlock?.roomType}</Text>
                  <Text style={styles.detailsText}>Room Number: {studentData?.cot?.room?.roomNumber}</Text>
                  <Text style={styles.detailsText}>Floor Number: {studentData?.cot?.room.floorNumber}</Text>
                  <Text style={styles.detailsText}>Cot Number: {studentData?.cot?.cotNo}</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.columnTitle}>Mess Details</Text>
                  {studentData?.messHall ? (
                    <View>
                      <Text style={styles.detailsText}>Mess Name: {studentData?.messHall?.hallName}</Text>
                      <Text style={styles.detailsText}>Capacity: {studentData?.messHall?.capacity}</Text>
                    </View>
                  ) : (
                    <Text style={styles.detailsTextRed}>Mess Hall not assigned</Text>
                  )}
                </View>
                <View style={styles.column}>
                  <Text style={styles.columnTitle}>Payment Details</Text>
                  <TouchableOpacity>
                    <Text style={styles.link}>Hostel Fee Receipt</Text>
                  </TouchableOpacity>
                  {
                    studentData?.instituteFeeReceipt && <TouchableOpacity>
                                    <Text style={styles.link}>Institute Fee Receipt</Text>
                                  </TouchableOpacity>
                  }
                </View>
              </ScrollView>
            </View>
          </View>
          )
        }

        {
          studentData && tabChoice===2 && (studentData?.hostelComplaints.length===0 ? (<Text style={{color:"grey", fontWeight:"600", fontSize:18, textAlign:"center"}}>No Complaints Registered!</Text>) 
          : (
            studentData?.hostelComplaints.map((complaint) => {
                    return (
                        <View key={complaint?.id} style={{width:"100%",padding: 15,marginVertical: 8,backgroundColor: '#f9f9f9',borderRadius: 8,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,shadowRadius: 8,elevation: 2,width: '95%'}}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                Registered On : <Text style={{ fontWeight: 'normal', color: '#666' }}>{getDateFormat(complaint.createdAt)}</Text>
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                Category : <Text style={{ fontWeight: 'normal', color: '#666' }}>{complaint.category}</Text>
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                About : <Text style={{ fontWeight: 'normal', color: '#666' }}>{complaint.about}</Text>
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                Status: <Text style={{ fontWeight: '800', color: complaint?.status==="RESOLVED" ? "green" : "red"}}>{complaint.status==="RESOLVED" ? "RESOLVED" : "IN REVIEW"}</Text>
                            </Text>
                            {
                                complaint?.fileUrl[0] && 
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>Attachments : <Text style={{ fontWeight: 'normal', color: 'blue' }} onPress={() => Linking.openURL(complaint?.fileUrl[0])}>Click Here to See</Text></Text>
                            }
                            {
                                complaint?.resolvedOn && <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>Resolved On : <Text style={{ fontWeight: 'normal', color: '#666' }}>{getDateFormat(complaint?.resolvedOn)}</Text></Text>
                            }
                            {
                                complaint?.resolvedById && <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>Resolved By : <Text style={{ fontWeight: 'normal', color: '#666' }}>{complaint?.resolvedBy?.name} ({complaint?.resolvedBy?.designation})</Text></Text>
                            }
                        </View>
                    )
            }
          )))
        }

        {
          studentData && tabChoice===3 && (studentData?.outingApplication.length===0 ? (<Text style={{color:"grey", fontWeight:"600", fontSize:18, textAlign:"center"}}>No Outing Application Found!</Text>) 
          : (
            studentData?.outingApplication.map((application,index) => {
                    return(
                      <View key={index} style={{width:"100%",padding: 16,marginVertical: 8,backgroundColor: '#f9f9f9',borderRadius: 8,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1, borderColor:"black", borderWidth:1,shadowRadius: 8,elevation: 10}}>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                              Created On: <Text style={{ fontWeight: 'normal', color: '#666' }}>{getDateFormat(application?.createdAt)}</Text>
                          </Text>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                              From: <Text style={{ fontWeight: 'normal', color: '#666' }}>{getDateFormat(application?.from)}</Text>
                          </Text>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                              To: <Text style={{ fontWeight: 'normal', color: '#666' }}>{getDateFormat(application?.to)}</Text>
                          </Text>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                              Purpose: <Text style={{ fontWeight: 'normal', color: '#666' }}>{application?.purpose}</Text>
                          </Text>
                          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                              Place of Visit: <Text style={{ fontWeight: 'normal', color: '#666' }}>{application?.placeOfVisit}</Text>
                          </Text>
                          {
                            application?.status === "REJECTED" && (
                              <>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                    Verified By: <Text style={{ fontWeight: 'normal', color: '#666' }}>{application?.verifiedBy?.name} ({application?.verifiedBy?.designation})</Text>
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                    Verified At: <Text style={{ fontWeight: 'normal', color: '#666' }}>{getDateFormat(application?.verifiedOn)}</Text>
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                    Remarks: <Text style={{ fontWeight: 'normal', color: '#666' }}>{application?.remarks}</Text>
                                </Text>
                              </>
                            )
                          }
                          {
                            application?.status === "INPROGRESS" && (
                              <>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                    Verified By: <Text style={{ fontWeight: 'normal', color: '#666' }}>{application?.verifiedBy?.name} ({application?.verifiedBy?.designation})</Text>
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                    Verified At: <Text style={{ fontWeight: 'normal', color: '#666' }}>{getDateFormat(application?.verifiedOn)}</Text>
                                </Text>
                              </>
                            )
                          }
                          {
                            application?.status === "RETURNED" && (
                              <>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                    Verified By: <Text style={{ fontWeight: 'normal', color: '#666' }}>{application?.verifiedBy?.name} ({application?.verifiedBy?.designation})</Text>
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                    Verified At: <Text style={{ fontWeight: 'normal', color: '#666' }}>{getDateFormat(application?.verifiedOn)}</Text>
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                    Returned On: <Text style={{ fontWeight: 'normal', color: '#666' }}>{getDateFormat(application?.returnedOn)}</Text>
                                </Text>
                              </>
                            )
                          }
                          {
                            application?.status === "COMPLETED" && (
                              <>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                    Verified By: <Text style={{ fontWeight: 'normal', color: '#666' }}>{application?.verifiedBy?.name} ({application?.verifiedBy?.designation})</Text>
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                    Verified At: <Text style={{ fontWeight: 'normal', color: '#666' }}>{getDateFormat(application?.verifiedOn)}</Text>
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                                    Returned On: <Text style={{ fontWeight: 'normal', color: '#666' }}>{getDateFormat(application?.returnedOn)}</Text>
                                </Text>
                                {
                                  application?.remarks!==null && <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>Remarks: <Text style={{ fontWeight: 'normal', color: 'black' }}>{application?.remarks} (MARKED DELAYED)</Text></Text>
                                }
                              </>
                            )
                          }
                          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>
                              Status: <Text style={{ fontWeight: '800', color: application?.status==="PENDING" ? "orange"  : application?.status==="INPROGRESS" ? "green" : application?.status==="RETURNED" ? "#9d4edd" : application?.status==="COMPLETED" ? "green" : "red"}}>{application.status}</Text>
                          </Text>
                      </View>
                    )
            }
          )))
        }

        {
          studentData && (studentData?.user?.status==="ACTIVE" || studentData?.user?.status==="ACTIVE1") && (
            <View style={{marginTop:20, display:"flex", width:"90%", flexDirection:"column", justifyContent:"center", justifyContent:"center", gap:10}}>
                <MainButton text={"Send Acknowledgement Letter"} backgroundColor={"#aacc00"} textColor={"black"} onPress={() => setSendAcknowledgementLetterModalVisible(true)} />
                <MainButton text={"Delete Student Account"} backgroundColor={"#c9184a"} textColor={"white"} onPress={() => setDeleteStudentAccountModalVisible(true)} />
                <MainButton text={"Swap / Exchange Student Cot"} backgroundColor={"#023047"} textColor={"white"} onPress={changeStudentCotHandler} />
            </View>
          )
        }

        <>
          <Modal
                  animationType="slide"
                  transparent={true}
                  visible={sendAcknowledgementLetterModalVisible}
                  onRequestClose={() => {
                      setSendAcknowledgementLetterModalVisible(!sendAcknowledgementLetterModalVisible);
                  }}
              >
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                      <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10,textAlign:"center" }}>Do you want to send Acknowledgement Letter to this student.</Text>
                          <View style={{width : "100%", display:"flex", flexDirection: 'row', marginTop:15, justifyContent: 'space-evenly', alignItems:"center" }}>
                              <TouchableOpacity disabled={isButtonDisabled} onPress={sendAcknowledgementLetterHandler} style={{ padding: 10, backgroundColor: '#aacc00', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                  <Text style={{ fontSize: 16, color: 'black', fontWeight:"600" }}>Continue</Text>
                              </TouchableOpacity>
                              <TouchableOpacity disabled={isButtonDisabled} onPress={() => setSendAcknowledgementLetterModalVisible(false)} style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                  <Text style={{ fontSize: 16, color:"black", fontWeight:"600" }}>Cancel</Text>
                              </TouchableOpacity>
                          </View>
                      </View>
                  </View>
          </Modal>

          <Modal
                  animationType="slide"
                  transparent={true}
                  visible={deleteStudentAccountModalVisible}
                  onRequestClose={() => {
                      setDeleteStudentAccountModalVisible(!deleteStudentAccountModalVisible);
                  }}
              >
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                      <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10,textAlign:"center" }}>Are you sure, this student will be deleted permanently.</Text>
                          <View style={{width : "100%", display:"flex", flexDirection: 'row', marginTop:15, justifyContent: 'space-evenly', alignItems:"center" }}>
                              <TouchableOpacity disabled={isButtonDisabled} onPress={deleteStudentAccountHandler} style={{ padding: 10, backgroundColor: '#c9184a', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                  <Text style={{ fontSize: 16, color: 'white', fontWeight:"600" }}>Delete</Text>
                              </TouchableOpacity>
                              <TouchableOpacity disabled={isButtonDisabled} onPress={() => setDeleteStudentAccountModalVisible(false)} style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                  <Text style={{ fontSize: 16, color:"black", fontWeight:"600" }}>Cancel</Text>
                              </TouchableOpacity>
                          </View>
                      </View>
                  </View>
          </Modal>

          <Modal
                  animationType="slide"
                  transparent={true}
                  visible={changeProfilePicModalVisible}
                  onRequestClose={() => {
                      setChangeProfilePicModalVisible(!changeProfilePicModalVisible);
                  }}
              >
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                      <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10,textAlign:"center" }}>Upload new Profile Picture below 250KB.</Text>
                          <View style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:10, marginVertical:10}}>
                            <MainButton text="Select Image" onPress={pickUpImage} />
                            <View>
                            {
                                imageResponse ? 
                                    <View style={{maxWidth:"100%", display:"flex",flexDirection:'row',gap:8}}>
                                        <Image source={{ uri: imageResponse[0].uri }} style={{width:80,height:80,borderRadius:40}} />
                                    </View> : 
                                    <View><Text style={{fontWeight:"800", fontSize:15}}>No Image Selected</Text></View>
                            }
                          </View>
                          </View>
                          <View style={{width : "100%", display:"flex", flexDirection: 'row', marginTop:15, justifyContent: 'space-evenly', alignItems:"center" }}>
                              <TouchableOpacity disabled={isButtonDisabled} onPress={changeStudentProfilePhotoHandler} style={{ padding: 10, backgroundColor: '#aacc00', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                  <Text style={{ fontSize: 16, color: 'black', fontWeight:"600" }}>Update</Text>
                              </TouchableOpacity>
                              <TouchableOpacity disabled={isButtonDisabled} onPress={() => setChangeProfilePicModalVisible(false)} style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 8, opacity:isButtonDisabled?0.5:1 }}>
                                  <Text style={{ fontSize: 16, color:"black", fontWeight:"600" }}>Cancel</Text>
                              </TouchableOpacity>
                          </View>
                      </View>
                  </View>
          </Modal>
        </>

    </ScrollView>
  )
}

export default ManageStudentAccounts

const styles = StyleSheet.create({
  subFormView: {
      width:"95%",
      display: 'flex',
      flexDirection:"row",
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
    },
  input: {
      width:"80%",
      padding: 10,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "#adb5bd",
      color: "black",
  },
  container: {
    flex: 1,
    padding: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  ratingBox: {
    alignItems: 'center',
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#dcedc8',
    marginHorizontal: 5,
    elevation:10,
    color:"#495057",
  },
  ratingLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color:"#495057",
  },
  ratingText: {
    marginTop: 5,
    fontSize: 14
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: 'black'
  },
  detailsContainer: {
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#cfd8dc',
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation:10,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight:"600",
    color:"black",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#388e3c'
  },
  horizontalScroll: {
    padding: 10
  },
  column: {
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cfd8dc',
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation:10,
    height:300
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#388e3c',
    textAlign: 'center'
  },
  hostelImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 10
  },
  detailsTextRed: {
    fontSize: 16,
    marginBottom: 5,
    color: 'red'
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 16,
    marginBottom: 5
  },
  attendanceContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  attendanceText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width:"90%",
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    gap:10,
    alignItems: 'center'
  },
  quote:{
    color:"black",
    fontSize:16,
    fontWeight:"500",
    textAlign:"center"
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#388e3c'
  },
  closeButton: {
    backgroundColor: '#388e3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});