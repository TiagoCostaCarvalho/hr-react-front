import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BaseContainer from "../../components/BaseContainer/BaseContainer";
import CourseListComponent from "../../components/CourseListComponent/CourseListComponent";

const CourseList = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BaseContainer>
        <CourseListComponent />
      </BaseContainer>
      <Footer />
    </div>
  );
};

export default CourseList;