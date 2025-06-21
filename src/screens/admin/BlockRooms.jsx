import { useFocusEffect, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { downloadStudentDetailsInHostelBlockXlsxFile, fetchRoomsInHostelBlock } from '../../services/operations/AdminAPI';
import Icon from 'react-native-vector-icons/FontAwesome6';

const BlockRooms = ({navigation}) => {

    const [roomData, setRoomsData] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [floorRooms, setFloorRooms] = useState(null);

    const route = useRoute();
    const {hostelBlockId,hostelBlockName,floorCount} = route.params;

    const floorsArray = Array.from({ length: floorCount + 1 }, (_, index) => ({
        id : index,
    }));

    const dispatch = useDispatch();
    const toast = useToast();
    const {token} = useSelector((state) => state.Auth);

    const fetchData = async() => {
        if(hostelBlockId){
            setRoomsData(null);
            const response = await dispatch(fetchRoomsInHostelBlock(hostelBlockId,token,toast));
            setRoomsData(response);
        }
    }

    useEffect(() => {
        const filterRoomsFloorWise = () => {
          if(!roomData){
            return;
          }
          const filterRooms = roomData.filter((room) => room?.floorNumber===selectedFloor);
          setFloorRooms(filterRooms);
        }
        filterRoomsFloorWise();
    },[selectedFloor,roomData]);

    useFocusEffect(
        useCallback(() => {
          fetchData();
        }, [hostelBlockId,token,toast])
    );

    const moveInsideRoom = (roomId) => {
        navigation.navigate("Cot Details",{roomId});
    }

    const downloadData = async() => {
      dispatch(downloadStudentDetailsInHostelBlockXlsxFile(hostelBlockId,token,toast));
    }

  return (
    <ScrollView contentContainerStyle={{width:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", paddingVertical:20}}>
        <Text style={{color:"black", fontWeight:"700", fontSize:22, textAlign:"center"}}>{hostelBlockName}</Text>
        <View style={{width:"90%", display:"flex", alignItems:"flex-end"}}><TouchableOpacity onPress={downloadData}><Icon name="file-arrow-down" color="grey" size={25} /></TouchableOpacity></View>
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
              (!floorRooms || floorRooms.length==0) ? (<View><Text style={{color:"red", fontSize:16, fontWeight:"500"}}>No Rooms Are Present With This Requirements</Text></View>) : (
                <View style={{width:"90%", display:"flex", flexDirection:"row", flexWrap:"wrap", gap:15, justifyContent:"center", alignItems:"center"}}>
                  {
                    floorRooms.map((room,index) => (
                      <TouchableOpacity onPress={() => moveInsideRoom(room?.id)} key={index} style={{borderStyle:"dotted", width:"30%", marginHorizontal:"auto", gap:20, borderWidth:1.5, borderColor:"black", borderRadius:10, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", paddingHorizontal:15, paddingVertical:15}}>
                        <Text style={{textAlign:"center", fontWeight:"800", color:"red", fontSize:15, color:"#1b263b"}}>Room {room?.roomNumber}</Text>
                      </TouchableOpacity>
                    ))
                  }
                </View>
              )
        }
    </ScrollView>
  )
}

export default BlockRooms

const styles = StyleSheet.create({
    filterContainer: {
      display:"flex",
      flexDirection: 'row',
      alignItems: 'center',
      gap:20,
      marginVertical:15,
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
    filterButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 5,
      marginHorizontal: 5,
    },
});