import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, List, ListItem, ListItemText, Collapse, Container, Typography, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const roleColors = [
  "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#FFD700", "#8A2BE2", "#FF4500", "#00CED1"
];

const EmployeeHierarchy = () => {
  const [hierarchy, setHierarchy] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [expandAll, setExpandAll] = useState(false);
  const [roles, setRoles] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}roles/`)
      .then(response => {
        const roleMap = {};
        response.data.forEach((role, index) => {
          roleMap[role.id] = { title: role.title, color: roleColors[index % roleColors.length] };
        });
        setRoles(roleMap);
      })
      .catch(error => console.error("Error fetching roles:", error));

    axios.get(`${process.env.REACT_APP_API_URL}employees/hierarchy/`)
      .then(response => setHierarchy(response.data))
      .catch(error => console.error("Error fetching employee hierarchy:", error));
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpandAll = () => {
    const newExpandState = {};
    const setAllExpanded = (employees) => {
      employees.forEach(emp => {
        newExpandState[emp.id] = !expandAll;
        if (emp.reporter_employees.length > 0) setAllExpanded(emp.reporter_employees);
      });
    };
    setAllExpanded(hierarchy);
    setExpanded(newExpandState);
    setExpandAll(!expandAll);
  };

  const handleViewEmployee = (id) => {
    navigate(`/employees/${id}`);
  };

  const renderHierarchy = (employees, depth = 0) => (
    <List sx={{ marginLeft: depth > 0 ? 2 : 0, borderLeft: depth > 0 ? "1px solid lightgrey" : "none", paddingLeft: 1 }}>
      {employees.map((employee) => (
        <div key={employee.id}>
          <ListItem
            button
            onClick={() => toggleExpand(employee.id)}
            sx={{
              borderLeft: `5px solid ${roles[employee.role]?.color || "#000"}`,
              paddingLeft: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <ListItemText
              primary={`Name: ${employee.first_name} ${employee.last_name} -- Role: ${roles[employee.role]?.title || "Unknown"}`}
            />
            <IconButton onClick={() => handleViewEmployee(employee.id)} aria-label="view">
              <VisibilityIcon />
            </IconButton>
            {employee.reporter_employees.length > 0 && (
              expanded[employee.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />
            )}
          </ListItem>
          <Collapse in={expanded[employee.id]} timeout="auto" unmountOnExit>
            {employee.reporter_employees.length > 0 && renderHierarchy(employee.reporter_employees, depth + 1)}
          </Collapse>
        </div>
      ))}
    </List>
  );

  return (
    <Container maxWidth="md">
      <Typography variant="h4" textAlign="center" gutterBottom>
        Employee Hierarchy
      </Typography>
      <Button variant="contained" onClick={handleExpandAll} fullWidth>
        {expandAll ? "Collapse All" : "Expand All"}
      </Button>
      {renderHierarchy(hierarchy)}
    </Container>
  );
};

export default EmployeeHierarchy;
