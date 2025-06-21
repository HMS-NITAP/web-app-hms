import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import MainButton from '../../components/common/MainButton';
import { setRegistrationStep } from '../../reducers/slices/AuthSlice';
import { useToast } from 'react-native-toast-notifications';
import ProgressIndicator from '../../components/common/ProgressIndicator';
import StudentRegistrationForm from '../../components/common/StudentRegistrationForm';
import OtpVerification from '../../components/common/OtpVerification';
import RoomAllotment from '../../components/common/RoomAllotment';
import AwaitingConfirmation from '../../components/common/AwaitingConfirmation';

const StudentRegistration = () => {

    const {registrationStep} = useSelector((state) => state.Auth);
    const dispatch = useDispatch();

    const toast = useToast();

  return (
    <ScrollView contentContainerStyle={{display:"flex", flexDirection:"column",justifyContent:"center",alignItems:"center", width:"100%", paddingVertical:20}}>
        <ProgressIndicator />

        <View style={{width:"95%", marginHorizontal:"auto", marginVertical:20, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", borderWidth:0, borderRadius:0, borderColor:"black", paddingHorizontal:0, paddingVertical:0}}>
            {
                registrationStep===1 && <StudentRegistrationForm />
            }
            {
                registrationStep===2 && <OtpVerification />
            }
            {
                registrationStep===3 && <RoomAllotment />
            }
            {
                registrationStep===4 && <AwaitingConfirmation />
            }
        </View>

        {/* <View style={{display:"flex", marginTop:40, flexDirection:"row", justifyContent:"center", gap:20}}>
            {
                registrationStep>1 && registrationStep<5 && <MainButton text={"Back"} onPress={handleBack} />
            }
            {
                registrationStep<5 && <MainButton text={"Next"} onPress={handleNext} />
            }
        </View> */}
        
    </ScrollView>
  )
}

export default StudentRegistration