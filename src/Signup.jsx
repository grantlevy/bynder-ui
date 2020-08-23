import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Col, Form, FormGroup, FormControl, ControlLabel, Button,
} from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.signUp;
    const user = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      password: form.password.value,
      type: form.type.value,
    };
    const query = `mutation userAdd($user: UserInputs) {
      userAdd(user: $user) {
        id
      }
    }`;

    const data = await graphQLFetch(query, { user }, this.showError);

    if (data) {
      const { history } = this.props;
      history.go();
    }
  }

  render() {
    return (
      <React.Fragment>
        <center><img src="../img/logo.png" alt="logo" className="signup-logo" /></center>
        <center><h1 className="login-text">Sign up</h1></center>
        <Form horizontal name="signUp" class="signup-form">
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>First name</Col>
            <Col sm={9}>
              <FormControl type="text" name="firstName" />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Last name</Col>
            <Col sm={9}>
              <FormControl type="text" name="lastName" />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Email</Col>
            <Col sm={9}>
              <FormControl type="text" name="email" />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Password</Col>
            <Col sm={9}>
              <FormControl type="password" name="password" />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3}>Account type</Col>
            <Col sm={9}>
              <FormControl componentClass="select" name="type">
                <option value="Student">Student</option>
                <option value="Educator">Educator</option>
              </FormControl>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={6}>
              <Button type="submit" onClick={this.handleSubmit} className="signup-button">Sign up</Button>
            </Col>
          </FormGroup>
        </Form>
      </React.Fragment>
    );
  }
}

export default withRouter(Signup);
