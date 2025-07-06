import {
  FaRightToBracket, FaAddressCard, FaBullhorn, FaBuilding, FaBowlFood, FaAddressBook,
  FaUsers, FaImage, FaStar, FaIdBadge, FaUserShield, FaChild, FaTableList,
  FaWpforms, FaClockRotateLeft, FaBookBookmark, FaPersonCircleExclamation,
  FaCashRegister, FaReceipt, FaCommentDots, FaCircleExclamation, FaPeopleRoof
} from "react-icons/fa6";

import Login from '../screens/auth/Login';
import CreateAnnouncement from '../screens/official/CreateAnnouncement';
import HostelsBlocks from '../screens/institute/HostelsBlocks';
import ContactUs from '../screens/institute/ContactUs';
import DevelopmentTeam from '../screens/institute/DevelopmentTeam';
import ForgotPassword from '../screens/auth/ForgotPassword';
import ResetPasswordMailSent from '../screens/auth/ResetPasswordMailSent';
import ResetPassword from '../screens/auth/ResetPassword';
import ResetPasswordSuccess from '../screens/auth/ResetPasswordSuccess';
import StudentDashboard from '../screens/student/StudentDashboard';
import AttendanceHistory from '../screens/student/AttendanceHistory';
import OutingApplication from '../screens/student/OutingApplication';
import RegisterComplaint from '../screens/student/RegisterComplaint';
// import Gallery from '../screens/institute/Gallary';
import Announcements from '../screens/common/Announcements';
import OutingRequest from '../screens/official/OutingRequest';
import ApplicationHistory from '../screens/student/ApplicationHistory';
import RegisterComplaints from '../screens/student/RegisteredComplaints';
import HostelComplaints from '../screens/official/HostelComplaints';
import TakeAttendance from '../screens/official/TakeAttendance';
import ManageHostels from '../screens/admin/ManageHostels';
import MessMenu from '../screens/common/MessMenu';
import DetailedMessMenu from '../screens/common/DetailedMessMenu';
import ViewMessFeedBack from '../screens/common/ViewMessFeedBack';
import ManageOfficialAccounts from '../screens/admin/ManageOfficialAccounts';
import CreateHostelBlock from '../screens/admin/CreateHostelBlock';
import CreateOfficialAccount from '../screens/admin/CreateOfficialAccount';
import StudentRegistration from '../screens/auth/StudentRegistration';
import StudentRegistrationApplications from '../screens/admin/StudentRegistrationApplications';
import OfficialDashboard from '../screens/official/OfficialDashboard';
import GiveMessFeedback from '../screens/student/GiveMessFeedback';
// import GenerateMessReceipt from '../screens/student/GenerateMessReceipt';
// import MessReceiptsHistory from '../screens/student/MessReceiptsHistory';
import FreezedApplications from '../screens/admin/FreezedApplications';
import AdminDashboard from '../screens/admin/AdminDashboard';
import BlockRooms from '../screens/admin/BlockRooms';
import CotDetails from '../screens/admin/CotDetails';
import ManageStudentAccounts from '../screens/admin/ManageStudentAccounts';
import ChangeStudentCot from '../screens/admin/ChangeStudentCot';
import EvenSemRegistrationApplications from '../screens/admin/EvenSemRegistrationApplications';
import ViewAllPendingComplaints from "../screens/admin/ViewAllPendingComplaints";

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
  OFFICIAL: 'OFFICIAL',
};

export const authRoutes = [
  { path: "/", element: <Login />, label: "Login", icon: <FaRightToBracket />, role: null },
  { path: "/student-registration", element: <StudentRegistration />, label: "Student Registration", icon: <FaAddressCard />, role: null },
  { path: "/announcements", element: <Announcements />, label: "Announcements", icon: <FaBullhorn />, role: null },
  { path: "/hostel-blocks", element: <HostelsBlocks />, label: "Hostel Blocks", icon: <FaBuilding />, role: null },
  { path: "/mess-menu", element: <MessMenu />, label: "Mess Menu", icon: <FaBowlFood />, role: null },
  { path: "/contact-us", element: <ContactUs />, label: "Contact Us", icon: <FaAddressBook />, role: null },
  { path: "/development-team", element: <DevelopmentTeam />, label: "Development Team", icon: <FaUsers />, role: null },
  // { path: "/gallery", element: <Gallery />, label: "Gallery", icon: <FaImage />, role: null },
  { path: "/view-feedback", element: <ViewMessFeedBack />, label: "View Mess Feedback", icon: <FaStar />, role: null },

  { path: "/reset-password-email-sent", element: <ResetPasswordMailSent />, role: null, hidden: true },
  { path: "/reset-password", element: <ResetPassword />, role: null, hidden: true },
  { path: "/reset-password-success", element: <ResetPasswordSuccess />, role: null, hidden: true },
  { path: "/forgot-password", element: <ForgotPassword />, role: null, hidden: true },
  { path: "/detailed-mess-menu", element: <DetailedMessMenu />, role: null, hidden: true },
]

