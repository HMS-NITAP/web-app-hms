import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MainButton from '../../components/common/MainButton'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../services/operations/AuthAPI'
import { useToast } from 'react-native-toast-notifications'

const LogoutModal = ({navigation}) => {
    
    const dispatch = useDispatch();
    const toast = useToast();

    const {user} = useSelector((state) => state.Profile);

    const logOutHandler = async() => {
        await(dispatch(logout(navigation,toast)));
    }

    const goBackHandler = async() => {
      if(user.accountType === "STUDENT"){
        navigation.navigate("StudentDashboard");
      }else if(user.accountType === "OFFICIAL"){
        navigation.navigate("CreateAnnouncement");
      }
    }


  return (
    <View style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:20,marginHorizontal:20,marginVertical:40}}>
        <Text style={{fontSize:20,fontWeight:"800",color:"black", textAlign:"center"}}>Do you want to logout from your Account? </Text>
        <View style={{display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center",gap:20}}>
            <MainButton text="Continue" onPress={logOutHandler} />
            <MainButton text="Go Back" backgroundColor={"#57cc99"} onPress={goBackHandler} />
        </View>
    </View>
  )
}

export default LogoutModal

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});