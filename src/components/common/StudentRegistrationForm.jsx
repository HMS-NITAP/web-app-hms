import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Linking } from 'react-native';
import MainButton from './MainButton';
import ModalDropdown from 'react-native-modal-dropdown';
import { RadioButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
import { useToast } from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/FontAwesome6';
import DatePicker from 'react-native-date-picker'
import { setRegistrationData, setRegistrationStep } from '../../reducer/slices/AuthSlice';
import { sendOtpToStudent } from '../../services/operations/AuthAPI';

const MAX_FILE_SIZE = 250 * 1024;
const MAX_IMAGE_SIZE = 250 * 1024;

const StudentRegistrationForm = () => {

    const yearOptions = [
        { label: '1st Year', value: 1 },
        { label: '2nd Year', value: 2 },
        { label: '3rd Year', value: 3 },
        { label: '4th Year', value: 4 },
    ];
    const branchOptions = ["CSE","ECE","EEE","MECH","CIVIL","BIOTECH","CHEM","MME"];
    const communityOptions = ["GENERAL","OBC","SC","ST"];
    const paymentOption = [
        { label : "NET BANKING", value : "NET_BANKING"},
        { label : "DEBIT CARD", value : "DEBIT_CARD"},
        { label : "CREDIT CARD", value : "CREDIT_CARD"},
        { label : "UPI", value : "UPI"},
        { label : "NEFT", value : "NEFT"},
        { label : "NEFT(Educational Loan)", value : "NEFT_Educational_Loan"},
        { label : "OTHER", value : "OTHER"},
    ]

    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    const dispatch = useDispatch();
    const toast = useToast();

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isPaymentDatePickerOpen, setIsPaymentDatePickerOpen] = useState(false);

    const [imageResponse, setImageResponse] = useState(null);
    const [hostelfeeReceiptResponse, setHostelFeeReceiptResponse] = useState(null);
    const [instituteFeeReceiptResponse, setInstituteFeeReceiptResponse] = useState(null);

    const [selectedGender, setSelectedGender] = useState(null);
    const [dob, setDob] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [pwdStatus, setPwdStatus] = useState(null);
    const [paymentMode, setPaymentMode] = useState(null);
    const [paymentDate, setPaymentDate] = useState(null);

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const pickUpImage = useCallback(async () => {
        try{
          const response = await DocumentPicker.pick({
            type: [DocumentPicker.types.images],
            presentationStyle: 'fullScreen',
          })

          if(response[0].size > MAX_IMAGE_SIZE){
            toast.show('File size exceeds the limit of 250KB. Please select a smaller file.', { type: 'warning' });
          }else{
            setImageResponse(response);
          }
        }catch(err){
          console.warn(err);
        }
    }, []);

    const pickUpHostelFeeReceipt = useCallback(async () => {
        try {
          const response = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
            presentationStyle: 'fullScreen',
          });
          if(response[0].size > MAX_FILE_SIZE){
            toast.show('File size exceeds the limit of 250KB. Please select a smaller file.', { type: 'warning' });
          }else{
            setHostelFeeReceiptResponse(response);
          }
        }catch(err){
          console.warn(err);
        }
    }, []);

    const pickUpInstituteFeeReceipt = useCallback(async () => {
        try{
          const response = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
            presentationStyle: 'fullScreen',
          });
          if(response[0].size > MAX_FILE_SIZE){
            toast.show('File size exceeds the limit of 150KB. Please select a smaller file.', { type: 'warning' });
          }else{
            setInstituteFeeReceiptResponse(response);
          }
        }catch(err){
          console.warn(err);
        }
    }, []);

    const formatDate = (date) => {
        if (!date) return "NO DATE IS SELECTED";
        return date.toLocaleDateString(); 
    };

    const [secureText1, setSecureText1] = useState(true);
    const [secureText2, setSecureText2] = useState(true);

    const covertToLocalDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = date.toLocaleDateString('en-CA', options);
        return formattedDate
    }

    const submitHandler = async(data) => {

        if(!data?.email.endsWith("@student.nitandhra.ac.in")){
            toast.show("Please Use Your Institute Email ID",{type:"warning"});
            return;
        }

        if(data?.password !== data?.confirmPassword){
            toast.show("Passwords are not matching",{type:"warning"});
            return;
        }else if(!selectedBranch){
            toast.show("Select your Branch",{type:"warning"});
            return;
        }else if(!selectedCommunity){
            toast.show("Select your Community",{type:"warning"});
            return;
        }else if(!selectedGender){
            toast.show("Select your Gender",{type:"warning"});
            return;
        }else if(!selectedYear){
            toast.show("Select your Year",{type:"warning"});
            return;
        }else if(!dob){
            toast.show("Select your DOB",{type:"warning"});
            return;
        }else if(!pwdStatus){
            toast.show("Select your PWD status",{type:"warning"});
            return;
        }else if(!paymentMode){
            toast.show("Select Hostel Fee Payment Mode",{type:"warning"});
            return;
        }else if(!paymentDate){
            toast.show("Select Hostel Fee Payment Date",{type:"warning"});
            return;
        }else if(!hostelfeeReceiptResponse){
            toast.show("Upload Fee Receipt",{type:"warning"});
            return;
        }else if(!imageResponse){
            toast.show("Upload your Profile Image",{type:"warning"});
            return;
        }

        setIsButtonDisabled(true);

        const registrationData = {
            ...data,branch:selectedBranch,community:selectedCommunity,gender:selectedGender,year:selectedYear,dob: covertToLocalDate(dob),pwd:pwdStatus,image:imageResponse,instituteFeeReceipt:instituteFeeReceiptResponse,hostelFeeReceipt:hostelfeeReceiptResponse,paymentMode,paymentDate:covertToLocalDate(paymentDate)
        }

        await dispatch(setRegistrationData(registrationData));
        const response = await dispatch(sendOtpToStudent(data.email,toast));
        if(response){
            await dispatch(setRegistrationStep(2));
        }
        setIsButtonDisabled(false);
    }

  return (
    <View style={{width:"100%", display:"flex", flexDirection:"column", justifyContent:"center",alignItems:"center",gap:25}}>
        <View style={{width:"100%", backgroundColor:"#e9edc9", borderRadius:20, paddingHorizontal:15, paddingVertical:15,gap:2}}>
            <Text style={{ textAlign: "center", fontSize: 18, fontWeight:"700", color: "black", marginBottom: 10 }}>INSTRUCTIONS (ODD SEM REGISTRATION):</Text>
            <Text style={{ fontSize: 16, fontWeight:"600", color: "black" }}>{'\u2022'} Please complete your Institute Registration before proceeding with the Hostel Registration.</Text>
            <Text style={{ fontSize: 16, color: "black" }}>{'\u2022'} Click on the Link to Open Hostel Fee Payment Portal :</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://payments.billdesk.com/bdcollect/pay?p1=5213&p2=15')}><Text style={{color:"blue", textAlign:"center"}}>https://payments.billdesk.com/bdcollect/pay?p1=5213&p2=15</Text></TouchableOpacity>
            <Text style={{ fontSize: 16, color: "black" }}>{'\u2022'} Ensure your Institute email address is correct.</Text>
            <Text style={{ fontSize: 16, color: "black" }}>{'\u2022'} Fill the details with atmost care, as once saved they can't be changed.</Text>
            <Text style={{ fontSize: 16, color: "black" }}>{'\u2022'} Upload a recent proper passport size photo of yours not exceeding 250KB size.</Text>
            <Text style={{ fontSize: 16, color: "black" }}>{'\u2022'} Upload Image in JPG or JPEG format.</Text>
            <Text style={{ fontSize: 16, color: "black" }}>{'\u2022'} Upload Your fee Receipts in PDF Format not exceeding 150KB size each</Text>
            <Text style={{ fontSize: 16, color: "black" }}>{'\u2022'} Contact support under Development Team, if you encounter any issues</Text>
            <Text style={{ fontSize: 16, color: "black" }}>{'\u2022'} Do not share your OTP and credentials with anyone.</Text>
        </View>
        <View style={styles.form}>

            <View style={styles.subFormView}>
                <Text style={styles.label} >Student Name <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
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
                {errors.name && <Text style={styles.errorText}>Student Name is required.</Text>}
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label} >Institute Email ID <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your institute email ID"
                        placeholderTextColor={"#adb5bd"}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                    )}
                    name="email"
                    defaultValue=""
                />
                {errors.email && <Text style={styles.errorText}>Institute Email is required.</Text>}
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
                <Text style={styles.label} >Profile Image <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                <View style={{display:'flex', marginTop:5, flexDirection:"row", width:"100%", justifyContent:"space-between", alignItems:"center",marginHorizontal:"auto", gap:20}}>
                    <MainButton text="Select Image" onPress={pickUpImage} />
                    <View>
                    {
                        imageResponse ? 
                            <View style={{maxWidth:"100%", display:"flex",flexDirection:'row',gap:8}}>
                                <Image source={{ uri: imageResponse[0].uri }} style={{width:80,height:80,borderRadius:40}} />
                            </View> : 
                            <View><Text style={{fontWeight:"800", fontSize:15, color:"black"}}>No Image Selected</Text></View>
                    }
                    </View>
                </View>
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label}>Roll Number <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                <Controller
                    control={control}
                    rules={{ 
                        required: true,
                        pattern: {
                            value: /^[0-9]{6}$/,
                            message: 'Roll number must be exactly 6 digits and only numbers.'
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your roll number"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="numeric"
                        />
                    )}
                    name="rollNo"
                    defaultValue=""
                />
                {errors.rollNo && <Text style={styles.errorText}>{errors.rollNo.message}</Text>}
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label}>Registration Number <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                <Controller
                    control={control}
                    rules={{ 
                        required: true,
                        pattern: {
                            value: /^[0-9]{7}$/,
                            message: 'Roll number must be exactly 7 digits and only numbers.'
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your registration number"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="numeric"
                        />
                    )}
                    name="regNo"
                    defaultValue=""
                />
                {errors.regNo && <Text style={styles.errorText}>{errors.regNo.message}</Text>}
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label}>Year <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                <ModalDropdown
                    options={yearOptions.map((year) => year.label)}
                    style={styles.dropDownStyle}
                    dropdownStyle={styles.dropdownOptions}
                    dropdownTextStyle={{ color: "black", fontSize: 14, fontWeight: "600" }}
                    dropdownTextHighlightStyle={{ backgroundColor: "#caf0f8" }}
                    textStyle={{ color: "black", fontSize: 14, paddingHorizontal: 10 }}
                    saveScrollPosition={false}
                    // defaultIndex={0}
                    isFullWidth={true}
                    onSelect={(index) => {
                        setSelectedYear(yearOptions[index].value); 
                    }}
                    defaultValue="Select Your Enrollment Year"
                />
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label}>Branch <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                <ModalDropdown
                    options={branchOptions}
                    style={styles.dropDownStyle}
                    dropdownStyle={styles.dropdownOptions}
                    dropdownTextStyle={{ color: "black", fontSize: 14, fontWeight: "600" }}
                    dropdownTextHighlightStyle={{ backgroundColor: "#caf0f8" }}
                    textStyle={{ color: "black", fontSize: 14, paddingHorizontal: 10 }}
                    saveScrollPosition={false}
                    // defaultIndex={0}
                    isFullWidth={true}
                    onSelect={(index) => {
                        setSelectedBranch(branchOptions[index]); 
                    }}
                    defaultValue="Select Branch"
                />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginRight: 30 }}>
                <Text style={styles.label}>Gender <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                <View style={styles.radioContainer}>
                    <View style={styles.radioOption}>
                        <RadioButton.Android
                            value="M"
                            status={selectedGender === 'M' ? 'checked' : 'unchecked'}
                            onPress={() => setSelectedGender('M')}
                        />
                        <Text style={styles.radioLabel}>Male</Text>
                    </View>
                    <View style={styles.radioOption}>
                        <RadioButton.Android
                            value="F"
                            status={selectedGender === 'F' ? 'checked' : 'unchecked'}
                            onPress={() => setSelectedGender('F')}
                        />
                        <Text style={styles.radioLabel}>Female</Text>
                    </View>
                </View>
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label}>Community <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                <ModalDropdown
                    options={communityOptions}
                    style={styles.dropDownStyle}
                    dropdownStyle={styles.dropdownOptions}
                    dropdownTextStyle={{ color: "black", fontSize: 14, fontWeight: "600" }}
                    dropdownTextHighlightStyle={{ backgroundColor: "#caf0f8" }}
                    textStyle={{ color: "black", fontSize: 14, paddingHorizontal: 10 }}
                    saveScrollPosition={false}
                    isFullWidth={true}
                    onSelect={(_, selectedOption) => setSelectedCommunity(selectedOption)}
                    defaultValue="Select Community"
                />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginRight: 60 }}>
                <Text style={styles.label}>PWD Status <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                <View style={styles.radioContainer}>
                    <View style={styles.radioOption}>
                        <RadioButton.Android
                            value="Yes"
                            status={pwdStatus === 'Yes' ? 'checked' : 'unchecked'}
                            onPress={() => setPwdStatus('Yes')}
                        />
                        <Text style={styles.radioLabel}>Yes</Text>
                    </View>
                    <View style={styles.radioOption}>
                        <RadioButton.Android
                            value="No"
                            status={pwdStatus === 'No' ? 'checked' : 'unchecked'}
                            onPress={() => setPwdStatus('No')}
                        />
                        <Text style={styles.radioLabel}>No</Text>
                    </View>
                </View>
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label}>Date of Birth <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                <View style={{ display: "flex", flexDirection: "row", gap: 15, justifyContent: "space-between", alignItems: "center" }}>
                    <View>
                        <MainButton text={"Select Date"} onPress={() => setIsDatePickerOpen(true)} />
                        <DatePicker
                            modal
                            mode='date'
                            locale='en'
                            maximumDate={new Date()}
                            open={isDatePickerOpen}
                            date={dob || new Date()} 
                            onConfirm={(date) => {
                                setIsDatePickerOpen(false);
                                setDob(date);
                            }}
                            onCancel={() => {
                                setIsDatePickerOpen(false);
                            }}
                        />
                    </View>
                    <View>
                        <Text style={{ fontWeight: "800", fontSize: 15, color:"black" }}>{formatDate(dob)}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label}>Aadhaar Number <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                <Controller
                    control={control}
                    rules={{ 
                        required: true,
                        pattern: {
                            value: /^[0-9]{12}$/,
                            message: 'Aadhaar number must be exactly 12 digits and only numbers.'
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your aadhaar number"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="numeric"
                        />
                    )}
                    name="aadhaarNumber"
                    defaultValue=""
                />
                {errors.aadhaarNumber && <Text style={styles.errorText}>{errors.aadhaarNumber.message}</Text>}
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label} >Blood Group <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your blood group"
                        placeholderTextColor={"#adb5bd"}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                    )}
                    name="bloodGroup"
                    defaultValue=""
                />
                {errors.bloodGroup && <Text style={styles.errorText}>Blood group is required.</Text>}
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label}>Student Mobile Number <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                <Controller
                    control={control}
                    rules={{ 
                        required: true,
                        pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Mobile number must be exactly 10 digits and only numbers.'
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your mobile number"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="numeric"
                        />
                    )}
                    name="phone"
                    defaultValue=""
                />
                {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label} >Father Name <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your father name"
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
                <Text style={styles.label} >Mother Name <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your mother name"
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
                <Text style={styles.label}>Parent Mobile Number <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                <Controller
                    control={control}
                    rules={{ 
                        required: true,
                        pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Mobile number must be exactly 10 digits and only numbers.'
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your parent number"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="numeric"
                        />
                    )}
                    name="parentsPhone"
                    defaultValue=""
                />
                {errors.parentsPhone && <Text style={styles.errorText}>{errors.parentsPhone.message}</Text>}
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label}>Emergency Contact Number <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                <Controller
                    control={control}
                    rules={{ 
                        required: true,
                        pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Mobile number must be exactly 10 digits and only numbers.'
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter emergency contact number"
                            placeholderTextColor={"#adb5bd"}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="numeric"
                        />
                    )}
                    name="emergencyPhone"
                    defaultValue=""
                />
                {errors.emergencyPhone && <Text style={styles.errorText}>{errors.emergencyPhone.message}</Text>}
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label} >Address <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your personal address"
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
                <Text style={styles.label} >Institute Fee Receipt :</Text>
                <View style={{display:'flex', marginTop:5, flexDirection:"row", width:"100%", justifyContent:"space-between", alignItems:"center",marginHorizontal:"auto", gap:20}}>
                    <MainButton text="Select File" onPress={pickUpInstituteFeeReceipt} />
                    <View>
                    {
                        instituteFeeReceiptResponse ? 
                            <View style={{maxWidth:"80%", display:"flex",flexDirection:'row',gap:8}}>
                                <Text style={{textAlign:"center", color:"black", fontWeight:"700", fontSize:15}}>{instituteFeeReceiptResponse[0].name}</Text>
                            </View> : 
                            <View><Text style={{fontWeight:"800", fontSize:15, color:"black"}}>No File Selected</Text></View>
                    }
                    </View>
                </View>
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label} >Hostel Fee Receipt <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                <View style={{display:'flex', marginTop:5, flexDirection:"row", width:"100%", justifyContent:"space-between", alignItems:"center",marginHorizontal:"auto", gap:20}}>
                    <MainButton text="Select File" onPress={pickUpHostelFeeReceipt} />
                    <View>
                    {
                        hostelfeeReceiptResponse ? 
                            <View style={{maxWidth:"80%", display:"flex",flexDirection:'row',gap:8}}>
                                <Text style={{textAlign:"center", color:"black", fontWeight:"700", fontSize:15}}>{hostelfeeReceiptResponse[0].name}</Text>
                            </View> : 
                            <View><Text style={{fontWeight:"800", fontSize:15, color:"black"}}>No File Selected</Text></View>
                    }
                    </View>
                </View>
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label}>Hostel Fee Payment Mode <Text style={{ fontSize: 10, color: 'red' }}>*</Text> :</Text>
                <ModalDropdown
                    options={paymentOption.map((mode) => mode.label)}
                    style={styles.dropDownStyle}
                    dropdownStyle={styles.dropdownOptions}
                    dropdownTextStyle={{ color: "black", fontSize: 14, fontWeight: "600" }}
                    dropdownTextHighlightStyle={{ backgroundColor: "#caf0f8" }}
                    textStyle={{ color: "black", fontSize: 14, paddingHorizontal: 10 }}
                    saveScrollPosition={false}
                    // defaultIndex={0}
                    isFullWidth={true}
                    onSelect={(index) => {
                        setPaymentMode(paymentOption[index].value); 
                    }}
                    defaultValue="Select Your Payment Mode"
                />
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label} >Hostel Fee Payment Date <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                <View style={{ display: "flex", flexDirection: "row", gap: 15, justifyContent: "space-between", alignItems: "center" }}>
                    <View>
                        <MainButton text={"Select Date"} onPress={() => setIsPaymentDatePickerOpen(true)} />
                        <DatePicker
                            modal
                            mode='date'
                            open={isPaymentDatePickerOpen}
                            date={paymentDate || new Date()} 
                            onConfirm={(date) => {
                                setIsPaymentDatePickerOpen(false);
                                setPaymentDate(date);
                            }}
                            onCancel={() => {
                                setIsPaymentDatePickerOpen(false);
                            }}
                        />
                    </View>
                    <View>
                        <Text style={{ fontWeight: "800", fontSize: 15, color:"black" }}>{formatDate(paymentDate)}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.subFormView}>
                <Text style={styles.label} >Hostel Fee Payment Amount <Text style={{fontSize:10,color:'red'}}>*</Text> :</Text>
                <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Enter amount paid"
                        placeholderTextColor={"#adb5bd"}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        keyboardType='numeric'
                    />
                    )}
                    name="amountPaid"
                    defaultValue=""
                />
                {errors.amountPaid && <Text style={styles.errorText}>Amount Paid is required.</Text>}
            </View>
            
        </View>
        <MainButton text={"Submit Data"} isButtonDisabled={isButtonDisabled} backgroundColor={"#b5e48c"} onPress={handleSubmit(submitHandler)} />
    </View>
  )
}

export default StudentRegistrationForm

const styles = StyleSheet.create({
    subFormView:{
        width:"100%",
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
    errorText:{
        fontSize:14,
        color:"red",
    },
})