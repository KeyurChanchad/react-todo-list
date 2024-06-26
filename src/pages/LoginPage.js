// LoginPage.js

import React, { useState } from "react";
import axios from "axios";
import baseUrl from "../config";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to backend
      const response = await axios.post(`${baseUrl}/api/auth/login`, {
        username,
        password,
      });
      console.log("REspose ", response.data);

      if (response.data.success) {
        setError("");
        setCookie("authToken", response.data.token, 1);
        navigate("/");
      } else {
        setError("Invalid username or password.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };
  const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container my-5 w-50">
      <h1 className="text-center">{"Login"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            {"Enter username"}
          </label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            id="username"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            {"Enter password"}
          </label>
          <div className="d-flex">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="password"
            />
            {showPassword ? (
              <i
                class="bi bi-eye-slash-fill position-relative"
                style={{ top: "10px", right: "30px", cursor: "pointer" }}
                onClick={togglePassword}
              ></i>
            ) : (
              <i
                class="bi bi-eye-fill position-relative"
                style={{ top: "10px", right: "30px", cursor: "pointer" }}
                onClick={togglePassword}
              ></i>
            )}
          </div>
        </div>
        <div id="error" className="text-end text-danger">
          {error}
        </div>
        <Link className="d-block text-end text-primary" to="/signup">
          {"Don't have an account? Signup"}{" "}
        </Link>
        <button type="submit" className="btn btn-primary">
          {"Submit"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
