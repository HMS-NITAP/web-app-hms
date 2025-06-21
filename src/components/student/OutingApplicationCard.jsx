import React, { useState } from 'react'
import { Text, TouchableOpacity, View, Modal, StyleSheet, Image, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useDispatch } from 'react-redux';
import { deletePendingOutingApplication, markReturnFromOuting } from '../../services/operations/StudentAPI';
import MainButton from '../common/MainButton';

const OutingApplicationCard = ({application,token,toast,fetchData}) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [markReturnModalOpen, setMarkReturnModalOpen] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const dispatch = useDispatch();

    const getDateFormat = (date) => {
        const newDate = new Date(date);
        return newDate.toLocaleString();
    }

    const handleConfirmDelete = async() => {
      setIsButtonDisabled(true);
        const response = await dispatch(deletePendingOutingApplication(application?.id,token,toast));
        if(response){
            fetchData();
        }
        setIsButtonDisabled(false);
    }

    const handleMarkReturn = async() => {
      setIsButtonDisabled(true);
      const response = await dispatch(markReturnFromOuting(application?.id,token,toast));
      if(response){
        fetchData();
      }
      setIsButtonDisabled(false);
    }

  return (
    <View style={{width:"100%",padding: 16,marginVertical: 8,backgroundColor: '#f9f9f9',borderRadius: 8,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1, borderColor:"black", borderWidth:1,shadowRadius: 8,elevation: 10}}>
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

        {
          application?.status === "INPROGRESS" && (
            <View style={{marginTop:15, display:"flex", justifyContent:"center", alignItems:"center"}}><MainButton isButtonDisabled={isButtonDisabled} onPress={() => setMarkReturnModalOpen(true)} backgroundColor={"#95d5b2"} text={"Mark Return"}  /></View>
          )
        }

        {
            application?.status === "PENDING" && (
                <View style={{marginTop:15}}>
                    <TouchableOpacity 
                        disabled={isButtonDisabled}
                        style={[styles.trashButton,{opacity:isButtonDisabled?0.5:1}]} 
                        onPress={() => setModalVisible(true)}
                        >
                        <Icon name='trash' size={25} style={styles.icon} color='#c1121f' />
                    </TouchableOpacity>
                </View>
            )
        }

        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Are you sure you want to delete this Outing Application?</Text>
                    <View style={styles.modalButtons}>
                    <TouchableOpacity 
                        disabled={isButtonDisabled}
                        style={[styles.confirmButton,{opacity:isButtonDisabled?0.5:1}]} 
                        onPress={handleConfirmDelete}
                    >
                        <Text style={styles.buttonText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        disabled={isButtonDisabled}
                        style={[styles.cancelButton,{opacity:isButtonDisabled?0.5:1}]} 
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
                visible={markReturnModalOpen}
                onRequestClose={() => setMarkReturnModalOpen(false)}
            >
                <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>Are you sure, you want to log return from vacation?</Text>
                    <View style={styles.modalButtons}>
                    <TouchableOpacity 
                        disabled={isButtonDisabled}
                        style={{flex: 1, backgroundColor: "#52b788", padding: 10, borderRadius: 5, alignItems: "center", marginRight: 10, opacity:isButtonDisabled?0.5:1}} 
                        onPress={handleMarkReturn}
                    >
                        <Text style={styles.buttonText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        disabled={isButtonDisabled}
                        style={[styles.cancelButton,{opacity:isButtonDisabled?0.5:1}]} 
                        onPress={() => setMarkReturnModalOpen(false)}
                    >
                        <Text style={styles.buttonText}>No</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                </View>
            </Modal>
        </>
    </View>
  )
}

export default OutingApplicationCard

const styles = StyleSheet.create({
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
    textAlign: "center",
    color:"black",
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
})