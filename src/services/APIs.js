// OLD SERVER (Backend)
// const SERVER_BASE_URL = "https://backend-lxur.onrender.com/api/v1"

// NEW SERVER (Backend1)
// const SERVER_BASE_URL = "https://backend1-itzt.onrender.com/api/v1"

// PURCHASED SERVER 
// const SERVER_BASE_URL = "https://backend-c938.onrender.com/api/v1"

// const SERVER_BASE_URL = "http://192.168.207.208:4000/api/v1"
// NOTE : USE YOUR LAPTOP IPv4 host Address - cmd : ipconfig

// LOCALHOST SERVER
// const SERVER_BASE_URL = "http://localhost:4000/api/v1"

// AWS SERVER
const SERVER_BASE_URL = "http://ec2-15-207-247-90.ap-south-1.compute.amazonaws.com:4000/api/v1"


export const authEndPoints = {
    SENDOTP_API : SERVER_BASE_URL + "/auth/sendOTP",
    SIGNUP_API : SERVER_BASE_URL + "/auth/signup",
    LOGIN_API : SERVER_BASE_URL + "/auth/login",
    RESET_PASSWORD_TOKEN : SERVER_BASE_URL + "/auth/resetPasswordToken",
    RESET_PASSWORD : SERVER_BASE_URL + "/auth/resetPassword",
    VERIFY_OTP : SERVER_BASE_URL + "/auth/verifyOTP",
    CREATE_STUDENT_ACCOUNT_API : SERVER_BASE_URL + "/auth/createStudentAccount",
}

export const studentEndPoints = {
    // OUTING APPILICATION APIs
    CREATE_OUTING_APPLICATION_API : SERVER_BASE_URL + '/student/createOutingApplication',
    GET_STUDENT_ALL_OUTING_APPLICATIONS_API : SERVER_BASE_URL + '/student/getStudentAllOutingApplications',
    DELETE_PENDING_OUTING_APPLICATION_API : SERVER_BASE_URL + '/student/deletePendingOutingApplication',
    MARK_RETURN_FROM_OUTING_API : SERVER_BASE_URL + '/student/markReturnOutingApplication',

    // HOSTEL COMPLAINTS APIs
    CREATE_HOSTEL_COMPLAINT_API : SERVER_BASE_URL + '/student/createHostelComplaint',
    DELETE_HOSTEL_COMPLAINT_API : SERVER_BASE_URL + '/student/deleteHostelComplaint',
    SHOW_ALL_STUDENT_COMPLAINT_API : SERVER_BASE_URL + '/student/showAllStudentComplaints',

    // MESS APIs
    FETCH_MESS_HALLS_AND_GENDER_API : SERVER_BASE_URL + '/student/fetchAllMessHallsAndStudentGender',
    CREATE_MESS_FEEDBACK_API : SERVER_BASE_URL + '/student/createMessFeedBack',
    DELETE_MESS_FEEDBACK_API : SERVER_BASE_URL + '/student/deleteMessFeedBack',
    GENERATE_MESS_SESSION_RECEIPT_API : SERVER_BASE_URL + '/student/generateMessSessionReceipt',
    FETCH_MESS_RECEIPTS_API : SERVER_BASE_URL + '/student/fetchStudentMessReceipts',

    // ATTENDENCE APIs
    GET_STUDENT_ATTENDENCE_API : SERVER_BASE_URL + '/student/getStudentAttendance',

    //DASHBOARD APIs
    GET_STUDENT_DASHBOARD_DATA_APT : SERVER_BASE_URL + '/student/getStudentDashboardData',
    ADD_EVEN_SEM_FEE_RECEIPT_API : SERVER_BASE_URL + '/student/addEvenSemFeeReceipt',

    // PROFILE APIs
    EDIT_STUDENT_PROFILE_API : SERVER_BASE_URL + '/student/editProfile',
}

