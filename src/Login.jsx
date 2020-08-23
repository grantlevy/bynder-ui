/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */

import React from 'react';
import {
  Form, FormGroup, FormControl, ControlLabel, Button, Col,
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import graphQLFetch from './graphQLFetch.js';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: null,
        password: null,
      },
      error: false,
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      user: { ...prevState.user, [name]: value },
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.logIn;
    const email = form.email.value;
    const password = form.password.value;

    const query = `mutation login(
      $email: String!
      $password: String!
      ) {
      login(user:{
        email: $email
        password: $password}) {
        id
        token
        email
        firstName
        lastName
        type
      }
    }`;

    const data = await graphQLFetch(query, { email, password }, this.showError);

    const { getUserInfo } = this.props;
    if (data) {
      const {
        id, email, token, firstName, lastName, type,
      } = data.login;
      localStorage.setItem('jwtToken', token);
      getUserInfo({
        email, firstName, lastName, type, signIn: true,
      });
      const { history } = this.props;
      history.go();
    } else {
      this.setState({
        error: true,
      });
    }
  }

  render() {
    const { user: { email, password }, error } = this.state;
    return (
      <React.Fragment>
        <center><img src="../img/logo.png" alt="logo" className="login-logo" /></center>
        <center><h1 className="login-text">Login</h1></center>
        <Form horizontal name="logIn" class="signup-form">
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Email</Col>
            <Col sm={9}>
              <FormControl
                type="username"
                name="email"
                value={email}
                onChange={this.onChange}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Password</Col>
            <Col sm={9}>
              <FormControl
                type="password"
                name="password"
                value={password}
                onChange={this.onChange}
              />
              { error ? <p>Wrong username or password</p> : null }
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={6}>
              <Button type="submit" onClick={this.handleSubmit} className="login-button">Login</Button>
            </Col>
          </FormGroup>
        </Form>
      </React.Fragment>
    );
  }
}

export default withRouter(Login);
