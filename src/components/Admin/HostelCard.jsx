import React, { useState } from 'react'
import { Text, TouchableOpacity, View, Modal, StyleSheet, Image, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useDispatch } from 'react-redux';
import { deleteHostelBlock } from '../../services/operations/AdminAPI';

const HostelCard = ({ data,token,toast,fetchData }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleConfirmDelete = async() => {
    setModalVisible(false);
    await dispatch(deleteHostelBlock(data?.id,token,toast));
    fetchData();
  };


  return (
    <View style={styles.card}>
        <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingBottom:10}}>
            <View style={styles.imageContainer}>
                {isLoading && (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
                )}
                <Image 
                    source={{ uri: data.image }} 
                    style={styles.image} 
                    onLoadStart={() => setIsLoading(true)}
                    onLoad={() => setIsLoading(false)}
                />
            </View>
            <View style={{display:"flex", justifyContent:"flex-start"}}>
                <Text style={{color:"black", fontWeight:"600", fontSize:16}}>Name : <Text style={{color:"black", fontWeight:"500", fontSize:18}}>{data.name}</Text></Text>
                <Text style={{color:"black", fontWeight:"600", fontSize:16}}>Capacity : <Text style={{color:"black", fontWeight:"500", fontSize:15}}>{data.capacity} students</Text></Text>
                <Text style={{color:"black", fontWeight:"600", fontSize:16}}>Room Type : <Text style={{color:"black", fontWeight:"500", fontSize:15}}>{data.roomType}</Text></Text>
                <Text style={{color:"black", fontWeight:"600", fontSize:16}}>Floor Count : <Text style={{color:"black", fontWeight:"500", fontSize:15}}>{data.floorCount === "2" ? "G+2" : "G+4"}</Text></Text>
                <Text style={{color:"black", fontWeight:"600", fontSize:16}}>Gender : <Text style={{color:"black", fontWeight:"500", fontSize:15}}>{data.gender === 'M' ? "Male" : "Female"}</Text></Text>
                <Text style={{color:"black", fontWeight:"600", fontSize:16}}>Year Assigned to : <Text style={{color:"black", fontWeight:"500", fontSize:15}}>{data.year}</Text></Text>
            </View>
        </View>
        {
          data?.wardens.length === 0 ? <View style={{width:"100%", justifyContent:"center"}}><Text style={{textAlign:"center", fontWeight:"700", fontSize:15, color:"#c1121f"}}>No Warden Assigned</Text></View>
            :
            <View>
              <Text style={{fontSize:16, fontWeight:"800", color:"#14213d", marginBottom:5}}>Warden(s) :</Text>
              {
                data?.wardens.map((warden,index) => (
                  <Text style={{fontSize:15, fontWeight:"700",color:"#003554"}} selectable={true}>{index+1}) {warden.name}    ( +91 {warden.phone} )</Text>
                ))
              }
            </View>
        }

        {/* TO ADD DELETE FEATURE */}
        {/* <View>
            <TouchableOpacity 
                style={styles.trashButton} 
                onPress={() => setModalVisible(true)}
                >
                <Icon name='trash' size={25} style={styles.icon} color='#c1121f' />
            </TouchableOpacity>
        </View>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalText}>Are you sure you want to delete this Hostel Block?</Text>
                <View style={styles.modalButtons}>
                <TouchableOpacity 
                    style={styles.confirmButton} 
                    onPress={handleConfirmDelete}
                >
                    <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => setModalVisible(false)}
                >
                    <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
                </View>
            </View>
            </View>
        </Modal> */}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor:"white",
    elevation:10,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    paddingHorizontal: 10,
    paddingVertical: 15,
    display: "flex",
    flexDirection: "colomn",
    justifyContent: "center",
    alignItems: "stretch",
    gap: 10
  },
  trashButton: {
    borderColor: "#c1121f",
    borderWidth: 0.5,
    borderRadius: 1000,
    paddingHorizontal: "auto",
    justifyContent:"center",
    alignItems:"center",
    paddingVertical: 10,
    backgroundColor: "#ffccd5"
  },
  editButton: {
    borderColor: "#081c15",
    borderWidth: 1,
    borderRadius: 1000,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#d8f3dc"
  },
  icon: {
    width: 30,
    textAlign: 'center'
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
    alignItems: "center"
  },
  modalText: {
    marginBottom: 20,
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
    backgroundColor: "#c1121f",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10
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
  imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 120,
        height: 120,
    },
    loadingIndicator: {
        position: 'absolute',
        zIndex: 1,
    },
});

export default HostelCard;