export const officialEndPoints = {

    // DASHBOARD APIs
    FETCH_DASHBOARD_DATA_API : SERVER_BASE_URL + '/official/getDashboardData',

    // ANNOUNCEMENTS APIs
    CREATE_ANNOUNCEMENT_API : SERVER_BASE_URL + '/official/createAnnouncement',

    // OUTING APPLICATION APIs
    GET_PENDING_OUTING_APPLICATION_BY_WARDEN_BLOCK_API : SERVER_BASE_URL + '/official/getPendingOutingApplicationsByWardenBlock',
    GET_COMPLETED_OUTING_APPLICATION_BY_WARDEN_BLOCK_API : SERVER_BASE_URL + '/official/getCompletedOutingApplicationsByWardenBlock',
    GET_INPROGRESS_OUTING_APPLICATION_BY_WARDEN_BLOCK_API : SERVER_BASE_URL + '/official/getInProgressOutingApplicationsByWardenBlock',
    GET_RETURNED_OUTING_APPLICATION_BY_WARDEN_BLOCK_API : SERVER_BASE_URL + '/official/getReturnedOutingApplicationsByWardenBlock',
    ACCEPT_PENDING_OUTING_APPLICATION_API : SERVER_BASE_URL + '/official/acceptPendingOutingApplication',
    REJECT_PENDING_OUTING_APPLICATION_API : SERVER_BASE_URL + '/official/rejectPendingOutingApplication',
    MARK_COMPLETD_OUTING_WITHOUT_DELAY_API : SERVER_BASE_URL + '/official/markOutingApplicationCompletedWithoutDelay',
    MARK_COMPLETD_OUTING_WITH_DELAY_API : SERVER_BASE_URL + '/official/markOutingApplicationCompletedWithDelay',

    // HOSTEL COMPLAINT APIs
    GET_ALL_UNRESOLVED_COMPLAINTS_BY_HOSTEL_BLOCK_API : SERVER_BASE_URL + '/official/getAllUnresolvedComplaintsByHostelBlock',
    GET_ALL_RESOLVED_COMPLAINTS_BY_HOSTEL_BLOCK_API : SERVER_BASE_URL + '/official/getAllResolvedComplaintsByHostelBlock',
    RESOLVE_HOSTEL_COMPLAINT_API : SERVER_BASE_URL + '/official/resolveHostelComplaint',
    UNRESOLVE_HOSTEL_COMPLAINT_API : SERVER_BASE_URL + '/official/unresolveHostelComplaint',

    // ATTENDENCE APIs
    FETCH_ATTENDANCE_DATA_IN_HOSTEL_BLOCK : SERVER_BASE_URL + '/official/fetchAttendanceDataInHostelBlock',
    MARK_STUDENT_PRESENT_API : SERVER_BASE_URL + '/official/markStudentPresent',
    MARK_STUDENT_ABSENT_API : SERVER_BASE_URL + '/official/markStudentAbsent',
    UNMARK_STUDENT_PRESENT_API : SERVER_BASE_URL + '/official/unMarkStudentPresent',
    UNMARK_STUDENT_ABSENT_API : SERVER_BASE_URL + '/official/unMarkStudentAbsent',    
}

