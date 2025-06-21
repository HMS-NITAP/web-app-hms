import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const attendanceData = [
  { id: 1, presentDates: ['2022-04-15', '2022-04-17'], absentDates: ['2022-04-16'], studentId: 1 },
  { id: 2, presentDates: ['2022-04-16', '2022-04-18'], absentDates: ['2022-04-15'], studentId: 2 },
];

const studentData = [
  { id: 1, regd_no: '2022001', roll_no: '101', name: 'neymar', student_id: 1 },
  { id: 2, regd_no: '2022002', roll_no: '102', name: 'messi', student_id: 2 },
];

const roomDetails = [
  { id: 1, floor_no: 1, room_no: '101', student_id: [1, 2] },
  { id: 2, floor_no: 1, room_no: '102', student_id: [3, 4] },
];

const StudentAttendance = () => {
  const [date, setDate] = useState('');
  const [presentStudents, setPresentStudents] = useState([]);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [viewing, setViewing] = useState('present');

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPresentStudents, setFilteredPresentStudents] = useState([]);
  const [filteredAbsentStudents, setFilteredAbsentStudents] = useState([]);

  const fetchAttendance = () => {
    // Filter attendance data based on selected date
    const filteredAttendance = attendanceData.filter(item => item.presentDates.includes(date) || item.absentDates.includes(date));
  
    const present = filteredAttendance
      .filter(item => item.presentDates.includes(date))
      .map(item => ({
        id: item.id,
        presentDates: item.presentDates,
        absentDates: item.absentDates,
        student: studentData.find(student => student.student_id === item.studentId),
      }));

    const absent = filteredAttendance
      .filter(item => item.absentDates.includes(date))
      .map(item => ({
        id: item.id,
        presentDates: item.presentDates,
        absentDates: item.absentDates,
        student: studentData.find(student => student.student_id === item.studentId),
      }));

    setPresentStudents(present);
    setAbsentStudents(absent);
  };

  const searchStudents = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filteredPresent = presentStudents.filter(student => student.student.regd_no.toLowerCase().includes(lowerCaseQuery) || student.student.name.toLowerCase().includes(lowerCaseQuery));
    const filteredAbsent = absentStudents.filter(student => student.student.regd_no.toLowerCase().includes(lowerCaseQuery) || student.student.name.toLowerCase().includes(lowerCaseQuery));
    setFilteredPresentStudents(filteredPresent);
    setFilteredAbsentStudents(filteredAbsent);
  };

  useEffect(() => {
    const searchStudents = (query) => {
      const lowerCaseQuery = query.toLowerCase();
      const filteredPresent = presentStudents.filter(student => student.student.regd_no.toLowerCase().includes(lowerCaseQuery) || student.student.name.toLowerCase().includes(lowerCaseQuery));
      const filteredAbsent = absentStudents.filter(student => student.student.regd_no.toLowerCase().includes(lowerCaseQuery) || student.student.name.toLowerCase().includes(lowerCaseQuery));
      setFilteredPresentStudents(filteredPresent);
      setFilteredAbsentStudents(filteredAbsent);
    };
  
    if (searchQuery !== '') {
      searchStudents(searchQuery);
    } else {
      setFilteredPresentStudents(presentStudents);
      setFilteredAbsentStudents(absentStudents);
    }
  }, [searchQuery, presentStudents, absentStudents]);
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Date (YYYY-MM-DD)"
        value={date}
        keyboardType='NUMERIC'
        onChangeText={setDate}
      />
      <TouchableOpacity onPress={fetchAttendance} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setViewing('present')} style={[styles.toggleButton, viewing === 'present' && styles.selectedButton]}>
          <Text style={styles.toggleButtonText}>Present</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setViewing('absent')} style={[styles.toggleButton, viewing === 'absent' && styles.selectedButton]}>
          <Text style={styles.toggleButtonText}>Absent</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by Regd No or Name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

    <View style={styles.attendanceContainer}>
    {viewing === 'present' && filteredPresentStudents.length > 0 ? (
    <View>
      <Text style={styles.title}>Present Students:</Text>
      {filteredPresentStudents.map(student => (
        <View key={student.id}>
          <Text style={styles.studentText}>{student.student.name} - Room: {roomDetails.find(room => room.student_id.includes(student.student.student_id)).room_no}</Text>
        </View>
      ))}
    </View>
    ) : viewing === 'absent' && filteredAbsentStudents.length > 0 ? (
    <View>
      <Text style={styles.title}>Absent Students:</Text>
      {filteredAbsentStudents.map(student => (
        <View key={student.id}>
          <Text style={styles.studentText}>{student.student.name} - Room: {roomDetails.find(room => room.student_id.includes(student.student.student_id)).room_no}</Text>
        </View>
      ))}
    </View>
     ) : (
    <Text>No {viewing === 'present' ? 'present' : 'absent'} students found</Text>
  )}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    gap:10,
  },
  input: {
    // width:"100%",
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: "black",
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  toggleButton: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#007bff',
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#333',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  attendanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  studentText: {
    marginBottom: 5,
    fontSize: 16,
  },
});

export default StudentAttendance;