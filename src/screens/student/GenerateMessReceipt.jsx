import React, { useCallback, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from 'react-native-toast-notifications';
import { useFocusEffect } from '@react-navigation/native';
import { fetchMessHallsAndStudentGender, generateMessSessionReceipt } from '../../services/operations/StudentAPI';
import ModalDropdown from 'react-native-modal-dropdown';
import MainButton from '../../components/common/MainButton';

const GenerateMessReceipt = ({navigation}) => {

  const [messHalls, setMessHalls] = useState(null);
  const [selectedMessHallName, setSelectedMessHallName] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const dispatch = useDispatch();
  const toast = useToast();
  const {token} = useSelector((state) => state.Auth);

  const [currentDate, setCurrentDate] = useState(null);
  const [sessionDate, setSessionDate] = useState(null);
  const [displaySession, setDisplaySession] = useState('');

  const findSession = () => {
    const now = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' };
    const localDate = now.toLocaleDateString('en-CA', options).split('/').reverse().join('-');
    
    setCurrentDate(localDate); 
    setSessionDate(localDate); 

    const currentHour = now.getHours();

    if(currentHour >= 0 && currentHour < 10){
      setDisplaySession("Breakfast");
    }else if(currentHour >= 10 && currentHour < 15){
      setDisplaySession("Lunch");
    }else if(currentHour >= 15 && currentHour < 18){
      setDisplaySession("Snacks");
    }else{
      setDisplaySession("Dinner");
    }
  }

  const fetchData = async() => {
    const response = await dispatch(fetchMessHallsAndStudentGender(token,toast));
    if(response){
      const filteredMessHalls = response?.messHalls.filter((messHall) => messHall?.gender===response?.studentDetails?.gender);
      setMessHalls(filteredMessHalls);
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      findSession();
      fetchData();
    }, [toast])
);

  const handleGenerate = async() => {
    if(!selectedMessHallName){
      toast.show("Select A Mess Hall", {type : "warning"});
      return;
    }
    if(!sessionDate || !displaySession){
      toast.show("Something Went Wrong", {type : "warning"});
      return;
    }

    setIsButtonDisabled(true);

    let formData = new FormData();
    formData.append("session",displaySession);
    formData.append("date",sessionDate);
    formData.append("messHallName",selectedMessHallName);

    const response = await dispatch(generateMessSessionReceipt(formData,token,toast));
    if(response){
      navigation.navigate("Mess Receipts History");
    }

    setIsButtonDisabled(false);
  }

  return (
    <ScrollView contentContainerStyle={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:15}}>
        {
          loading ? (<Text style={{color:"black", fontSize:15, fontWeight:"700", textAlign:"center"}}>Please Wait...</Text>) : (
            <View style={styles.form}>
              <View style={{width:"100%", backgroundColor:"#d8f3dc", borderRadius:20, paddingHorizontal:15, paddingVertical:15}}>
                  <Text style={{textAlign:"center", fontSize:15, color:"black"}}>Please select the Mess Hall where you would like to have your meals for this session. Once the receipt is generated, you will be able to avail meals for this session only at your selected Mess Hall, and only once. Kindly note that this receipt can only be generated once per session.</Text>
              </View>
              <View style={styles.subFormView}>
                  <Text style={styles.label}>Mess Hall <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                  <ModalDropdown
                      options={messHalls.map((mess) => mess?.hallName)}
                      style={styles.dropDownStyle}
                      dropdownStyle={styles.dropdownOptions}
                      dropdownTextStyle={{ color: "black", fontSize: 14, fontWeight: "600" }}
                      dropdownTextHighlightStyle={{ backgroundColor: "#caf0f8" }}
                      textStyle={{ color: "black", fontSize: 14, paddingHorizontal: 10 }}
                      saveScrollPosition={false}
                      // defaultIndex={0}
                      isFullWidth={true}
                      onSelect={(index) => {
                          setSelectedMessHallName(messHalls[index]?.hallName) 
                      }}
                      defaultValue="Select Mess Hall"
                  />
              </View>
              <View>
                <Text style={styles.label}>Date: <Text style={{fontWeight:"600", color:"#6c757d"}}> {currentDate}</Text></Text>
                <Text style={styles.label}>Session:<Text style={{fontWeight:"600", color:"#6c757d"}}> {displaySession}</Text></Text>
              </View>
              <MainButton isButtonDisabled={isButtonDisabled} text={"Generate"} onPress={handleGenerate} />
            </View>
          )
        }
    </ScrollView>
  )
}

export default GenerateMessReceipt

const styles = StyleSheet.create({
  subFormView:{
        display:'flex',
        justifyContent:'center',
        flexDirection:'column',
        alignItems:'start',
        gap:2,
    },
    form:{
        width:"90%",
        display:'flex',
        justifyContent:'center',
        alignItems:'start',
        flexDirection:'column',
        gap:20,
    },
    label:{
        fontSize:16,
        fontWeight:'500',
        color:'#000000',
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
})