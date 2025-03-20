import { createBrowserRouter } from 'react-router-dom';

import HomePage from "../pages/HomePage";
import AddEmployee from "../pages/Employees/AddEmployee"
import EmployeeHierarchy from '../pages/Employees/EmployeeHierarchy';
import AddCourse from '../pages/Courses/AddCourse';
import EmployeeDetails from '../pages/Employees/EmployeeDetails';
import CourseList from '../pages/Courses/CourseList';

export const urlPaths = [
    {
      path: '/',
      element: <HomePage />, 
      title: "Home Page",
      showOnHome: false
    },
    {
      path: '/employees/add',
      element: <AddEmployee />,
      title: "Add Employee Page",
      showOnHome: true
    },
    {
      path: "/employees/:id",
      element: <EmployeeDetails />,
      title: "Employee Details Page",
      showOnHome: false
    },
    {
      path: "/employees/hierarchy",
      element: <EmployeeHierarchy />,
      title: "Employee Hierarchy",
      showOnHome: true
    },
    {
      path: "/courses/add",
      element: <AddCourse />,
      title: "Add Course Page",
      showOnHome: true
    },
    {
      path: "/courses",
      element: <CourseList />,
      title: "Course List Page",
      showOnHome: true,
    }
];

export const routerPaths = createBrowserRouter(urlPaths);