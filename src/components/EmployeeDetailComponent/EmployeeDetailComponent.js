import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Container, Typography, Box, List, ListItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EmployeeDetailComponent = ({ mode }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [employee, setEmployee] = useState({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        role: "",
        manager: "",
        director_manager: "",
        employee_reports: [],
        reports: [],
        reports_to: [],
        reported_by: [],
        courses: [],
        past_courses: [],
        current_courses: [],
        future_courses: [],
    });

    const [roles, setRoles] = useState([]);
    const [managers, setManagers] = useState([]);
    const [oldManager, setOldManager] = useState(0);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (mode === "update") {
            axios.get(`${process.env.REACT_APP_API_URL}employees/${id}/`)
            .then(response => {
                setEmployee({
                    ...response.data,
                    director_manager: response.data.reports.filter(item => item.reported_employee_id !== response.data.manager).map(item => item.reported_employee_id)[0],
                    reports_to: response.data.reports_to || [],
                    courses: response.data.courses || [],
                    past_courses: response.data.past_courses || [],
                    current_courses: response.data.current_courses || [],
                    future_courses: response.data.future_courses || []
                });
            })
            .catch(error => console.error("Error fetching employee:", error));

            setOldManager(employee.manager);
        }

        axios.get(`${process.env.REACT_APP_API_URL}roles/`)
        .then(response => setRoles(response.data))
        .catch(error => console.error("Error fetching roles:", error));

        axios.get(`${process.env.REACT_APP_API_URL}employees/`)
        .then(response => setManagers(response.data))
        .catch(error => console.error("Error fetching employees:", error));
        
        axios.get(`${process.env.REACT_APP_API_URL}courses/`)
        .then(response => setCourses(response.data))
        .catch(error => console.error("Error fetching courses:", error));
    }, [id, mode]);

    useEffect(() => {
        const reports_to = employee?.employee_reports.filter(item => item.reporter_employee_id == id).map(item => item.reported_employee_id);
        const reported_by = employee?.employee_reports.filter(item => item.reported_employee_id == id).map(item => item.reporter_employee_id);

        setEmployee({...employee, reports_to, reported_by});
    }, [employee.employee_reports]);

    useEffect(() => {console.log({employee})}, [employee]);

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };

    const filterManagers = () => {
        return managers.filter(manager => {
            const managerRole = roles.find(role => role.id === manager.role);
            const currentRole = roles.find(role => role.id === employee.role);
            const notSameEmployee = manager.id != employee.id;
            return notSameEmployee && managerRole && currentRole && managerRole.rank + 1 == currentRole.rank;
        });
    };

    const filterDirectors = () => {
        return managers.filter(manager => manager.role == 2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const reports_to = employee.reports_to;
        const indexToRemove = reports_to.indexOf(oldManager);
        if (indexToRemove !== -1) {
            reports_to.splice(indexToRemove, 1);
        }
        reports_to.push(employee.manager);
        if(employee.director_manager != "") {
            reports_to.push(employee.director_manager);
        }

        const employeePayload = {...employee, reports_to};
        delete employeePayload.reports;
        delete employeePayload.employee_reports;

        const request = mode === "create" 
            ? axios.post(`${process.env.REACT_APP_API_URL}employees/`, employeePayload)
            : axios.put(`${process.env.REACT_APP_API_URL}employees/${id}/`, employeePayload);
        
        request
        .then(() => {
            Swal.fire({
                title: "Success!",
                text: `Employee ${mode === "create" ? "created" : "updated"} successfully!`,
                icon: "success",
                confirmButtonText: "OK"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/employees/hierarchy");
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
            console.error("Error saving employee:", error);
        });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, flexGrow: 1 }}>
            <Typography variant="h4" textAlign="center" gutterBottom>
                {mode === "create" ? "Create Employee" : "Edit Employee"}
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
                {employee.role && roles.find(role => role.id === employee.role)?.title !== "General Manager" && (
                    <TextField select label="Manager" name="manager" value={employee.manager} onChange={handleChange}>
                        <MenuItem value="">None</MenuItem>
                        {filterManagers().map((manager) => (
                            <MenuItem key={manager.id} value={manager.id}>{manager.first_name} {manager.last_name}</MenuItem>
                        ))}
                    </TextField>
                )}
                {employee.role && roles.find(role => role.id === employee.role)?.title === "Programmer" && (
                    <TextField select label="Director Manager" name="director_manager" value={employee.director_manager} onChange={handleChange}>
                        <MenuItem value="">None</MenuItem>
                        {filterDirectors().map((director) => (
                            <MenuItem key={director.id} value={director.id}>{director.first_name} {director.last_name}</MenuItem>
                        ))}
                    </TextField>
                )}
                {mode === "update" && (
                    <>
                        <Typography variant="h6">Past Courses</Typography>
                        <List>{employee.past_courses.map(course => <ListItem key={course}>-> {course}</ListItem>)}</List>
                        <Typography variant="h6">Current Courses</Typography>
                        <List>{employee.current_courses.map(course => <ListItem key={course}>-> {course}</ListItem>)}</List>
                        <Typography variant="h6">Future Courses</Typography>
                        <List>{employee.future_courses.map(course => <ListItem key={course}>-> {course}</ListItem>)}</List>
                    </>
                )}
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    {mode === "create" ? "Create" : "Update"} Employee
                </Button>
            </Box>
        </Container>
    );
}

export default EmployeeDetailComponent;