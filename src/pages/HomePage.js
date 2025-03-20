import React from "react";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import BaseContainer from "../components/BaseContainer/BaseContainer";
import { urlPaths } from "../utils/RouterUtils";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BaseContainer>
        <main className="flex-grow flex flex-col items-center justify-center text-center">
          <h1 className="font-bold">HR Application Exercise</h1>
          <h2 className="font-bold">Main Pages:</h2>
          <ul>
            <li>
              <a href="/courses" style={{textDecoration: "none", color: "blue"}}>Courses</a>
            </li>
            <li>
              <a href="/employees/hierarchy" style={{textDecoration: "none", color: "blue"}}>Employees</a>
            </li>
          </ul>
          <h2 className="font-bold">Directly Acess:</h2>
          <ul>
            {urlPaths.filter((item) => item.showOnHome).map((item) => (
              <li key={item.path}>
                <a href={item.path} style={{textDecoration: "none", color: "blue"}}>{item.title}</a>
              </li>
            ))}
          </ul>
          <p className="text-9xl mt-4" style={{fontSize: "50px"}}>:)</p>
        </main>
      </BaseContainer>
      <Footer />
    </div>
  );
};

export default HomePage;