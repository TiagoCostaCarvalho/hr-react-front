import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 text-center text-sm mt-auto">
      &copy; {new Date().getFullYear()} HR Application. All rights reserved.
    </footer>
  );
};

export default Footer;