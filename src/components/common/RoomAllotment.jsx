import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHostelBlockRooms,fetchHostelBlockNames } from '../../services/operations/CommonAPI';
import { useToast } from 'react-native-toast-notifications';
import { setRegistrationData, setRegistrationStep } from '../../reducer/slices/AuthSlice';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { createStudentAccount } from '../../services/operations/AuthAPI';

const RoomAllotment = ({}) => {

  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [hostelBlocks, setHostelBlocks] = useState(null);
  const [hostelBlockRooms, setHostelBlockRooms] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [floorRooms, setFloorRooms] = useState(null);
  const [selectedCot, setSelectedCot] = useState(null);

  const [submitDetails, setSubmitDetails] = useState({roomNo: null, floorNo: null, blockName: null, cotNo: null});

  const [floorCount, setFloorCount] = useState(null);
  const floorsArray = Array.from({ length: floorCount + 1 }, (_, index) => ({
    id : index,
  }));

  const toast = useToast();
  const dispatch = useDispatch();

  const {registrationData} = useSelector((state) => state.Auth);

  const fetchHostelBlocks = async() => {
    const response = await dispatch(fetchHostelBlockNames(toast));
    if(!registrationData){
      return;
    }
    if(response && response.length>0){
      const filteredBlocks = response.filter((block) => block?.gender==registrationData?.gender && block?.year==registrationData?.year);
      setHostelBlocks(filteredBlocks);
    }
  }

  const fetchRooms = async() => {
    setIsButtonDisabled(true);
    setSelectedCot(null);
    const filterData = hostelBlocks.filter((block) => block.id === selectedBlock);
    const floors = parseInt(filterData[0].floorCount);
    setFloorCount(floors);
    const response = await dispatch(fetchHostelBlockRooms(selectedBlock,toast));
    setHostelBlockRooms(response);
    setSubmitDetails({
      blockName: filterData[0].name,
      cotNo : null,
      floorNo : null,
      roomNo : null,
    });
    setIsButtonDisabled(false);
  }

  useEffect(() => {
    if(selectedBlock){
      fetchRooms();
    }
  },[selectedBlock]);

  useEffect(() => {
    const filterRoomsFloorWise = () => {
      if(!hostelBlockRooms){
        return;
      }
      const filterRooms = hostelBlockRooms.filter((room) => room?.floorNumber===selectedFloor);
      setFloorRooms(filterRooms);
    }
    filterRoomsFloorWise();
  },[selectedFloor,hostelBlockRooms]);

  useEffect(() => {
    fetchHostelBlocks();
    setLoading(false);
  },[]);

  const selectCot = (cot,room) => {
    if(cot?.status === "BOOKED" || cot?.status === "BLOCKED"){
      return;
    }
    setSelectedCot(cot?.id);
    setSubmitDetails((prevDetails) => ({
      ...prevDetails,
      cotNo: cot?.cotNo,
      roomNo: room?.roomNumber,
      floorNo: room?.floorNumber,
    }));
    setModalVisible(true);
  }

  const cancelHandler = () => {
    setModalVisible(false);
    setSelectedCot(null);
  }

  const handleSubmit = async() => {
    if(!registrationData){
      return;
    }

    setIsButtonDisabled(true);

    const formdata = new FormData();
    formdata.append("email",registrationData?.email);
    formdata.append("password",registrationData?.password);
    formdata.append("confirmPassword",registrationData?.confirmPassword);
    formdata.append("name",registrationData?.name);
    formdata.append("regNo",registrationData?.regNo);
    formdata.append("rollNo",registrationData?.rollNo);
    formdata.append("year",registrationData?.year);
    formdata.append("branch",registrationData?.branch);
    formdata.append("gender",registrationData?.gender);
    formdata.append("pwd",registrationData?.pwd);
    formdata.append("community",registrationData?.community);
    formdata.append("aadhaarNumber",registrationData?.aadhaarNumber);
    formdata.append("dob",registrationData?.dob);
    formdata.append("bloodGroup",registrationData?.bloodGroup);
    formdata.append("fatherName",registrationData?.fatherName);
    formdata.append("motherName",registrationData?.motherName);
    formdata.append("phone",registrationData?.phone);
    formdata.append("parentsPhone",registrationData?.parentsPhone);
    formdata.append("emergencyPhone",registrationData?.emergencyPhone);
    formdata.append("address",registrationData?.address);
    formdata.append("hostelBlockId",selectedBlock);
    formdata.append("cotId",selectedCot);
    formdata.append("image",{uri:registrationData?.image[0]?.uri, type:registrationData?.image[0]?.type, name:registrationData?.image[0]?.name});
    if(registrationData?.instituteFeeReceipt?.[0]){
      formdata.append("instituteFeeReceipt", {uri: registrationData.instituteFeeReceipt[0].uri, type: registrationData.instituteFeeReceipt[0].type, name: registrationData.instituteFeeReceipt[0].name});
    }
    formdata.append("hostelFeeReceipt",{uri:registrationData?.hostelFeeReceipt[0]?.uri, type:registrationData?.hostelFeeReceipt[0]?.type, name:registrationData?.hostelFeeReceipt[0]?.name});
    formdata.append("paymentMode",registrationData?.paymentMode);
    formdata.append("paymentDate",registrationData?.paymentDate);
    formdata.append("amountPaid",registrationData?.amountPaid);

    const response = await dispatch(createStudentAccount(formdata,toast));
    if(response){
      setModalVisible(false);
      await dispatch(setRegistrationStep(4));
    }else{
      toast.show("Refresh the page from the above icon to check if the room is already booked by someone else.",{type:"warning"});
      setModalVisible(false);
    }
    setIsButtonDisabled(false);
  }

  return (
    <>
      {
        loading ? (<View><Text style={{fontWeight:"800",fontSize:18}}>Data Loading...</Text></View>) : 
          <View style={styles.container}>
            {
              (!hostelBlocks || hostelBlocks.length===0) ? (
                <View style={{width:"100%", backgroundColor:"#ff928b", borderRadius:20, paddingHorizontal:15, paddingVertical:15}}>
                  <Text style={{textAlign:"center", fontSize:15, color:"black", fontWeight:"800"}}>No Hostel Blocks Alloted as per your Requirements.</Text>
                </View>
              ) : (
                <View style={styles.filterContainer}>
                  <Text style={styles.filterLabel}>Select Block :</Text>
                  <View style={{display:"flex", maxWidth:"70%", gap:10, flexDirection:"row", flexWrap:"wrap", justifyContent:"flex-start", alignItems:"center"}}>
                    {
                      hostelBlocks?.map((hostel,index) => (
                        <TouchableOpacity onPress={() => setSelectedBlock(hostel.id)} style={{padding:8, borderRadius:8, backgroundColor: selectedBlock === hostel?.id ? '#b5e48c' : 'white', borderWidth:0.5, borderColor:selectedBlock === hostel?.id ? 'transparent' : 'black'}} key={index}>
                          <Text style={styles.filterButtonText}>{hostel?.name}</Text>
                        </TouchableOpacity>
                      )) 
                    }
                  </View>
                </View>
              )
            }

            {
              floorCount && (
                <View style={styles.filterContainer}>
                  <Text style={styles.filterLabel}>Select Floor :</Text>
                  <View style={{display:"flex", maxWidth:"70%", gap:10, flexDirection:"row", flexWrap:"wrap", justifyContent:"center", alignItems:"center"}}>
                    {
                      floorsArray?.map((floor,index) => (
                        <TouchableOpacity onPress={() => setSelectedFloor(floor?.id)} style={{paddingHorizontal:10, paddingVertical:5, borderRadius:1000, backgroundColor: selectedFloor === floor?.id ? '#b5e48c' : 'white', borderWidth:0.5, borderColor:selectedFloor === floor?.id ? 'transparent' : 'black'}} key={index}>
                          <Text style={styles.filterButtonText}>{floor?.id}</Text>
                        </TouchableOpacity>
                      )) 
                    }
                  </View>
                </View>
              )
            }

            {
              selectedBlock && selectedFloor!==null && <View style={{width:"90%",marginHorizontal:"auto",display:"flex",flexDirection:"row",justifyContent:"flex-end",alignItems:"center"}}><TouchableOpacity disabled={isButtonDisabled} onPress={() => fetchRooms()}><Icon name="arrows-rotate" style={{color:"#003049",fontSize:20}} /></TouchableOpacity></View>
            }

            {
              (!floorRooms || floorRooms.length==0) ? (<View><Text style={{color:"red", fontSize:16, fontWeight:"500"}}>No Rooms Are Present With This Requirements</Text></View>) : (
                <View style={{width:"100%", display:"flex", flexDirection:"column", gap:15, justifyContent:"center", alignItems:"center"}}>
                  {
                    floorRooms.map((room,index) => (
                      <View key={index} style={{width:"90%", borderStyle:"dashed", marginHorizontal:"auto", gap:20, borderWidth:1.5, borderColor:"black", borderRadius:10, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", paddingHorizontal:15, paddingVertical:15}}>
                        <Text style={{textAlign:"center", fontWeight:"800", color:"red", fontSize:16, color:"#1b263b"}}>Room {room?.roomNumber}</Text>
                        <View style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", flexWrap:"wrap", gap:10}}>
                          {
                            room.cots.map((cot,index) => (
                              <TouchableOpacity onPress={() => selectCot(cot,room)} key={index} style={{borderWidth:1, borderStyle:"dotted",borderColor:"black",borderRadius:8, paddingHorizontal:8, paddingVertical:8, backgroundColor:selectedCot===cot?.id ? "#ffdd00" : cot?.status==="AVAILABLE" ? "transparent" : "#adb5bd"}}>
                                <Text style={{color:"black", fontWeight:"600", fontSize:16}}>Cot {cot?.cotNo}</Text>
                              </TouchableOpacity>
                            ))
                          }
                        </View>
                      </View>
                    ))
                  }
                </View>
              )
            }

          </View>
      }
      <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalText}>Verify your selected Room Details and submit your Application</Text>
                <View style={{display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"center",gap:5}}>
                  <Text style={{fontSize:16,fontWeight:"600",color:"black"}}>Block Name : <Text style={{fontSize:16,fontWeight:"400",color:"black"}}>{submitDetails?.blockName}</Text></Text>
                  <Text style={{fontSize:16,fontWeight:"600",color:"black"}}>Floor No : <Text style={{fontSize:16,fontWeight:"400",color:"black"}}>{submitDetails?.floorNo}</Text></Text>
                  <Text style={{fontSize:16,fontWeight:"600",color:"black"}}>Room No : <Text style={{fontSize:16,fontWeight:"400",color:"black"}}>{submitDetails?.roomNo}</Text></Text>
                  <Text style={{fontSize:16,fontWeight:"600",color:"black"}}>Cot No : <Text style={{fontSize:16,fontWeight:"400",color:"black"}}>{submitDetails?.cotNo}</Text></Text>
                </View>
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                      disabled={isButtonDisabled}
                      style={[styles.confirmButton, { opacity:isButtonDisabled?0.5:1 }]}
                      onPress={handleSubmit}
                  >
                      <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                      disabled={isButtonDisabled}
                      style={[styles.cancelButton, {opacity:isButtonDisabled?0.5:1}]} 
                      onPress={cancelHandler}
                  >
                      <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
            </View>
            </View>
        </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display:"flex",
    flexDirection:"column",
    gap:20,
    width:"100%",
    paddingHorizontal:10,
  },
  filterContainer: {
    display:"flex",
    flexDirection: 'row',
    alignItems: 'center',
    gap:20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  filterButtonText: {
    color: 'black',
    fontWeight: '700',
  },
  roomContainer: {
    backgroundColor: '#ffffffcc',
    padding: 15, 
    marginBottom: 20, 
    borderRadius: 10,
    alignItems: 'center',
  },
  roomText: {
    fontSize: 18, 
    fontWeight: 'bold',
    marginBottom: 10, 
  },
  cotContainer: {
    backgroundColor: 'lightgreen',
    padding: 8, 
    margin: 5, 
    borderRadius: 5,
  },
  cotText: {
    fontSize: 14,
    color: 'black',
  },
  roomsList: {
    alignItems: 'center',
    paddingBottom: 20, 
  },
  noRoomsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
    fontWeight: 'bold',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContainer: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    gap:15
  },
  modalText: {
    color:"#6c757d",
    fontSize: 18,
    textAlign: "center"
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#76c893",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#6c757d",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 10
  },
  buttonText: {
    color: "white",
    fontSize: 16
  },
});

export default RoomAllotment;