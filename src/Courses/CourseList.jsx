/* eslint-disable max-len */
import React from 'react';
import URLSearchParams from 'url-search-params';
import {
  Panel, Row, Col,
} from 'react-bootstrap';
import jwtDecode from 'jwt-decode';
import CourseFilter from './CourseFilter.jsx';
import CourseTable from './CourseTable.jsx';
import CourseDetail from './CourseDetail.jsx';
import graphQLFetch from '../graphQLFetch.js';
import Toast from '../Toast.jsx';
import store from '../store.js';

export default class CourseList extends React.Component {
  static async fetchData(match, search, showError, userId) {
    const params = new URLSearchParams(search);
    const vars = { hasSelection: false, selectedId: 0 };

    if (params.get('semester')) vars.semester = params.get('semester');

    const { params: { id } } = match;
    vars.userId = userId;
    const idInt = parseInt(id, 10);
    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    }

    const query = `query courseList(
     
      $hasSelection: Boolean!
      $selectedId: Int!
      $userId: Int
      $semester: String
    ) {
      courseList(
        semester: $semester
        userId: $userId
      ) {
        id name courseID semester
        institution status description
      }
      course(id: $selectedId) @include (if : $hasSelection) {
        id description
      }
    }`;
    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor() {
    super();
    if (!localStorage.getItem('jwtToken')) return;
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
    const courses = store.initialData ? store.initialData.CourseList : null;
    const selectedCourse = store.initialData
      ? store.initialData.course
      : null;
    delete store.initialData;
    this.state = {
      courses,
      selectedCourse,
      toastVisible: false,
      toastMessage: '',
      toastType: 'info',
      userId: decodedToken.id,
      userType: decodedToken.type,
    };

    this.closeCourse = this.closeCourse.bind(this);
    this.deleteCourse = this.deleteCourse.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  componentDidMount() {
    const { courses } = this.state;
    if (courses == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
      match: { params: { id: prevId } },
    } = prevProps;
    const { location: { search }, match: { params: { id } } } = this.props;
    if (prevSearch !== search || prevId !== id) {
      this.loadData();
    }
  }

  async loadData() {
    const { location: { search }, match } = this.props;
    const { userId } = this.state;
    const data = await CourseList.fetchData(match, search, this.showError, userId);
    if (data) {
      this.setState({ courses: data.courseList, selectedCourse: data.course });
    }
  }

  async closeCourse(index) {
    const query = `mutation courseClose($id: Int!) {
      courseUpdate(id: $id, changes: { status: Archived }) {
        id name courseID semester
        institution status description
      }
    }`;
    const { courses } = this.state;
    const data = await graphQLFetch(query, { id: courses[index].id }, this.showError);
    if (data) {
      this.setState((prevState) => {
        const newList = [...prevState.courses];
        newList[index] = data.courseUpdate;
        return { courses: newList };
      });
    } else {
      this.loadData();
    }
  }

  async deleteCourse(index) {
    const query = `mutation courseDelete($id: Int!) {
      courseDelete(id: $id)
    }`;
    const { courses } = this.state;
    const { location: { pathname, search }, history } = this.props;
    const { id } = courses[index];
    const data = await graphQLFetch(query, { id }, this.showError);
    if (data && data.courseDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.courses];
        if (pathname === `/courses/${id}`) {
          history.push({ pathname: '/courses', search });
        }
        newList.splice(index, 1);
        return { courses: newList };
      });
      this.showSuccess(`Deleted course ${id} successfully.`);
    } else {
      this.loadData();
    }
  }

  showSuccess(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'success',
    });
  }

  showError(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'danger',
    });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  render() {
    const { courses, userType } = this.state;
    if (courses == null) {
      return (
        <Row sm={12}>
          <div className="headline">
            <center>
              <h1>Welcome to Bynder</h1>
              { userType === 'Educator'
                ? (
                  <p>It looks like you are new here! Get started by adding a course in the top right hand corner. </p>
                ) : null }
              { userType === 'Student'
                ? (
                  <p>It looks like you are new here! Your professor should be enrolling you in a course soon. Hang tight!</p>
                ) : null }
            </center>
          </div>
        </Row>
      );
    }
    const { toastVisible, toastType, toastMessage } = this.state;
    const { selectedCourse } = this.state;
    return (
      <React.Fragment>
        <Row sm={12}>
          <div className="headline">
            <h1>Welcome to Bynder</h1>
            <p>Bynder is the place for students and educators to connect for lectures, assignments, notes, and more, all in one central location.  Professors can create courses and materials for their class, and then enroll students into the class when they are ready to start the semester. Students are able to access the info for the courses they are enrolled in, and talk with one another in the discussion section. With Bynder, online learning is made easy. </p>
          </div>
        </Row>
        <Row className="main-body">
          <Col sm={4}>
            <Panel>
              <Panel.Heading>
                <Panel.Title>Filter</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <CourseFilter />
              </Panel.Body>
            </Panel>
          </Col>
          <Col sm={8}>
            <Panel>
              <Panel.Heading>
                <Panel.Title>Your Courses</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <CourseTable
                  courses={courses}
                  closeCourse={this.closeCourse}
                  deleteCourse={this.deleteCourse}
                  userType={userType}
                />
                <CourseDetail course={selectedCourse} />
                <Toast
                  showing={toastVisible}
                  onDismiss={this.dismissToast}
                  bsStyle={toastType}
                >
                  {toastMessage}
                </Toast>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
