import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Container, Typography, Box, List, ListItem, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BaseContainer from "../../components/BaseContainer/BaseContainer";

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    role: "",
    manager: "",
    reports_to: [],
    courses: [],
    past_courses: [],
    current_courses: [],
    future_courses: []
  });

  const [roles, setRoles] = useState([]);
  const [managers, setManagers] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}employees/${id}/`)
    .then(response => {
      setEmployee({
        ...response.data,
        reports_to: response.data.reports_to || [],
        courses: response.data.courses || [],
        past_courses: response.data.past_courses || [],
        current_courses: response.data.current_courses || [],
        future_courses: response.data.future_courses || []
      });
    })
    .catch(error => console.error("Error fetching employee:", error));

    axios.get(`${process.env.REACT_APP_API_URL}roles/`)
      .then(response => setRoles(response.data))
      .catch(error => console.error("Error fetching roles:", error));

    axios.get(`${process.env.REACT_APP_API_URL}employees/`)
      .then(response => setManagers(response.data))
      .catch(error => console.error("Error fetching employees:", error));
    
    axios.get(`${process.env.REACT_APP_API_URL}courses/`)
      .then(response => setCourses(response.data))
      .catch(error => console.error("Error fetching courses:", error));
  }, [id]);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleCoursesChange = (e) => {
    setEmployee({ ...employee, courses: e.target.value });
  };

  const removeCourse = (courseId) => {
    setEmployee({ ...employee, courses: employee.courses.filter(c => c !== courseId) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${process.env.REACT_APP_API_URL}employees/${id}/`, employee)
      .catch(error => console.error("Error updating employee:", error));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BaseContainer>
      
        <Container maxWidth="sm" sx={{ mt: 4, flexGrow: 1 }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Employee Details
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="First Name" name="first_name" value={employee.first_name} onChange={handleChange} required />
            <TextField label="Last Name" name="last_name" value={employee.last_name} onChange={handleChange} required />
            <TextField label="Date of Birth" name="date_of_birth" type="date" InputLabelProps={{ shrink: true }} value={employee.date_of_birth} onChange={handleChange} required />
            <TextField select label="Role" name="role" value={employee.role} onChange={handleChange} required>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>{role.title}</MenuItem>
              ))}
            </TextField>
            {/* <TextField select label="Enroll in Course" name="courses" value={employee.courses} onChange={handleCoursesChange} SelectProps={{ multiple: true }}>
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
              ))}
            </TextField> */}
            {/* <Typography variant="h6">Enrolled Courses</Typography>
            <List>
              {employee.courses.map(course => (
                <ListItem key={course} secondaryAction={
                  <IconButton edge="end" onClick={() => removeCourse(course)}>
                    <DeleteIcon />
                  </IconButton>
                }>
                  {course}
                </ListItem>
              ))}
            </List> */}
            <Typography variant="h6">Past Courses</Typography>
            <List>{employee.past_courses.map(course => <ListItem key={course}>-> {course}</ListItem>)}</List>
            <Typography variant="h6">Current Courses</Typography>
            <List>{employee.current_courses.map(course => <ListItem key={course}>-> {course}</ListItem>)}</List>
            <Typography variant="h6">Future Courses</Typography>
            <List>{employee.future_courses.map(course => <ListItem key={course}>-> {course}</ListItem>)}</List>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Update Employee
            </Button>
          </Box>
        </Container>
      </BaseContainer>
      <Footer />
    </div>
  );
};

export default EmployeeDetails;