import React from "react";
import { NavLink } from "react-router-dom";
import "../components/Style.css";
const navActive = ({ isActive }) => {
  return { fontWeight: isActive ? "bold" : "" };
};

export const Navbar = () => {
  return (
    <div>
      <ul>
        <li>
          <NavLink to={"/"} style={navActive}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to={"/add-contact"} style={navActive}>
            Add Contact
          </NavLink>
        </li>
      </ul>
    </div>
  );
};
