import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BaseContainer from "../../components/BaseContainer/BaseContainer";
import EmployeeDetailComponent from "../../components/EmployeeDetailComponent/EmployeeDetailComponent";

const EmployeeDetails = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BaseContainer>
        <EmployeeDetailComponent mode="update" />
      </BaseContainer>
      <Footer />
    </div>
  );
};

export default EmployeeDetails;