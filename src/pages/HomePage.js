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
          <h1 className="text-6xl font-bold">HR Application Exercise</h1>
          <h2 className="text-6xl font-bold">Main pages:</h2>
          <ul>
            {urlPaths.filter((item) => item.showOnHome).map((item) => (
              <li key={item.path}>
                <a href={item.path}>{item.title}</a>
              </li>
            ))}
          </ul>
          <p className="text-9xl mt-4">:)</p>
        </main>
      </BaseContainer>
      <Footer />
    </div>
  );
};

export default HomePage;