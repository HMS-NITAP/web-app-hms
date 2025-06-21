import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import MainButton from '../../components/common/MainButton';
import { RadioButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { createOfficialAccount } from '../../services/operations/AdminAPI';

const CreateOfficialAccount = () => {

    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.Auth);
    const toast = useToast();

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const [selectedGender, setSelectedGender] = useState('M');

    const submitHandler = async (data) => {
        setIsButtonDisabled(true);
        let formData = new FormData();
        formData.append("email",data.email);
        formData.append("password",data.password);
        formData.append("name",data.name);
        formData.append("designation",data.designation);
        formData.append("gender",selectedGender);
        formData.append("phone",data.phone);
        await dispatch(createOfficialAccount(formData,token,toast));
        reset();
        setIsButtonDisabled(false);
    };

    const [secureText,setSecureText] = useState(true);

  return (
    <ScrollView >
        <View style={styles.container}>
            <View style={styles.form}>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Official Email ID <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Email ID"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="email"
                        defaultValue=""
                    />
                    {errors.email && <Text style={styles.errorText}>Official Email ID is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Password<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter a Password"
                                    placeholderTextColor={"#adb5bd"}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    secureTextEntry={secureText}
                                />
                                <TouchableOpacity
                                    style={styles.iconContainer}
                                    onPress={() => setSecureText(!secureText)}
                                >
                                    <Icon name={secureText ? 'eye-slash' : 'eye'} size={20} color="#adb5bd" />
                                </TouchableOpacity>
                            </>
                        )}
                        name="password"
                        defaultValue=""
                    />
                    {errors.password && <Text style={styles.errorText}>Password is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Name <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter official name"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="name"
                        defaultValue=""
                    />
                    {errors.name && <Text style={styles.errorText}>Name is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Designation <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter designation"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="designation"
                        defaultValue=""
                    />
                    {errors.designation && <Text style={styles.errorText}>Designation is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label}>Gender <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange } }) => (
                            <View style={styles.radioContainer}>
                                <View style={styles.radioOption}>
                                    <RadioButton.Android
                                        value="M"
                                        status={selectedGender === 'M' ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            onChange('M');
                                            setSelectedGender('M');
                                        }}
                                    />
                                    <Text style={styles.radioLabel}>M</Text>
                                </View>
                                <View style={styles.radioOption}>
                                    <RadioButton.Android
                                        value="F"
                                        status={selectedGender === 'F' ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            onChange('F');
                                            setSelectedGender('F');
                                        }}
                                    />
                                    <Text style={styles.radioLabel}>F</Text>
                                </View>
                            </View>
                        )}
                        name="gender"
                        defaultValue="M"
                    />
                    {errors.gender && <Text style={styles.errorText}>Gender is required.</Text>}
                </View>


                <View style={styles.subFormView}>
                    <Text style={styles.label} >Phone Number <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="1234567890"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="phone"
                        defaultValue=""
                    />
                    {errors.phone && <Text style={styles.errorText}>Phone Number is required.</Text>}
                </View>

                <MainButton isButtonDisabled={isButtonDisabled} text={"Create Account"} onPress={handleSubmit(submitHandler)} />
            </View>
        </View>
        </ScrollView>
  )
}

export default CreateOfficialAccount

const styles = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
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
    radioContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    radioOption: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioLabel: {
        fontSize: 16,
        fontWeight:"700",
        color: '#000',
    },
    iconContainer: {
        position:"absolute",
        bottom: Platform.OS === 'ios' ? 10 : 15,
        right:10,
        zIndex:10,
        elevation:100,
    },
})