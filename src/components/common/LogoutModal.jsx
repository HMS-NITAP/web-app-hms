import React from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch } from 'react-redux';
import { logout } from '../../services/operations/AuthAPI';

const LogoutModal = ({logoutModalVisible,setLogoutModalVisible,animationType,transparent}) => {

  const dispatch = useDispatch();
  const toast = useToast();

  const handleConfirmLogout = async() => {
    await dispatch(logout(toast));
    setLogoutModalVisible(false);
  };
  const handleCancelLogout = () => {
      setLogoutModalVisible(false);
  };

  return (
        <Modal
              animationType={animationType}
              transparent={transparent}
              visible={logoutModalVisible}
              onRequestClose={handleCancelLogout}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalText}>Are you sure you want to log out?</Text>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity 
                      style={styles.confirmButton} 
                      onPress={handleConfirmLogout}
                    >
                      <Text style={styles.buttonText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.cancelButton} 
                      onPress={handleCancelLogout}
                    >
                      <Text style={styles.buttonText}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
        </Modal>
  )
}

export default LogoutModal

const styles = StyleSheet.create({
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
      color:"black",
      fontWeight:"700",
      textAlign: "center"
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%"
    },
    confirmButton: {
      flex: 1,
      backgroundColor: "#55a630",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      marginRight: 10
    },
    cancelButton: {
      flex: 1,
      backgroundColor: "#14213d",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      marginLeft: 10
    },
    buttonText: {
      color: "white",
      fontSize: 16
    }
  });