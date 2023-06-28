import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import swal from "sweetalert";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const location = useLocation();
  const [user, setUser] = useAuth(); // <--- { UseContext(UserContext) } ringkasan
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await (
      await fetch("http://localhost:6969/login", {
        method: "POST",
        credentials: "include", // Needed to include the cookie
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
    ).json();

    if (result.accesstoken) {
      setUser({
        accesstoken: result.accesstoken
      });

      swal({
        text: "Login Succesful!",
        icon: "success",
        type: "success"
      }).then((res) => {
        window.location.href = "/";
      });
    } else {
      swal({
        text: result.errorMessage,
        icon: "error",
        type: "error"
      });
    }
  };

  const handleChange = (e) => {
    if (e.currentTarget.name === "email") {
      setEmail(e.currentTarget.value);
    } else {
      setPassword(e.currentTarget.value);
    }
  };

  return user.accesstoken ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : (
    <div className="login form-control">
      <form onSubmit={handleSubmit} method="post">
        <h3>Sign In</h3>

        <div className="left form-group">
          <label>Email address</label>
          <input
            type="email"
            autoComplete="off"
            name="email"
            value={email}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter email"
            required
          />
        </div>

        <div className="left form-group">
          <label>Password</label>
          <input
            type="password"
            autoComplete="off"
            name="password"
            value={password}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter password"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Sign In
        </button>
        <p className="forgot-password text-right">
          No Account? <a href="/register">Create Account</a>
        </p>
      </form>
    </div>
  );
}
