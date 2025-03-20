import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Swal from 'sweetalert2';
import BaseContainer from "../../components/BaseContainer/BaseContainer";

const EmployeeCreation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    role: "",
    manager: "",
  });
  const [roles, setRoles] = useState([]);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}roles/`)
      .then(response => setRoles(response.data))
      .catch(error => console.error("Error fetching roles:", error));
    
    axios.get(`${process.env.REACT_APP_API_URL}employees/`)
      .then(response => setManagers(response.data))
      .catch(error => console.error("Error fetching employees:", error));
  }, []);

  useEffect(() => {console.log({formData})}, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}employees/`, formData)
            .then(() => navigate("/"));
            // .catch(error => console.error("Error creating employee:", error));
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Bad Data',
            text: error.response.data.non_field_errors[0],
          });
    }
    
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BaseContainer>
        <Container maxWidth="sm" sx={{ mt: 4, flexGrow: 1 }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Create Employee
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
            <TextField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required />
            <TextField label="Date of Birth" name="date_of_birth" type="date" InputLabelProps={{ shrink: true }} value={formData.date_of_birth} onChange={handleChange} required />
            <TextField select label="Role" name="role" value={formData.role} onChange={handleChange} required>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>{role.title}</MenuItem>
              ))}
            </TextField>
            {formData.role != 1 && 
              <TextField select label="Manager" name="manager" value={formData.manager} onChange={handleChange}>
                <MenuItem value="">None</MenuItem>
                {managers.map((manager) => (
                  <MenuItem key={manager.id} value={manager.id}>{manager.first_name} {manager.last_name}</MenuItem>
                ))}
              </TextField>
            }
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Employee
            </Button>
          </Box>
        </Container>
      </BaseContainer>
      <Footer />
    </div>
  );
};

export default EmployeeCreation;