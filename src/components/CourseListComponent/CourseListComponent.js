import React, { useState, useEffect } from "react";
import { Button, Container, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Collapse, List, ListItem } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const CourseListComponent = () => {
    const [courses, setCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedAttendees, setExpandedAttendees] = useState({});
    const [attendeeNames, setAttendeeNames] = useState({});
    const [sortBy, setSortBy] = useState("start_date");
    const navigate = useNavigate();
    

    useEffect(() => {
      fetchCourses();
    }, [searchQuery, sortBy]);

    const fetchCourses = () => {
      axios.get(`${process.env.REACT_APP_API_URL}courses/search/`, { params: { title: searchQuery, sort_by: sortBy } })
        .then(response => setCourses(response.data))
        .catch(error => console.error("Error fetching courses:", error));
    };

    const fetchAttendeeNames = async (attendeeIds) => {
      const names = {};
      await Promise.all(attendeeIds.map(async (id) => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}employees/${id}`);
          names[id] = `${response.data.first_name} ${response.data.last_name}`;
        } catch (error) {
          console.error(`Error fetching attendee ${id}:`, error);
          names[id] = "Unknown";
        }
      }));
      return names;
    };

    const toggleAttendees = async (courseId, attendeeIds) => {
      if (!expandedAttendees[courseId]) {
        const names = await fetchAttendeeNames(attendeeIds);
        setAttendeeNames(prev => ({ ...prev, ...names }));
      }
      setExpandedAttendees(prev => ({ ...prev, [courseId]: !prev[courseId] }));
    };

    const handleSort = (field) => {
      setSortBy(prevSort => prevSort === field ? `-${field}` : field);
    };

    const getSortIcon = (field) => {
      return sortBy === field ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
    };

    useEffect(() => {console.log({attendeeNames})}, [attendeeNames]);

    return(
        <Container maxWidth="md" sx={{ mt: 4, flexGrow: 1 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Course List
        </Typography>
        <Button variant="contained" onClick={(e) => {navigate(`/courses/add`);}} fullWidth sx={{ mb: 2 }}>
          Add Course
        </Button>
        <TextField
          label="Search Courses"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Title
                  <IconButton onClick={() => handleSort("title")}>
                    {getSortIcon("title")}
                  </IconButton>
                </TableCell>
                <TableCell>
                  Start Date
                  <IconButton onClick={() => handleSort("start_date")}>
                    {getSortIcon("start_date")}
                  </IconButton>
                </TableCell>
                <TableCell>
                  End Date
                  <IconButton onClick={() => handleSort("end_date")}>
                    {getSortIcon("end_date")}
                  </IconButton>
                </TableCell>
                <TableCell>Attendees</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map(course => (
                <React.Fragment key={course.id}>
                  <TableRow>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.start_date}</TableCell>
                    <TableCell>{course.end_date}</TableCell>
                    <TableCell>
                      {course.attendees.length}
                      <IconButton onClick={() => toggleAttendees(course.id, course.attendees)}>
                        {expandedAttendees[course.id] ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {expandedAttendees[course.id] &&
                    <TableRow>
                        <TableCell colSpan={4}>
                        <Collapse in={expandedAttendees[course.id]} timeout="auto" unmountOnExit>
                            <List>
                            {course.attendees.map(attId => (
                                <ListItem key={attId}>{attendeeNames[attId] || "Loading..."}</ListItem>
                            ))}
                            </List>
                        </Collapse>
                        </TableCell>
                    </TableRow>
                  }
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
}

export default CourseListComponent;