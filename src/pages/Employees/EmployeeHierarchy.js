import React from "react";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import EmployeeHierarchyComponent from "../../components/EmployeeHierarchyComponent/EmployeeHierarchyComponent";
import BaseContainer from "../../components/BaseContainer/BaseContainer";

const EmployeeHierarchy = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BaseContainer>
        <EmployeeHierarchyComponent />
      </BaseContainer>
      <Footer />
    </div>
  );
};

export default EmployeeHierarchy;