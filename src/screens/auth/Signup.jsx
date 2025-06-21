import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import MainButton from '../../components/common/MainButton'
import { RadioButton } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import {useDispatch} from 'react-redux';
import { setSignUpData } from '../../reducers/slices/AuthSlice'
import { sendOTP } from '../../services/operations/AuthAPI'
import { AccountType } from '../../static/AccountType'
import { useToast } from "react-native-toast-notifications";
import Icon from 'react-native-vector-icons/FontAwesome6';

const Signup = ({navigation}) => {

  const toast = useToast();

  const { control,setValue, handleSubmit, formState: { errors } } = useForm();

  const [accountType, setAccountType] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    setValue("email","");
    setValue("password","");
    setValue("confirmPassword","");
    setAccountType("");
  }, []);

  const handleRadioPress = (value) => {
    setAccountType(value);
  };

  const handlePress = () => {
    navigation.navigate("Login");
  };

  const onSubmit = async(data) => {
    if(data.password != data.confirmPassword){
      toast.show("Both passwords are not Matching", {type: "danger"});
    }else{
      const signupData = {
        ...data,accountType
      }
      toast.show("Please Wait...",{type: "normal"});
      await dispatch(setSignUpData(signupData));
      await dispatch(sendOTP(data.email,navigation,toast));
    }
  };

  const [secureText1, setSecureText1] = useState(true);
  const [secureText2, setSecureText2] = useState(true);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.form}>
          <View style={styles.subFormView}>
            <Text style={styles.label}>Email ID<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter your college Email ID"
                  placeholderTextColor={"#adb5bd"}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="email"
              defaultValue=""
            />
            {errors.email && <Text style={styles.errorText}>Email is required.</Text>}
          </View>
          <View style={styles.subFormView}>
            <Text style={styles.label}>Password<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={"#adb5bd"}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={secureText1}
                  />
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => setSecureText1(!secureText1)}
                  >
                    <Icon name={secureText1 ? 'eye-slash' : 'eye'} size={20} color="#adb5bd" />
                  </TouchableOpacity>
                </>
              )}
              name="password"
              defaultValue=""
            />
            {errors.password && <Text style={styles.errorText}>Password is required.</Text>}
          </View>
          <View style={styles.subFormView}>
            <Text style={styles.label}>Confirm Password<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Re-Enter your password"
                    placeholderTextColor={"#adb5bd"}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={secureText2}
                  />
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => setSecureText2(!secureText2)}
                  >
                    <Icon name={secureText2 ? 'eye-slash' : 'eye'} size={20} color="#adb5bd" />
                  </TouchableOpacity>
                </>
              )}
              name="confirmPassword"
              defaultValue=""
            />
            {errors.confirmPassword && <Text style={styles.errorText}>Please confirm your password.</Text>}
          </View>
          <View style={styles.subFormView}>
            <Text style={styles.label}>Account Type<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
            <View style={styles.radioGroup}>
              {
                AccountType.map((account,index) => (
                <View key={index} style={styles.radioButtonContainer}>
                  <RadioButton.Android
                    value={account.value}
                    status={accountType === account.value ? 'checked' : 'unchecked'}
                    onPress={() => handleRadioPress(account.value)}
                  />
                  <Text style={styles.radioLabel}>{account.name}</Text>
                </View>
              ))
              }
            </View>
          </View>
          <View style={styles.subFormView}>
            <MainButton text="Sign Up" onPress={handleSubmit(onSubmit)} />
          </View>
        </View>
        <Text style={styles.createAccount} onPress={handlePress}>Already have an Account? Click Here</Text>
      </View>
    </>
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
  headingText:{
    fontSize:30,
    fontWeight:"700",
    color:"black",
  },
  form:{
    paddingTop:60,
    paddingBottom:30,
    width:"90%",
    display:'flex',
    justifyContent:'center',
    alignItems:'start',
    flexDirection:'column',
    gap:20,
  },
  subFormView:{
    width:"100%",
    display:'flex',
    justifyContent:'center',
    flexDirection:'column',
    alignItems:'start',
    gap:0,
  },
  label:{
    fontSize:15,
    fontWeight:'500',
    color:'#000000',
    marginBottom:10,
  },
  input:{
    width:"100%",
    padding:10,
    paddingHorizontal:10,
    borderWidth:1,
    borderRadius:10,
    borderColor:"#adb5bd",
    color:"black",
  },
  button:{
    textAlign:'center',
    borderRadius:30,
    fontSize:15,
    fontWeight:'800',
    color:"black"
  },
  createAccount:{
    textAlign:'center',
    fontSize:15,
    fontWeight:'500',
    color:"#4a4e69",
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap:"wrap",
  },
  radioButtonContainer: {
    display:"flex",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"flex-start",
    flexWrap:"wrap",
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 5,
    color:"black"
  },
  errorText:{
    fontSize:14,
    color:"red",
  },
  iconContainer: {
    position:"absolute",
    bottom: Platform.OS === 'ios' ? 10 : 15,
    right:10,
    zIndex:10,
    elevation:100,
  },
})

export default Signup