import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, Modal, StyleSheet, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useDispatch } from 'react-redux';
import { addWardenToHostelBlock, deleteOfficialAccount, fetchAllHostelBlocksData, removeWardenFromHostelBlock } from '../../services/operations/AdminAPI';
import ModalDropdown from 'react-native-modal-dropdown';

const OfficialCard = ({ data,token,toast,fetchData }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [hostelData, setHostelData] = useState([]);
  const [selectedHostelBlock, setSelectedHostelBlock] = useState(null);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const dispatch = useDispatch();

  const handleConfirmDelete = async() => {
    setModalVisible(false);
    dispatch(deleteOfficialAccount(data?.id,token,toast));
    fetchData();
  };

  useEffect(() => {
    const fetchHostelBlocks = async() => {
      const response = await dispatch(fetchAllHostelBlocksData(token, toast));
      setHostelData(response);
    };
    if(editModalVisible){
      fetchHostelBlocks();
    }
  },[editModalVisible]);

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleUnallocate = async() => {
    setIsButtonDisabled(true);
    let formData = new FormData();
    formData.append("removeWardenId",data?.id);
    formData.append("hostelBlockId",data?.hostelBlock?.id);
    try{
      await dispatch(removeWardenFromHostelBlock(formData, token, toast));
    }catch(error) {
      console.log("Error in handleUnallocate:", error);
    }finally{
      fetchData();
      setEditModalVisible(false);
      setIsButtonDisabled(false);
    }
  };

  const handleAllocate = async() => {
    setIsButtonDisabled(true);
    let formData = new FormData();
    formData.append("newWardenId",data?.id);
    formData.append("hostelBlockId",selectedHostelBlock);
    try{
      await dispatch(addWardenToHostelBlock(formData, token, toast));
    }catch(error) {
      console.log("Error in handleAllocate:", error);
    }finally{
      fetchData();
      setEditModalVisible(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={{maxWidth:"80%",display:"flex", justifyContent:"flex-start"}}>
        <Text style={{color:"black", fontWeight:"600", fontSize:16}}>User ID : <Text style={{color:"black", fontWeight:"500", fontSize:15}}>{data.user.id}</Text></Text>
        <Text style={{color:"black", fontWeight:"600", fontSize:16}}>Name : <Text style={{color:"black", fontWeight:"500", fontSize:15}}>{data.name}</Text></Text>
        <Text style={{color:"black", fontWeight:"600", fontSize:16}}>Designation : <Text style={{color:"black", fontWeight:"500", fontSize:15}}>{data.designation}</Text></Text>
        <Text style={{color:"black", fontWeight:"600", fontSize:16}}>Email ID : <Text style={{color:"black", fontWeight:"500", fontSize:15}}>{data.user.email}</Text></Text>
        <Text style={{color:"black", fontWeight:"600", fontSize:16}}>Gender : <Text style={{color:"black", fontWeight:"500", fontSize:15}}>{data.gender === 'M' ? "Male" : "Female"}</Text></Text>
        <Text style={{color:"black", fontWeight:"600", fontSize:16}}>Mobile No. : <Text style={{color:"black", fontWeight:"500", fontSize:15}}>{data.phone}</Text></Text>
        {
          data?.hostelBlockId ? 
            <Text style={{color:"green", fontWeight:"600", fontSize:17}}>Allotted Hostel Block : <Text style={{color:"green", fontWeight:"500", fontSize:16}}>{data.hostelBlock.name}</Text></Text>
            :
            <Text style={{color:"red", fontWeight:"600", fontSize:17}}>No Hostel Block Allotted</Text>

        }
      </View>
      <View style={{maxWidth:"20%", display:"flex", flexDirection:"column", gap:20}}>
        {/* <TouchableOpacity 
          style={styles.trashButton} 
          onPress={() => setModalVisible(true)}
        >
          <Icon name='trash' size={25} style={styles.icon} color='#c1121f' />
        </TouchableOpacity> */}
        {
          data?.hostelBlockId ? 
            <TouchableOpacity 
                style={styles.editButton} 
                onPress={handleEdit}
                >
                <Icon name='building-circle-xmark' size={25} style={styles.icon} color='#081c15' />
            </TouchableOpacity>
            :
            <TouchableOpacity 
                style={styles.editButton} 
                onPress={handleEdit}
                >
                <Icon name='building-circle-check' size={25} style={styles.icon} color='#081c15' />
            </TouchableOpacity>
        }
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Are you sure, you want to delete this Official Account?</Text>
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
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {
              data?.hostelBlockId ? (
                <>
                  <Text style={styles.modalText}>Are you sure, you want to unallocate this Official from the hostel block?</Text>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.confirmButton, {opacity:isButtonDisabled?0.5:1}]}
                      isButtonDisabled={isButtonDisabled}
                      onPress={handleUnallocate}
                    >
                      <Text style={styles.buttonText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.cancelButton, {opacity:isButtonDisabled?0.5:1}]}
                      isButtonDisabled={isButtonDisabled}
                      onPress={() => setEditModalVisible(false)}
                    >
                      <Text style={styles.buttonText}>No</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.modalText}>Allocate a Hostel Block</Text>
                  <ScrollView contentContainerStyle={{marginBottom:15}}>
                    <ModalDropdown
                      options={hostelData.map(hostel => hostel.name)}
                      style={styles.dropDownStyle}
                      dropdownStyle={styles.dropdownOptions}
                      dropdownTextStyle={{color:"black", fontSize:14, fontWeight:"600"}}
                      dropdownTextHighlightStyle={{backgroundColor:"#caf0f8"}}
                      textStyle={{color:"black", fontSize:14, paddingHorizontal:10}}
                      saveScrollPosition={false}
                      // defaultIndex = {0}
                      isFullWidth={true}
                      onSelect={(index, value) => setSelectedHostelBlock(hostelData[index].id)}
                      defaultValue="Select Hostel Block"
                    />
                  </ScrollView>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.confirmButton, {opacity:isButtonDisabled?0.5:1}]}
                      isButtonDisabled={isButtonDisabled}
                      onPress={handleAllocate}
                    >
                      <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.cancelButton, {opacity:isButtonDisabled?0.5:1}]}
                      isButtonDisabled={isButtonDisabled}
                      onPress={() => setEditModalVisible(false)}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )
            }
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    height:"auto",
    backgroundColor:"white",
    elevation:10,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    paddingHorizontal: 10,
    paddingVertical: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10
  },
  trashButton: {
    borderColor: "#c1121f",
    borderWidth: 1,
    borderRadius: 1000,
    paddingHorizontal: 10,
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
  dropDownStyle : {
        paddingVertical:10,
        borderWidth:1,
        borderRadius:10,
        borderColor:"#adb5bd",
  },
  dropdownOptions: {
      paddingHorizontal:10,
      paddingVertical:10,
      marginTop: 10,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: '#adb5bd',
      backgroundColor: '#ffffff',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
  },
});

export default OfficialCard;
