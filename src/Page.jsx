/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  Navbar, Nav, NavItem, NavDropdown, MenuItem, Grid, Button,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import jwtDecode from 'jwt-decode';
import { withRouter } from 'react-router-dom';
import Contents from './Contents.jsx';
import CourseAddNavItem from './Courses/CourseAddNavItem.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';

const NavBar = withRouter(({
  user, logOut,
}) => {
  function onLogOut(e) {
    e.preventDefault();
    logOut();
  }
  const navComponent = (
    <Navbar fluid>
      <Navbar.Header>
        <Navbar.Brand><img src="../img/logo.png" alt="logo" /></Navbar.Brand>
      </Navbar.Header>
      <Nav>
        <LinkContainer exact to="/">
          <NavItem>Home</NavItem>
        </LinkContainer>
        <LinkContainer to="/courses">
          <NavItem>Course List</NavItem>
        </LinkContainer>
      </Nav>
      <Nav pullRight>
        { user.type === 'Educator'
          ? (
            <CourseAddNavItem user={user} />
          )
          : null }
        <NavDropdown
          id="user-dropdown"
          title={`${user.firstName} ${user.lastName}`}
          noCaret
        >
          <LinkContainer to="/about">
            <MenuItem>About</MenuItem>
          </LinkContainer>
          <MenuItem onClick={onLogOut}>Logout</MenuItem>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
  return (
    <React.Fragment>
      {
      navComponent
    }
    </React.Fragment>
  );
});

function Footer() {
  return (
    <small>
      <hr />
      <p className="text-center">
        Full source code available at this
        {' '}
        <a href="https://github.ccs.neu.edu/NEU-CS5610-SU20/GroupProject_Big-pAPI_UI">
          Github Repository
        </a>
      </p>
    </small>
  );
}

export default class Page extends React.Component {
  constructor() {
    super();
    const userInfo = {
      email: null,
      firstName: null,
      lastName: null,
      type: null,
      id: null,
      signedIn: false,
    };
    this.state = {
      user: userInfo,
      showLogin: false,
      showSignup: false,
      showButtons: true,
      signedIn: true,
    };

    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.signUp = this.signUp.bind(this);
    this.back = this.back.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
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
        courses: null,
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
        id: decodedToken.id,
        signedIn: true,
      };
      this.setState({
        user: userInfo,
      });
    }
  }

  getUserInfo(user) {
    this.setState({ user });
    this.forceUpdate();
  }

  logIn() {
    this.setState({
      showLogin: true,
      showSignup: false,
      showButtons: false,
    });
  }

  logOut() {
    this.setState({
      signedIn: false,
    });
    localStorage.removeItem('jwtToken');
  }

  signUp() {
    this.setState({
      showLogin: false,
      showSignup: true,
      showButtons: false,
    });
  }

  back() {
    this.setState({
      showLogin: false,
      showSignup: false,
      showButtons: true,
    });
  }

  render() {
    const {
      showLogin, showSignup, showButtons, user, signedIn,
    } = this.state;

    if (user.signedIn === true && signedIn === true) {
      return (
        <div>
          <NavBar
            user={user}
            logOut={this.logOut}
          />
          <Grid fluid>
            <Contents />
          </Grid>
          <Footer />
        </div>
      );
    }
    return (
      <React.Fragment>
        <div className="login-screen">
          <div className="login-page">
            { showLogin
              ? (
                <React.Fragment>
                  <Login getUserInfo={this.getUserInfo} />
                  <center>
                    <a href="#" onClick={this.signUp} className="text-link">Need an account? Sign up</a>
                    <a href="#" onClick={this.back} className="text-link">Back</a>
                  </center>
                </React.Fragment>
              )
              : null }
            { showSignup
              ? (
                <React.Fragment>
                  <Signup />
                  <center>
                    <a href="#" onClick={this.logIn} className="text-link">Already have an account? Sign in</a>
                    <a href="#" onClick={this.back} className="text-link">&lt; Back</a>
                  </center>
                </React.Fragment>
              )
              : null }
            { showButtons
              ? (
                <React.Fragment>
                  <center><img src="../img/logo.png" alt="logo" className="home-logo" /></center>
                  <center>
                    <h1>Welcome to Bynder</h1>
                    <p>The new way for students and educators to connect.</p>
                  </center>
                  <Button className="signup-button" onClick={this.signUp}>Sign up</Button>
                  <Button className="login-button" onClick={this.logIn}>Login</Button>
                </React.Fragment>
              ) : null }
          </div>
          <ul className="circles">
            <li />
            <li />
            <li />
            <li />
            <li />
            <li />
            <li />
            <li />
            <li />
            <li />
          </ul>
        </div>
      </React.Fragment>
    );
  }
}
