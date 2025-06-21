import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import MainButton from '../../components/common/MainButton'
import ModalDropdown from 'react-native-modal-dropdown';
import { useForm,Controller } from 'react-hook-form'
import DocumentPicker from 'react-native-document-picker';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { createHostelComplaint } from '../../services/operations/StudentAPI';

const RegisterComplaint = ({navigation}) => {
  const dropdownOptions = [
                            'General', 
                            'Food Issues',
                            'Electrical',
                            'Civil', 
                            'Room Cleaning',
                            'Restroom Cleaning',
                            'Network Issue', 
                            'Indisciplinary', 
                            'Discrimination',
                            'Harassment',
                            'Damage to Property'
                          ];

  const [category, setCategory] = useState('');
  const [fileResponse, setFileResponse] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const dispatch = useDispatch();
  const {token} = useSelector((state) => state.Auth);

  const { control, handleSubmit, formState: { errors }, reset } = useForm();
  const toast = useToast();

  const onSubmit = async(data) => {
    if(!category){
      toast.show("Select a Category",{type:"warning"});
      return;
    }
    if(data?.about === ""){
      toast.show("Give description of complaint",{type:"warning"});
      return;
    }

    setIsButtonDisabled(true);

    let formData = new FormData();
    formData.append("category",category);
    formData.append("about",data?.about);
    if(fileResponse){
      formData.append("file",{uri:fileResponse[0]?.uri, type:fileResponse[0]?.type, name:fileResponse[0]?.name});
    }
    const response = await dispatch(createHostelComplaint(formData,token,toast));
    if(response){
      setCategory(null);
      setFileResponse(null);
      reset();
      navigation.navigate("Complaints Registered");
    }
    setIsButtonDisabled(false);
  }

  const pickUpFile = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        // allowMultiSelection:true,
        presentationStyle: 'fullScreen',
      });
      setFileResponse(response);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  return (
    <View style={styles.container}>
        <View style={styles.form}>

        <View style={styles.subFormView}>
          <Text style={styles.label} >Category<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
          <ModalDropdown
            options={dropdownOptions}
            style={styles.dropDownStyle}
            dropdownStyle={styles.dropdownOptions}
            dropdownTextStyle={{color:"black", fontSize:14, fontWeight:"600"}}
            dropdownTextHighlightStyle={{backgroundColor:"#caf0f8"}}
            textStyle={{color:"black", fontSize:14, paddingHorizontal:10}}
            saveScrollPosition={false}
            defaultIndex = {0}
            isFullWidth={true}
            defaultValue="Pick A Category"
            onSelect={(_, value) => setCategory(value)}
          />
        </View>

        <View style={styles.subFormView}>
          <Text style={styles.label} >Description<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter the Description about the Complaint"
                placeholderTextColor={"#adb5bd"}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                numberOfLines={3}
              />
            )}
            name="about"
            defaultValue=""
          />
          {errors.about && <Text style={styles.errorText}>Description is required.</Text>}
        </View>
        <View style={styles.subFormView}>
          <Text style={styles.label}>
            Select Documents to Upload :
          </Text>
          <View style={{display:'flex', flexDirection:"row", width:"100%", justifyContent:"space-between", alignItems:"flex-start", gap:20}}>
            <MainButton text="Pick File" onPress={pickUpFile} />
            <View>
              {
                fileResponse && 
                  <View style={{maxWidth:"80%", display:"flex",flexDirection:'column',gap:8}}>
                    {fileResponse.map((file) => <Text style={{color:"black", fontWeight:"700"}}>{file?.name}</Text>)}
                  </View>
              }
            </View>
          </View>
        </View>
        <View style={styles.subFormView}>
          <MainButton isButtonDisabled={isButtonDisabled} text={"Generate Complaint"} onPress={handleSubmit(onSubmit)}/>
        </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
      display:'flex',
      flexDirection:'column',
      justifyContent:'start',
      alignItems:'center',
      width:'100%',
      height:'100%',
  },
  heading:{
      width:'100%',
      backgroundColor:'#ffb703',
      paddingVertical:15,
      textAlign:'center',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      fontSize:100,
  },
  subFormView:{
      width:"100%",
      display:'flex',
      justifyContent:'center',
      flexDirection:'column',
      alignItems:'start',
      gap:2,
  },
  form:{
      paddingTop:60,
      paddingBottom:30,
      width:"80%",
      display:'flex',
      justifyContent:'center',
      alignItems:'start',
      flexDirection:'column',
      gap:20,
  },
  label:{
      fontSize:15,
      fontWeight:'500',
      color:'#000000',
  },
  input:{
      width:"100%",
      padding:10,
      paddingHorizontal:10,
      borderWidth:1,
      borderRadius:10,
      borderColor:"#adb5bd",
      color: "black",
  },
  button:{
      textAlign:'center',
      borderRadius:30,
      fontSize:15,
      fontWeight:'800',
      color:"black"
  },
  dropdownOptions: {
    width: 250, // Set the same width as the dropdown
    padding:10,
    paddingHorizontal:10,
    borderWidth:1,
    borderRadius:10,
    borderColor:"#adb5bd",
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


export default RegisterComplaint