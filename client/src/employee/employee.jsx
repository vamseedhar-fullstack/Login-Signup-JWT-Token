import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const Employee = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "employee") {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/");
    } else {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
      setRole(decoded.role);
      if (decoded.role !== "employee") {
        navigate("/");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get("http://localhost:4005/employee", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error:", error);
        if (error.response && error.response.status === 401) {
          navigate("/");
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/");
  };

  return (
    <div>
    ac
    </div>
  );
};
