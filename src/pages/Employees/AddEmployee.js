import React from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import BaseContainer from "../../components/BaseContainer/BaseContainer";
import EmployeeDetailComponent from "../../components/EmployeeDetailComponent/EmployeeDetailComponent";

const EmployeeCreation = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BaseContainer>
        <EmployeeDetailComponent mode="create" />
      </BaseContainer>
      <Footer />
    </div>
  );
};

export default EmployeeCreation;