export const adminEndPoints = {

    // DASHBOARD APIs
    FETCH_DASHBOARD_DATA_API : SERVER_BASE_URL + '/admin/getDashboardData',
    FETCH_ROOMS_IN_HOSTEL_BLOCK_API : SERVER_BASE_URL + '/admin/fetchRoomsInHostelBlock',
    FETCH_COTS_IN_ROOM_API : SERVER_BASE_URL + '/admin/fetchCotsInRooms',
    DOWNLOAD_STUDENT_DATA_BY_HOSTEL_BLOCK_API : SERVER_BASE_URL + '/admin/downloadStudentDetailsInHostelBlockXlsxFile',

    // HOSTEL BLOCK APIs
    CREATE_HOSTEL_BLOCK_API : SERVER_BASE_URL + '/admin/createHostelBlock',
    DELETE_HOSTEL_BLOCK_API : SERVER_BASE_URL + '/admin/deleteHostelBlock',
    ADD_WARDEN_TO_HOSTEL_BLOCK_API : SERVER_BASE_URL + '/admin/addWardenToHostelBlock',
    REMOVE_WARDEN_FROM_HOSTEL_BLOCK_API : SERVER_BASE_URL + '/admin/removeWardenFromHostelBlock',

    // MESS HALL APIs
    CREATE_MESS_HALL_API : SERVER_BASE_URL + '/admin/createMessHall',
    DELETE_MESS_HALL_API : SERVER_BASE_URL + '/admin/deleteMessHall',

    // ACCOUNT HANDLING APIs
    FETCH_OFFICIAL_ACCOUNTS : SERVER_BASE_URL + '/admin/fetchOfficialAccounts',
    CREATE_OFFICIAL_ACCOUNT : SERVER_BASE_URL + '/admin/createOfficialAccount',
    DELETE_OFFICIAL_ACCOUNT : SERVER_BASE_URL + '/admin/deleteOfficialAccount',
    FETCH_STUDENT_BY_ROLL_OR_REG_NO_API : SERVER_BASE_URL + '/admin/fetchStudentByRollNoAndRegNo',
    DELETE_STUDENT_ACCOUNT : SERVER_BASE_URL + '/admin/deleteStudentAccount',
    CHANGE_STUDENT_PROFILE_PHOTO_API : SERVER_BASE_URL + '/admin/changeStudentProfilePhoto',

    // REGISTRATION APPLICATION APIs
    FETCH_REGISTRATION_APPLICATIONS_API : SERVER_BASE_URL + '/admin/fetchRegistrationApplications',
    ACCEPT_REGISTRATION_APPLICATION_API : SERVER_BASE_URL + '/admin/acceptRegistrationApplication',
    REJECT_REGISTRATION_APPLICATION_API : SERVER_BASE_URL + '/admin/rejectRegistrationApplication',
    FETCH_FREEZED_REGISTRATION_APPLICATIONS_API : SERVER_BASE_URL + '/admin/fetchFreezedApplications',
    FREEZE_REGISTRATION_APPILICATION_API : SERVER_BASE_URL + '/admin/freezeRegistrationApplication',
    CONFIRM_FREEZED_REGISTRATION_APPLICATION_API : SERVER_BASE_URL + '/admin/confirmFreezedStudentRegistration',
    SEND_ACKNOWLEDGEMENT_LETTER_API : SERVER_BASE_URL + '/admin/sendAcknowledgementLetter',
    FETCH_COTS_FOR_COT_CHANGE_API : SERVER_BASE_URL + '/admin/fetchCotsForChangeCotOption',
    SWAP_OR_EXCHANGE_STUDENT_COT_API : SERVER_BASE_URL + '/admin/swapOrExchangeCot',
    FETCH_EVEN_SEM_REGISTRATION_APPLICATIONS_API : SERVER_BASE_URL + '/admin/fetchEvenSemRegistrationApplications',
    ACCEPT_EVEN_SEM_REGISTRATION_APPLICATIONS_API : SERVER_BASE_URL + '/admin/acceptEvenSemRegistrationApplication',
    REJECT_EVEN_SEM_REGISTRATION_APPLICATIONS_API : SERVER_BASE_URL + '/admin/rejectEvenSemRegistrationApplication',
    DELETE_FREEZED_REGISTRATION_APPLICATION_API : SERVER_BASE_URL + '/admin/deleteFreezedStudentApplication',
    FETCH_ALL_PENDING_HOSTEL_COMPLAINTS_API : SERVER_BASE_URL + '/admin/getPendingComplaints',

    // ANNOUCEMENT APIs : 
    DELETE_ANNOUNCEMENT_API : SERVER_BASE_URL + '/admin/deleteAnnouncement',
}

export const commonEndPoints = {
    GET_ALL_ANNOUNCEMENTS_API : SERVER_BASE_URL + '/common/getAllAnnouncements',
    FETCH_ALL_HOSTEL_DATA_API : SERVER_BASE_URL + '/common/fetchAllHostelData',
    FETCH_HOSTEL_BLOCKS_NAME : SERVER_BASE_URL + '/common/fetchHostelBlockNames',
    FETCH_HOSTEL_BLOCKS_ROOMS : SERVER_BASE_URL + '/common/fetchHostelBlockRooms',
    FETCH_CURRENT_DATE_MESS_RATING_AND_REVIEW : SERVER_BASE_URL + '/common/fetchCurrentDateRatingsAndReviews',
    FETCH_CURRENT_SESSION_MESS_MENU_API : SERVER_BASE_URL + '/common/fetchCurrentSessionMessMenu',
    FETCH_DETAILED_MESS_MENU_API : SERVER_BASE_URL + '/common/fetchDetailedMessMenu',
}