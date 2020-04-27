import React, { useState } from "react";
import "./AuthScreen.css";
import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import { Redirect } from "react-router-dom"
import { Tabs, Tab, TabContent, TabPane, Nav, Row, Col } from 'react-bootstrap'
import { connect } from "react-redux"
import { registerHandler, loginHandler } from "../../../redux/actions"
import Cookie from 'universal-cookie';

const cookieObject = new Cookie();

class AuthScreen extends React.Component {

  state = {
    log_username: "",
    log_password: "",
    reg_username: "",
    reg_email: "",
    reg_password: "",
    reg_repeat_password: "",
    is_loading: false
  }

  componentDidUpdate() {
    if (this.props.user.id) {
      cookieObject.set("authData", JSON.stringify(this.props.user))
    }
  }

  inputHandler = (event, field) => {
    this.setState({ [field]: event.target.value })
  }

  login = () => {
    const { log_username, log_password } = this.state

    const userData = {
      username: log_username,
      password: log_password
    }

    //this.setState({ is_loading: true })

    this.props.loginHandler(userData)

    // this.setState({ is_login: true })

  }

  register = () => {
    const { reg_username, reg_password, reg_repeat_password, reg_email } = this.state

    // this.setState({ registering: true })
    if (reg_password === reg_repeat_password) {
      const userData = {
        username: reg_username,
        password: reg_password,
        email: reg_email
      }
      this.props.registerHandler(userData)
    }
    else {
      alert("Password tidak sesuai!")
    }

    // this.setState({ registering: false })
  }

  render() {
    const { log_username, log_password, reg_username, reg_password, reg_repeat_password, reg_email, is_loading } = this.state

    if (this.props.user.id) {
      return <Redirect to="/" />
    }

    return (
      <div className="container">
        <div className="row mt-5">
          <div className="col-5">
            <div>

              <Tab.Container defaultActiveKey="first">
                <Row>
                  <Nav variant="pills" className="pill">
                    <Nav.Item>
                      <Nav.Link eventKey="first">Register</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second">Login</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Row>
                <br />
                <Row>
                  <Tab.Content>
                    <Tab.Pane eventKey="first">
                      <h3>Register</h3>
                      <p className="mt-4">
                        You wil get the best recommendation for rent
                        <br /> house in near of you
                      </p>
                      <TextField onChange={(e) => this.inputHandler(e, "reg_username")} value={reg_username} placeholder="Username" type="text" className="mt-3" />
                      <TextField onChange={(e) => this.inputHandler(e, "reg_email")} value={reg_email} placeholder="Email" type="email" className="mt-3" />

                      <TextField onChange={(e) => this.inputHandler(e, "reg_password")} value={reg_password} placeholder="Password" type="password" className="mt-3" />
                      <TextField onChange={(e) => this.inputHandler(e, "reg_repeat_password")} value={reg_repeat_password} placeholder="Confirm Password" type="password" className="mt-3" />

                      <div className="form-check mt-3">
                        <input type="checkbox" className="form-check-input" />
                        <label className="form-check-label" for="exampleCheck1">I agree to <a href="#">Terms of Use</a></label>
                      </div>

                      <div className="d-flex justify-content-center">
                        <ButtonUI onClick={this.register} type="contained" className="mt-4">
                          Register
                        </ButtonUI>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <h3>Log In</h3>
                      <p className="mt-4">
                        Welcome back.
                        <br /> Please, login to your account
                      </p>
                      <TextField onChange={(e) => this.inputHandler(e, "log_username")} value={log_username} placeholder="Username" type="text" className="mt-5" />
                      <TextField onChange={(e) => this.inputHandler(e, "log_password")} value={log_password} placeholder="Password" type="password" className="mt-3" />
                      <div className="d-flex justify-content-center">
                        <ButtonUI onClick={this.login} type="contained" className="mt-4">
                          Login
                        </ButtonUI>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Row>
              </Tab.Container>
            </div>
          </div>
          <div className="col-7">Picture</div>
        </div>
      </div>
    );
  }
}

export default connect((state) => ({ user: state.user }), { registerHandler, loginHandler })(AuthScreen)
