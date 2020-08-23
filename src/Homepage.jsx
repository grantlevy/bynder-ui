/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Button,
} from 'react-bootstrap';
import Signup from './Signup.jsx';
import Login from './Login.jsx';

export default class Homepage extends React.Component {
  constructor() {
    super();
    const userInfo = {
      email: null,
      firstName: null,
      lastName: null,
      type: null,
      signedIn: false,
    };
    this.state = {
      user: userInfo,
    };

    this.logIn = this.logIn.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  componentDidMount() {
    if (!localStorage.getItem('jwtToken')) return;
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));

    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('jwtToken');
      const userInfo = {
        email: null,
        firstName: null,
        lastName: null,
        type: null,
        signedIn: false,
      };
      this.setState({
        user: userInfo,
      });
    } else {
      const userInfo = {
        email: decodedToken.email,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
        type: decodedToken.type,
        signedIn: true,
      };
      this.setState({
        user: userInfo,
      });
    }
  }

  logIn() {
    this.setState({
      showLogin: true,
      showSignup: false,
      showButtons: false,
    });
  }

  signUp() {
    this.setState({
      showLogin: false,
      showSignup: true,
      showButtons: false,
    });
  }

  userInfo(user) {
    this.setState({ user });
  }


  render() {
    const {
      showLogin, showSignup, showButtons, user,
    } = this.state;
    return (
      <React.Fragment>
        <div className="login-page">
          <center><img src="../img/logo.png" alt="logo" className="home-logo" /></center>
          { showLogin ? <Login /> : null }
          { showSignup ? <Signup /> : null }

          { showButtons
            ? (
              <React.Fragment>
                <center>
                  <h1>Welcome to Bynder</h1>
                  <p>The new way for students and educators to connect.</p>
                </center>
                <Button bsStyle="primary" className="signup-button" onClick={this.signUp}>Sign up</Button>
                <Button bsStyle="primary" className="login-button" onClick={this.logIn}>Login</Button>
              </React.Fragment>
            ) : null }
        </div>
      </React.Fragment>
    );
  }
}

// export default withRouter(Homepage);
