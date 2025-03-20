import React from "react";
import "./Header.css"
import { useNavigate } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white py-4 text-center text-xl font-bold">
      <a href="/" style={{ textDecoration: "none", color: "inherit" }}>HR Application</a>
    </header>
  );
};

export default Header;