export const adminRoutes = [
  { path: "/", element: <AdminDashboard />, label: "Dashboard", icon: <FaIdBadge />, role: [USER_ROLES.ADMIN] },
  { path: "/admin/odd-sem-applications", element: <StudentRegistrationApplications />, label: "Odd Sem Reg. Apps", icon: <FaAddressCard />, role: [USER_ROLES.ADMIN] },
  { path: "/admin/even-sem-applications", element: <EvenSemRegistrationApplications />, label: "Even Sem Reg. Apps", icon: <FaAddressCard />, role: [USER_ROLES.ADMIN] },
  { path: "/admin/manage-students", element: <ManageStudentAccounts />, label: "Manage Students", icon: <FaChild />, role: [USER_ROLES.ADMIN] },
  { path: "/admin/view-all-unresolved-complaints", element: <ViewAllPendingComplaints />, label: "Unresolved Complaints", icon: <FaBookBookmark />, role: [USER_ROLES.ADMIN] },
  { path: "/admin/manage-officials", element: <ManageOfficialAccounts />, label: "Manage Officials", icon: <FaUserShield />, role: [USER_ROLES.ADMIN] },
  { path: "/admin/create-official-account", element: <CreateOfficialAccount />, role: [USER_ROLES.ADMIN], hidden: true },
  { path: "/admin/manage-hostels", element: <ManageHostels />, label: "Manage Hostels", icon: <FaBuilding />, role: [USER_ROLES.ADMIN] },
  { path: "/admin/create-hostel-block", element: <CreateHostelBlock />, role: [USER_ROLES.ADMIN], hidden: true },
  { path: "/admin/freezed-applications", element: <FreezedApplications />, role: [USER_ROLES.ADMIN], hidden: true },
  { path: "/admin/block-rooms", element: <BlockRooms />, role: [USER_ROLES.ADMIN], hidden: true },
  { path: "/admin/cot-details", element: <CotDetails />, role: [USER_ROLES.ADMIN], hidden: true },
  { path: "/admin/change-student-cot/:cotId/:userId", element: <ChangeStudentCot />, role: [USER_ROLES.ADMIN], hidden: true },
  { path: "/announcements", element: <Announcements />, label: "Announcements", icon: <FaBullhorn />, role: null },
  { path: "/view-feedback", element: <ViewMessFeedBack />, label: "View Mess Feedback", icon: <FaStar />, role: null },
  // { path: "/hostel-blocks", element: <HostelsBlocks />, label: "Hostel Blocks", icon: <FaBuilding />, role: null },
  { path: "/mess-menu", element: <MessMenu />, label: "Mess Menu", icon: <FaBowlFood />, role: null },
  { path: "/contact-us", element: <ContactUs />, label: "Contact Us", icon: <FaAddressBook />, role: null },
  { path: "/development-team", element: <DevelopmentTeam />, label: "Development Team", icon: <FaUsers />, role: null },
  // { path: "/gallery", element: <Gallery />, label: "Gallery", icon: <FaImage />, role: null },
  { path: "/detailed-mess-menu", element: <DetailedMessMenu />, role: null, hidden: true },
  // { path: "*", element: <AdminDashboard />, role: [USER_ROLES.ADMIN], hidden: true },
]

