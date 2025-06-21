import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import MainButton from '../../components/common/MainButton';
import ModalDropdown from 'react-native-modal-dropdown';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { editStudentProfile } from '../../services/operations/StudentAPI';
import { useToast } from 'react-native-toast-notifications';

const EditProfile = ({ navigation }) => {
    const dropdownOptions1 = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    const dropdownOptions2 = [
        'CSE', 
        'ECE', 
        'EEE', 
        'MECH', 
        'BIOTECH', 
        'CIVIL', 
        'METALLURGY'
    ];
    const dropdownOptions3 = ['M', 'F'];
    const dropdownOptions4 = [
        { label: "True", value: true },
        { label: "False", value: false },
    ];

    const { control, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.Auth);
    const toast = useToast();

    const submitHandler = async (data) => {
        await dispatch(editStudentProfile(data,token,toast));
    };

  return (
    <ScrollView >
        <View style={styles.container}>
            <View style={styles.form}>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Name<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your name"
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
                    <Text style={styles.label} >Registration No<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Registration Number"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="regNo"
                        defaultValue=""
                    />
                    {errors.regNo && <Text style={styles.errorText}>Registration Number is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Roll No<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Roll Number"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="rollNo"
                        defaultValue=""
                    />
                    {errors.rollNo && <Text style={styles.errorText}>Roll Number is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Year<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange, onBlur, value } }) => (
                        <ModalDropdown
                            options={dropdownOptions1}
                            style={styles.input}
                            dropdownStyle={styles.dropdownOptions}
                            defaultValue="none"
                            onBlur={onBlur}
                            onSelect={(index) => onChange(dropdownOptions1[index])}
                            value={value}
                        />    
                        )}
                        name="year"
                        defaultValue=""
                    />
                    {errors.year && <Text style={styles.errorText}>Year is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Branch<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange, onBlur, value } }) => (
                        <ModalDropdown
                            options={dropdownOptions2}
                            style={styles.input}
                            dropdownStyle={styles.dropdownOptions}
                            defaultValue="none"
                            onBlur={onBlur}
                            onSelect={(index) => onChange(dropdownOptions2[index])}
                            value={value}
                        />    
                        )}
                        name="branch"
                        defaultValue=""
                    />
                    {errors.branch && <Text style={styles.errorText}>Branch is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Gender<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange, onBlur, value } }) => (
                        <ModalDropdown
                            options={dropdownOptions3}
                            style={styles.input}
                            dropdownStyle={styles.dropdownOptions}
                            defaultValue="none"
                            onBlur={onBlur}
                            onSelect={(index) => onChange(dropdownOptions3[index])}
                            value={value}
                        />    
                        )}
                        name="gender"
                        defaultValue=""
                    />
                    {errors.gender && <Text style={styles.errorText}>Gender is required.</Text>}
                </View>

                {/* <View style={styles.subFormView}>
                    <Text style={styles.label}>PWD?<Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                    <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <ModalDropdown
                        options={dropdownOptions4.map(option => option.label)}
                        style={styles.input}
                        dropdownStyle={styles.dropdownOptions}
                        defaultValue="Select"
                        onBlur={onBlur}
                        onSelect={(index) => {
                            const selectedOption = dropdownOptions4[index];
                            onChange(selectedOption.value);
                        }}
                        value={value !== undefined ? dropdownOptions4.find(option => option.value === value)?.label : "Select"}
                        />
                    )}
                    name="pwd"
                    defaultValue={false}
                    />
                    {errors.PWD && <Text style={styles.errorText}>This is required.</Text>}
                </View> */}

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Community<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Community"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="community"
                        defaultValue=""
                    />
                    {errors.community && <Text style={styles.errorText}>Community is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Aadhar Number<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Aadhaar Number"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="aadharNumber"
                        defaultValue=""
                    />
                    {errors.aadharNumber && <Text style={styles.errorText}>Aadhar Number is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >DOB<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="dob"
                        defaultValue=""
                    />
                    {errors.dob && <Text style={styles.errorText}>DOB is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Blood Group<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Blood Group"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="bloodGroup"
                        defaultValue=""
                    />
                    {errors.bloodGroup && <Text style={styles.errorText}>Blood Group is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Father Name<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Father Name"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="fatherName"
                        defaultValue=""
                    />
                    {errors.fatherName && <Text style={styles.errorText}>Father Name is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Mother Name<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Mother Name"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="motherName"
                        defaultValue=""
                    />
                    {errors.motherName && <Text style={styles.errorText}>Mother Name is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Contact Number<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Contact number"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="phone"
                        defaultValue=""
                    />
                    {errors.phone && <Text style={styles.errorText}>Contact Number is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Parent Contact Number<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Parent Contact Number"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="parentsPhone"
                        defaultValue=""
                    />
                    {errors.parentsPhone && <Text style={styles.errorText}>Parent Contact Number is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Emergency Phone<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Emergency Contact"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="emergencyPhone"
                        defaultValue=""
                    />
                    {errors.emergencyPhone && <Text style={styles.errorText}>Emergency Contact is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Address<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Address"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="address"
                        defaultValue=""
                    />
                    {errors.address && <Text style={styles.errorText}>Address is required.</Text>}
                </View>
                
                <View style={styles.subFormView}>
                    <Text style={styles.label}>Is Hosteller?<Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <ModalDropdown
                            options={dropdownOptions4.map(option => option.label)}
                            style={styles.input}
                            dropdownStyle={styles.dropdownOptions}
                            defaultValue="Select"
                            onBlur={onBlur}
                            onSelect={(index) => {
                                const selectedOption = dropdownOptions4[index];
                                onChange(selectedOption.value);
                            }}
                            value={value !== undefined ? dropdownOptions4.find(option => option.value === value)?.label : "Select"}
                            />
                        )}
                        name="isHosteller"
                        defaultValue={false}
                    />
                    {errors.isHosteller && <Text style={styles.errorText}>This is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Cot Number<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Cot Number"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="cotNo"
                        defaultValue=""
                    />
                    {errors.cotNo && <Text style={styles.errorText}>Cot Number is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Floor No<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Floor Number"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="floorNo"
                        defaultValue=""
                    />
                    {errors.floorNo && <Text style={styles.errorText}>Floor Number is required.</Text>}
                </View>

                <View style={styles.subFormView}>
                    <Text style={styles.label} >Room No<Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Room Number"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        )}
                        name="roomNo"
                        defaultValue=""
                    />
                    {errors.roomNo && <Text style={styles.errorText}>Room Number is required.</Text>}
                </View>

                <MainButton text={"Update"} onPress={handleSubmit(submitHandler)} />
            </View>
        </View>
        </ScrollView>
  )
}

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
})


export default EditProfile