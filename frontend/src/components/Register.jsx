import React, { Component } from "react";
import swal from "sweetalert";
const axios = require("axios");

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      password: "",
      confirm_password: "",
      role: ""
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  register = (e) => {

    e.preventDefault();
    
    if (this.state.password !== this.state.confirm_password) {
      swal({
        text: "Password and Confirm Password did not match!",
        icon: "error",
        type: "error"
      });
    } else if (this.state.role === ''){
      swal({
        text: "You need to choose a role",
        icon: "error",
        type: "error"
      });

    }else {
      axios
        .post("http://localhost:6969/register", {
          fname: this.state.fname,
          lname: this.state.lname,
          email: this.state.email,
          password: this.state.password,
          role: this.state.role
        })
        .then((res) => {
          swal({
            text: res.data.title,
            icon: "success",
            type: "success"
          }).then((res)=>{
            window.location.assign("/login");
          })
        })
        .catch(() => {
          swal({
            text: "Username " + this.state.email + " Already Exist!",
            icon: "error",
            type: "error"
          });
        });
    }
  };

  render() {
    return (
      <div className="register form-control">
        <form onSubmit={this.register} method="post">
          <h3>
            Sign Up
          </h3>

          <div className="left form-group">
            <label>First Name</label>
            <input
              type="text"
              autoComplete="off"
              name="fname"
              value={this.state.fname}
              onChange={this.onChange}
              className="form-control"
              placeholder="First Name"
              required
            />
          </div>

          <div className="left form-group">
            <label>Last Name</label>
            <input
              type="text"
              autoComplete="off"
              name="lname"
              value={this.state.lname}
              onChange={this.onChange}
              className="form-control"
              placeholder="Last Name"
              required
            />
          </div>

          <div className="left form-group">
            <label>Email address</label>
            <input
              type="email"
              autoComplete="off"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
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
              value={this.state.password}
              onChange={this.onChange}
              className="form-control"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="left form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              autoComplete="off"
              name="confirm_password"
              value={this.state.confirm_password}
              onChange={this.onChange}
              className="form-control"
              placeholder="Re-Enter password"
              required
            />
          </div>

          <div className="left form-group">
            <label htmlFor="role">Role</label>

            <select className="form-select" name="role" id="role" onChange={this.onChange}>
              <option value=''>Choose A Role</option>
              <option value="Admin">Admin</option>
              <option value="Author">Author</option>
              <option value="General Editor"> General Editor</option>
              <option value="Editor">Editor</option>
              <option value="Reviewer">Reviewer</option>
              <option value="User">Normal User</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
          >
            Register New Account
          </button>
          <p className="forgot-password text-right">
            Already a user? <a href="/login">Login</a>
          </p>
        </form>
      </div>

    );
  }
}