export const studentRoutes = [
  { path: "/", element: <StudentDashboard />, label: "Dashboard", icon: <FaIdBadge />, role: [USER_ROLES.STUDENT] },
  { path: "/announcements", element: <Announcements />, label: "Announcements", icon: <FaBullhorn />, role: null },
  { path: "/student/attendance-history", element: <AttendanceHistory />, label: "Attendance History", icon: <FaTableList />, role: [USER_ROLES.STUDENT] },
  { path: "/student/outing-application", element: <OutingApplication />, label: "Outing Application", icon: <FaWpforms />, role: [USER_ROLES.STUDENT] },
  { path: "/student/application-history", element: <ApplicationHistory />, label: "Application History", icon: <FaClockRotateLeft />, role: [USER_ROLES.STUDENT] },
  { path: "/student/register-complaint", element: <RegisterComplaint />, label: "Register Complaint", icon: <FaBookBookmark />, role: [USER_ROLES.STUDENT] },
  { path: "/student/complaints", element: <RegisterComplaints />, label: "Complaints Registered", icon: <FaPersonCircleExclamation />, role: [USER_ROLES.STUDENT] },
  // { path: "/student/mess-receipt", element: <GenerateMessReceipt />, label: "Generate Mess Receipt", icon: <FaCashRegister />, role: [USER_ROLES.STUDENT] },
  // { path: "/student/mess-receipt-history", element: <MessReceiptsHistory />, label: "Mess Receipts History", icon: <FaReceipt />, role: [USER_ROLES.STUDENT] },
  { path: "/view-feedback", element: <ViewMessFeedBack />, label: "View Mess Feedback", icon: <FaStar />, role: null },
  { path: "/student/give-feedback", element: <GiveMessFeedback />, role: [USER_ROLES.STUDENT], hidden: true },
  { path: "/hostel-blocks", element: <HostelsBlocks />, label: "Hostel Blocks", icon: <FaBuilding />, role: null },
  { path: "/mess-menu", element: <MessMenu />, label: "Mess Menu", icon: <FaBowlFood />, role: null },
  { path: "/contact-us", element: <ContactUs />, label: "Contact Us", icon: <FaAddressBook />, role: null },
  { path: "/development-team", element: <DevelopmentTeam />, label: "Development Team", icon: <FaUsers />, role: null },
  // { path: "/gallery", element: <Gallery />, label: "Gallery", icon: <FaImage />, role: null },
  { path: "/detailed-mess-menu", element: <DetailedMessMenu />, role: null, hidden: true },
  // { path: "*", element: <StudentDashboard />, role: [USER_ROLES.STUDENT], hidden: true },
]

export const officialRoutes = [
  { path: "/", element: <OfficialDashboard />, label: "Dashboard", icon: <FaIdBadge />, role: [USER_ROLES.OFFICIAL] },
  { path: "/official/create-announcement", element: <CreateAnnouncement />, label: "Create Announcement", icon: <FaBullhorn />, role: [USER_ROLES.OFFICIAL] },
  { path: "/announcements", element: <Announcements />, label: "Announcements", icon: <FaBullhorn />, role: null },
  { path: "/official/outing-request", element: <OutingRequest />, label: "Outing Request", icon: <FaWpforms />, role: [USER_ROLES.OFFICIAL] },
  { path: "/official/take-attendance", element: <TakeAttendance />, label: "Take Attendance", icon: <FaPeopleRoof />, role: [USER_ROLES.OFFICIAL] },
  { path: "/official/hostel-complaints", element: <HostelComplaints />, label: "Hostel Complaints", icon: <FaCircleExclamation />, role: [USER_ROLES.OFFICIAL] },
  { path: "/view-feedback", element: <ViewMessFeedBack />, label: "View Mess Feedback", icon: <FaStar />, role: null },
  { path: "/hostel-blocks", element: <HostelsBlocks />, label: "Hostel Blocks", icon: <FaBuilding />, role: null },
  { path: "/mess-menu", element: <MessMenu />, label: "Mess Menu", icon: <FaBowlFood />, role: null },
  { path: "/contact-us", element: <ContactUs />, label: "Contact Us", icon: <FaAddressBook />, role: null },
  { path: "/development-team", element: <DevelopmentTeam />, label: "Development Team", icon: <FaUsers />, role: null },
  // { path: "/gallery", element: <Gallery />, label: "Gallery", icon: <FaImage />, role: null },
  { path: "/detailed-mess-menu", element: <DetailedMessMenu />, role: null, hidden: true },
];

export const MAX_PROFILE_IMAGE_SIZE = 250 * 1024; // 250 KB
export const MAX_FEE_RECEIPT_FILE_SIZE = 250 * 1024; // 250 KB
export const MAX_HOSTEL_IMAGE_SIZE = 500 * 1024; // 500 KB
export const MAX_ANNOUNCEMENT_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_COMPLAINT_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
