import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BaseContainer from "../../components/BaseContainer/BaseContainer";
import Swal from "sweetalert2";

const AddCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    start_date: "",
    end_date: "",
    attendees: [],
  });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}employees/`)
      .then(response => setEmployees(response.data))
      .catch(error => console.error("Error fetching employees:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAttendeeChange = (e) => {
    setFormData({ ...formData, attendees: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}courses/`, formData)
      .then(() => {
        Swal.fire({
            title: "Success!",
            text: `Course created successfully!`,
            icon: "success",
            confirmButtonText: "OK"
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/courses");
            }
        });
    })
    .catch(error => {
        console.log({error});
        Swal.fire({
            title: "Error!",
            text: error.response.data.non_field_errors[0],
            icon: "error",
            confirmButtonText: "OK"
        });
        console.error("Error saving course:", error);
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BaseContainer>
        <Container maxWidth="sm" sx={{ mt: 4, flexGrow: 1 }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Add New Course
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Course Title" name="title" value={formData.title} onChange={handleChange} required />
            <TextField label="Start Date" name="start_date" type="date" InputLabelProps={{ shrink: true }} value={formData.start_date} onChange={handleChange} required />
            <TextField label="End Date" name="end_date" type="date" InputLabelProps={{ shrink: true }} value={formData.end_date} onChange={handleChange} required />
            <TextField select label="Attendees" name="attendees" value={formData.attendees} onChange={handleAttendeeChange} SelectProps={{ multiple: true, max: 5 }} required>
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Course
            </Button>
          </Box>
        </Container>
      </BaseContainer>
      <Footer />
    </div>
  );
};

export default AddCourse;