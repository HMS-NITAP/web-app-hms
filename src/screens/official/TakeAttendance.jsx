import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux'
import { fetchHostelBlockRoomsForAttendance, markStudentAbsent, markStudentPresent, unmarkStudentAbsent, unmarkStudentPresent } from '../../services/operations/OfficialAPI';
import { useFocusEffect } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import MainButton from '../../components/common/MainButton';

const TakeAttendance = () => {

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.Auth);
  const toast = useToast();

  const [hostelData, setHostelData] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [floorRooms, setFloorRooms] = useState(null);
  const [dateFormat, setDateFormat] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [floorCount, setFloorCount] = useState(null);

  const floorsArray = Array.from({ length: (floorCount || 0) + 1 }, (_, index) => ({
    id: index,
  }));

  const fetchData = async () => {
    setHostelData(null);
    // setSelectedFloor(null);
    const response = await dispatch(fetchHostelBlockRoomsForAttendance(token, toast));
    if (response) {
      setFloorCount(parseInt(response?.floorCount))
      setHostelData(response);
    }
  }

  useEffect(() => {
    const filterRoomsFloorWise = () => {
      if (!hostelData) {
        return;
      }
      const filterRooms = hostelData?.rooms.filter((room) => room?.floorNumber === selectedFloor);
      setFloorRooms(filterRooms);
    }
    filterRoomsFloorWise();
  }, [selectedFloor, hostelData]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [token, toast])
  );

  useEffect(() => {
    const date = new Date(selectedDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    setDateFormat(formattedDate);
  }, [selectedDate]);

  const findStatus = (presentDays, absentDays) => {
    const isMarkedPresent = presentDays.includes(dateFormat);
    const isMarkedAbsent = absentDays.includes(dateFormat);
    if(isMarkedPresent){
      return "PRESENT"
    }else if(isMarkedAbsent){
      return "ABSENT"
    }else{
      return "NM"
    }
  }

  const handleMarkPresent = async(id) => {
    if(dateFormat){
      setIsButtonDisabled(true);
      const response = await dispatch(markStudentPresent(dateFormat,id,token,toast));
      if(response){
        fetchData();
      }
      setIsButtonDisabled(false);
    }
  }

  const handleMarkAbsent = async(id) => {
    if(dateFormat){
      setIsButtonDisabled(true);
      const response = await dispatch(markStudentAbsent(dateFormat,id,token,toast));
      if(response){
        fetchData();
      }
      setIsButtonDisabled(false);
    }
  }

  const handleUnmarkPresent = async(id) => {
    if(dateFormat){
      setIsButtonDisabled(true);
      const response = await dispatch(unmarkStudentPresent(dateFormat,id,token,toast));
      if(response){
        fetchData();
      }
      setIsButtonDisabled(false);
    }
  }

  const handleUnmarkAbsent = async(id) => {
    if(dateFormat){
      setIsButtonDisabled(true);
      const response = await dispatch(unmarkStudentAbsent(dateFormat,id,token,toast));
      if(response){
        fetchData();
      }
      setIsButtonDisabled(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {
        !hostelData ? (
          <Text style={styles.noHostelText}>No Hostel Block Assigned</Text>
        ) : (
          <View style={styles.hostelContainer}>
            <View style={styles.hostelHeader}>
              <Text style={styles.hostelText}>Assigned Hostel Block: {hostelData?.name}</Text>
            </View>
            {
              floorCount !== null && (
                <View style={styles.floorSelectionContainer}>
                  <Text style={styles.selectFloorText}>Select Floor: </Text>
                  <View style={styles.floorButtonsContainer}>
                    {
                      floorsArray?.map((floor, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => setSelectedFloor(floor?.id)}
                          style={[
                            styles.floorButton,
                            selectedFloor === floor?.id && styles.selectedFloorButton
                          ]}
                        >
                          <Text style={styles.floorButtonText}>{floor?.id}</Text>
                        </TouchableOpacity>
                      ))
                    }
                  </View>
                </View>
              )
            }
            <View style={styles.subFormView}>
              <View style={styles.datePickerContainer}>
                  {/* <MainButton backgroundColor={"#a9d6e5"} text={"Select Date"} onPress={() => setIsDatePickerOpen(true)} /> */}
                  {/* <DatePicker
                    modal
                    mode='date'
                    locale='en'
                    maximumDate={new Date()}
                    open={isDatePickerOpen}
                    date={selectedDate || new Date()}
                    onConfirm={(date) => {
                      setIsDatePickerOpen(false);
                      setSelectedDate(date);
                    }}
                    onCancel={() => {
                      setIsDatePickerOpen(false);
                    }}
                  /> */}
                  <Text style={styles.selectedDateText}>Today : {selectedDate?.toLocaleDateString() || 'No date selected'}</Text>
              </View>
            </View>
            {
              selectedFloor !== null && selectedDate && floorRooms?.map((room, index) => (
                <View key={index} style={styles.roomContainer}>
                  <Text style={styles.roomText}>Room {room?.roomNumber}</Text>
                  <View style={styles.cotsContainer}>
                    {
                      room.cots.map((cot, cotIndex) => (
                        cot?.status === "BOOKED" && cot?.student !== null && cot?.student?.attendence !== null && (
                          <View key={cotIndex} style={{backgroundColor:findStatus(cot?.student?.attendence?.presentDays,cot?.student?.attendence?.absentDays)==="NM"?"transparent" : findStatus(cot?.student?.attendence?.presentDays,cot?.student?.attendence?.absentDays)==="PRESENT" ? "#b5e48c" : "#ffccd5", gap:5, display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", width:"100%", marginHorizontal:"auto", borderColor:"black", borderWidth:1, borderStyle:"dotted", borderRadius:15, padding:10 }}>
                            <View key={cotIndex} style={{maxWidth:"70%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:2}} >
                              <Text style={{color:"black", fontWeight:"700", fontSize:18}}>Cot {cot?.cotNo}</Text>
                              <Text style={{color:"black", fontWeight:"500", fontSize:16}}>{cot?.student?.name}</Text>
                              <Text style={{color:"black", fontWeight:"500", fontSize:16}}>{cot?.student?.rollNo}</Text>
                            </View>
                            <View>
                              {
                                findStatus(cot?.student?.attendence?.presentDays,cot?.student?.attendence?.absentDays)==="NM" ? (
                                  <View style={{display:"flex", flexDirection:"row", justifyContent:"flex-end", alignItems:"center", gap:10}}>
                                    <TouchableOpacity disabled={isButtonDisabled} onPress={() => handleMarkPresent(cot?.student?.attendence?.id)} style={{borderWidth:1, borderColor:"black", backgroundColor:"#b5e48c", paddingHorizontal:9, paddingVertical:4, borderRadius:20, display:"flex", justifyContent:"center", alignItems:"center", opacity:isButtonDisabled?0.5:1}}>
                                      <Text style={{color:"black", fontWeight:"700", fontSize:15}}>P</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled={isButtonDisabled} onPress={() => handleMarkAbsent(cot?.student?.attendence?.id)} style={{borderWidth:1, borderColor:"black", backgroundColor:"#ffccd5", paddingHorizontal:9, paddingVertical:4, borderRadius:20, display:"flex", justifyContent:"center", alignItems:"center", opacity:isButtonDisabled?0.5:1}}>
                                      <Text style={{color:"black", fontWeight:"700", fontSize:15}}>A</Text>
                                    </TouchableOpacity>
                                  </View>
                                ) : (
                                  findStatus(cot?.student?.attendence?.presentDays,cot?.student?.attendence?.absentDays)==="PRESENT" ? (
                                    <TouchableOpacity disabled={isButtonDisabled} onPress={() => handleUnmarkPresent(cot?.student?.attendence?.id)} style={{borderWidth:1, borderColor:"black", backgroundColor:"white", paddingHorizontal:8, paddingVertical:8, borderRadius:20, display:"flex", justifyContent:"center", alignItems:"center", opacity:isButtonDisabled?0.5:1}}>
                                      <Text style={{color:"black", fontWeight:"700", fontSize:15}}>UP</Text>
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity disabled={isButtonDisabled} onPress={() => handleUnmarkAbsent(cot?.student?.attendence?.id)} style={{borderWidth:1, borderColor:"black", backgroundColor:"white", paddingHorizontal:8, paddingVertical:8, borderRadius:20, display:"flex", justifyContent:"center", alignItems:"center", opacity:isButtonDisabled?0.5:1}}>
                                      <Text style={{color:"black", fontWeight:"700", fontSize:15}}>UA</Text>
                                    </TouchableOpacity>
                                  )
                                )
                              }
                            </View>
                          </View>
                        )
                      ))
                    }
                  </View>
                </View>
              ))
            }
          </View>
        )
      }
    </ScrollView>
  )
}

export default TakeAttendance

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20
  },
  noHostelText: {
    textAlign: "center",
    color: "black",
    fontSize: 16,
    fontWeight: "600"
  },
  hostelContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  },
  hostelHeader: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  hostelText: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700"
  },
  floorSelectionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  },
  selectFloorText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16
  },
  floorButtonsContainer: {
    display: "flex",
    maxWidth: "70%",
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center"
  },
  floorButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 1000,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'black'
  },
  selectedFloorButton: {
    backgroundColor: '#b5e48c',
    borderColor: 'transparent'
  },
  floorButtonText: {
    color: 'black',
    fontWeight: '700',
  },
  subFormView: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'start',
    gap: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  requiredMark: {
    fontSize: 10,
    color: 'red'
  },
  datePickerContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    justifyContent: "space-between",
    alignItems: "center"
  },
  selectedDateText: {
    color:"black",
    fontWeight: "800",
    fontSize: 15
  },
  roomContainer: {
    width: "100%",
    borderStyle: "dashed",
    marginHorizontal: "auto",
    gap: 20,
    borderWidth: 2.5,
    borderColor: "black",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  roomText: {
    textAlign: "center",
    fontWeight: "800",
    color: "#1b263b",
    fontSize: 18
  },
  cotsContainer: {
    width:"100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10
  }
});