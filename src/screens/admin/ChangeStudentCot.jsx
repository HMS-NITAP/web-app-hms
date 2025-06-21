import { useFocusEffect, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native'
import { fetchCotsForChangeCotOption, swapOrExchangeCot } from '../../services/operations/AdminAPI';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MainButton from '../../components/common/MainButton';

const ChangeStudentCot = ({navigation}) => {

    const route = useRoute();
    const {currentCotId,userId} = route.params;

    const [completeData, setCompleteData] = useState(null);
    const [hostelBlockNames, setHostelBlockNames] = useState(null);
    const [selectedHostelBlock, setSelectedHostelBlock] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [selectedHostelBlockRooms, setSelectedHostelBlockRooms] = useState(null);
    const [floorRooms, setFloorRooms] = useState(null);
    const [selectedCot, setSelectedCot] = useState({roomNo: null, floorNo: null, blockName: null, cotNo: null, status: null, changeToCotId: null});

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const [floorCount, setFloorCount] = useState(null);
    const floorsArray = Array.from({ length: floorCount + 1 }, (_, index) => ({
        id : index,
    }));

    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.Auth);
    const toast = useToast();
    
    useEffect(() => {
        if(selectedHostelBlock){
            setSelectedFloor(null);
            setFloorCount(null);
            setSelectedHostelBlockRooms(null);
            // setSelectedCot(null);
            setFloorRooms(null);
            const selectedHostelBlockData = completeData?.filter((block) => block?.id===selectedHostelBlock);
            console.log("SEFDF",selectedHostelBlockData);
            setSelectedCot({
              blockName: selectedHostelBlockData[0]?.name,
              cotNo : null,
              changeToCotId : null,
              floorNo : null,
              roomNo : null,
              status : null,
            });
            setSelectedHostelBlockRooms(selectedHostelBlockData[0]?.rooms);
            setFloorCount(parseInt(selectedHostelBlockData[0]?.floorCount));
        }
      },[selectedHostelBlock]);

    const fetchData = async() => {
        setHostelBlockNames(null);
        setFloorRooms(null);
        setSelectedCot({
          blockName: null,
          cotNo : null,
          changeToCotId : null,
          floorNo : null,
          roomNo : null,
          status : null,
        });
        setFloorCount(null);
        setSelectedFloor(null);
        setCompleteData(null);
        setSelectedHostelBlockRooms(null);
        setSelectedHostelBlock(null);
        if(!currentCotId || !userId){
            toast.show("Data is Missing", {type : "warning"});
            return;
        }

        const response = await dispatch(fetchCotsForChangeCotOption(userId,token,toast));
        setCompleteData(response);   
    }

    useEffect(() => {
        const filterRoomsFloorWise = () => {
          if(!selectedHostelBlockRooms || selectedFloor===null){
            return;
          }

          const filterRooms = selectedHostelBlockRooms.filter((room) => room?.floorNumber===selectedFloor);
          setFloorRooms(filterRooms);
        }
        filterRoomsFloorWise();
      },[selectedFloor,selectedHostelBlock]);

    useFocusEffect(
        useCallback(() => {
          fetchData();
        }, [token,toast,dispatch])
    );

    const cancelHandler = () => {
      setIsModalVisible(false);
      setSelectedCot((prevDetails) => ({
        ...prevDetails,
        changeToCotId : null,
        cotNo: null,
        roomNo: null,
        floorNo: null,
        status: null,
      }));
    }

    const selectCot = (cot,room) => {
      if(cot?.status === "BLOCKED"){
        toast.show("Cannot Change BLOCKED Cot");
        return;
      }
      setSelectedCot((prevDetails) => ({
        ...prevDetails,
        changeToCotId : cot?.id,
        cotNo: cot?.cotNo,
        roomNo: room?.roomNumber,
        floorNo: room?.floorNumber,
        status: cot?.status,
      }));
      setIsModalVisible(true);
    }

    const handleSubmit = async() => {
      setIsButtonDisabled(true);
      await dispatch(swapOrExchangeCot(currentCotId,selectedCot?.changeToCotId,token,toast));
      setIsModalVisible(false);
      setIsButtonDisabled(false);
      setSelectedCot({
        blockName: null,
        cotNo : null,
        changeToCotId : null,
        floorNo : null,
        roomNo : null,
        status : null,
      });
      navigation.navigate("Manage Student Accounts");
      setIsButtonDisabled(false);
    }
 
  return (
    <ScrollView contentContainerStyle={{width:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"flex-start", paddingHorizontal:15, paddingVertical:20, gap:15}}>
        {
            completeData && (completeData?.length===0 ? <Text style={{textAlign:"center", fontSize:15, fontWeight:"500", color:"grey"}}>No Hostel Blocks Found</Text> : (
                <View style={styles.filterContainer}>
                  <Text style={styles.filterLabel}>Select Block :</Text>
                  <View style={{display:"flex", maxWidth:"70%", gap:10, flexDirection:"row", flexWrap:"wrap", justifyContent:"flex-start", alignItems:"center"}}>
                    {
                      completeData?.map((hostel,index) => (
                        <TouchableOpacity onPress={() => setSelectedHostelBlock(hostel?.id)} style={{padding:8, borderRadius:8, backgroundColor: selectedHostelBlock === hostel?.id ? '#b5e48c' : 'white', borderWidth:0.5, borderColor:selectedHostelBlock === hostel?.id ? 'transparent' : 'black'}} key={index}>
                          <Text style={styles.filterButtonText}>{hostel?.name}</Text>
                        </TouchableOpacity>
                      )) 
                    }
                  </View>
                </View>
            ))
        }

        {
              completeData && floorCount && (
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
            selectedHostelBlock && selectedFloor!==null && <View style={{width:"100%",marginHorizontal:"auto",display:"flex",flexDirection:"row",justifyContent:"flex-end",alignItems:"center"}}><TouchableOpacity disabled={isButtonDisabled} onPress={fetchData}><Icon name="arrows-rotate" style={{color:"#003049",fontSize:20}} /></TouchableOpacity></View>
        }

        {
            selectedHostelBlock && selectedFloor!==null && floorRooms && (
                <View style={{width:"100%", display:"flex", flexDirection:"column", gap:15, justifyContent:"center", alignItems:"center"}}>
                  {
                    floorRooms.map((room,index) => (
                      <View key={index} style={{width:"100%", borderStyle:"dashed", marginHorizontal:"auto", gap:20, borderWidth:1.5, borderColor:"black", borderRadius:10, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", paddingHorizontal:15, paddingVertical:10}}>
                        <Text style={{textAlign:"center", fontWeight:"800", color:"red", fontSize:16, color:"#1b263b"}}>Room {room?.roomNumber}</Text>
                        <View style={{display:"flex", flexDirection:"column", width:"90%", justifyContent:"center", alignItems:"center", flexWrap:"wrap", gap:10}}>
                          {
                            room.cots.map((cot,index) => (
                              <View key={index} style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", gap:5, width:"100%", marginHorizontal:"auto"}}>
                                <View style={{borderWidth:1, width:"40%", borderStyle:"dotted",borderColor:"black",borderRadius:8, paddingHorizontal:8, paddingVertical:8, backgroundColor:selectedCot===cot?.id ? "#ffdd00" : cot?.status==="AVAILABLE" ? "transparent" : "#adb5bd"}}>
                                  <Text style={{color:"black", fontWeight:"600", fontSize:16, textAlign:"center"}}>Cot {cot?.cotNo} ({cot?.status})</Text>
                                </View>
                                <TouchableOpacity onPress={() => selectCot(cot,room)} style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",width:"40%", borderRadius:8, borderColor:"black", borderWidth:1, paddingHorizontal:8, paddingVertical:12, backgroundColor : cot?.status === "AVAILABLE" ? "green" : cot?.status === "BOOKED" ? "#ffd60a" : "red"}} >
                                  <Text style={{fontSize:15, fontWeight:"600", color : cot?.status === "BOOKED" ? "black" : "white"}}>{cot?.status==="BLOCKED" ? "---" : cot?.status==="AVAILABLE" ? "Swap" : "Exchange"}</Text>
                                </TouchableOpacity>
                              </View>
                            ))
                          }
                        </View>
                      </View>
                    ))
                  }
                </View>
              )
            }

            <>
              <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isModalVisible}
                  onRequestClose={() => setIsModalVisible(false)}
              >
                  <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                      <Text style={styles.modalText}>{selectedCot?.status==="BOOKED" ? "Swap the cot of selected student with the one at below mentioned cot" : "Move the selected student to the below mentioned vacant cot"}</Text>
                      <View style={{display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"center",gap:5}}>
                        <Text style={{fontSize:16,fontWeight:"600",color:"black"}}>Block Name : <Text style={{fontSize:16,fontWeight:"400",color:"black"}}>{selectedCot?.blockName}</Text></Text>
                        <Text style={{fontSize:16,fontWeight:"600",color:"black"}}>Floor No : <Text style={{fontSize:16,fontWeight:"400",color:"black"}}>{selectedCot?.floorNo}</Text></Text>
                        <Text style={{fontSize:16,fontWeight:"600",color:"black"}}>Room No : <Text style={{fontSize:16,fontWeight:"400",color:"black"}}>{selectedCot?.roomNo}</Text></Text>
                        <Text style={{fontSize:16,fontWeight:"600",color:"black"}}>Cot No : <Text style={{fontSize:16,fontWeight:"400",color:"black"}}>{selectedCot?.cotNo}</Text></Text>
                      </View>
                      <View style={styles.modalButtons}>
                        <TouchableOpacity 
                            disabled={isButtonDisabled}
                            style={[styles.confirmButton, { opacity:isButtonDisabled?0.5:1 }]}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.buttonText}>{selectedCot?.status==="AVAILABLE" ? "Swap" : "Move"}</Text>
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

    </ScrollView>
  )
}

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

export default ChangeStudentCot