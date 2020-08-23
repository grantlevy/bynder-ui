/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Panel, Row, Col, Button,
} from 'react-bootstrap';
import jwtDecode from 'jwt-decode';
import { LinkContainer } from 'react-router-bootstrap';
import AssignmentTable from './AssignmentTable.jsx';
import graphQLFetch from '../graphQLFetch.js';
import Toast from '../Toast.jsx';
import store from '../store.js';
import AssignmentDescription from './AssignmentDescription.jsx';
import AssignmentAdd from './AssignmentAdd.jsx';
import GradesTable from './Grades/GradesTable.jsx';
import MemberAdd from '../Members/MemberAdd.jsx';

export default class AssignmentList extends React.Component {
  static async fetchData(match, showError, userId, userType) {
    const vars = { hasSelection: false, selectedId: 0 };
    const { params: { id, assignmentid } } = match;
    const idInt = parseInt(id, 10);
    const assignmentIdInt = parseInt(assignmentid, 10);

    if (!Number.isNaN(idInt) && !Number.isNaN(assignmentid)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
      vars.courseSelection = idInt;
      vars.selectedAssignmentId = assignmentIdInt;
    }

    if (userType === 'Student') {
      vars.studentId = userId;
    }

    const query = `query assignmentList(
      $selectedId: Int
      $selectedAssignmentId: Int
      $courseSelection: Int!
      $hasSelection: Boolean!
      $studentId: Int
      ){
            assignmentList(
              id: $selectedId
              ) {
                title dueDate course id description
            }
            assignment(
              id: $selectedAssignmentId
              ) @include (if : $hasSelection){
              id description title course dueDate
            }
            userList(course: $courseSelection) {
              id firstName lastName
            }
            gradesList(
              assignment: $selectedAssignmentId
              student: $studentId
            ) {
              id grade feedback student
            }
          }`;

    const result = await graphQLFetch(query, vars, showError);
    return result;
  }

  constructor() {
    super();
    if (!localStorage.getItem('jwtToken')) return;
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
    const assignments = store.initialData ? store.initialData.assignmentList : null;
    const selectedAssignment = store.initialData ? store.initialData.assignment : null;
    const grades = store.initialData ? store.initialData.gradesList : null;
    delete store.initialData;
    this.state = {
      assignments,
      selectedAssignment,
      grades,
      toastVisible: false,
      toastMessage: '',
      toastType: 'info',
      userType: decodedToken.type,
      showGrades: false,
      userId: decodedToken.id,
    };
    this.deleteAssignment = this.deleteAssignment.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.showGrades = this.showGrades.bind(this);
    this.hideGrades = this.hideGrades.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  componentDidMount() {
    const { assignments } = this.state;
    if (assignments == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
      match: { params: { assignmentid: prevId } },
    } = prevProps;
    const { location: { search }, match: { params: { assignmentid } } } = this.props;
    if (prevSearch !== search || prevId !== assignmentid) {
      this.loadData();
    }
  }

  async loadData() {
    const { match } = this.props;
    const { userId, userType } = this.state;
    const data = await AssignmentList.fetchData(match, this.showError, userId, userType);
    if (data) {
      this.setState({
        assignments: data.assignmentList,
        selectedAssignment: data.assignment,
        grades: data.gradesList,
      });
    }
    const { selectedAssignment } = this.state;
    if (selectedAssignment !== null && userType === 'Student') {
      this.showGrades();
    } else {
      this.hideGrades();
    }
  }

  async deleteAssignment(index) {
    const query = `mutation assignmentDelete($id: Int!
      $course: CourseInputs
      ) {
      assignmentDelete(
        id: $id
        course: $course
        )
    }`;
    const { assignments } = this.state;
    const { location: { pathname, search }, history } = this.props;
    const { id } = assignments[index];
    const data = await graphQLFetch(query, { id }, this.showError);
    if (data && data.assignmentDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.assignments];
        if (pathname === `/./assignments/${id}`) {
          history.push({ pathname: '/assignments', search });
        }
        newList.splice(index, 1);
        return { assignments: newList };
      });
      this.showSuccess(`Deleted Assignment ${id} successfully.`);
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

  showGrades() {
    this.setState({
      showGrades: true,
    });
  }

  hideGrades() {
    this.setState({
      showGrades: false,
    });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  render() {
    const {
      assignments, grades, showGrades,
    } = this.state;
    const { match } = this.props;
    if (assignments == null) return null;
    const { toastVisible, toastType, toastMessage } = this.state;
    const { selectedAssignment, userType } = this.state;
    return (
      <React.Fragment>
        <LinkContainer to="/courses">
          <Button bsStyle="link">Back</Button>
        </LinkContainer>
        <Row className="main-body">
          <Col sm={4}>
            <Panel>
              <Panel.Heading>
                <Panel.Title>
                  Assignments
                  { userType === 'Educator'
                    ? (
                      <AssignmentAdd />
                    ) : null }
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <AssignmentTable
                  assignments={assignments}
                  deleteAssignment={this.deleteAssignment}
                  userType={userType}
                />
                <Toast
                  showing={toastVisible}
                  onDismiss={this.dismissToast}
                  bsStyle={toastType}
                >
                  {toastMessage}
                </Toast>
              </Panel.Body>
              <LinkContainer to={`/${match.params.id}/lectures`}>
                <Panel.Footer>
                  <Panel.Title>Lectures</Panel.Title>
                </Panel.Footer>
              </LinkContainer>
              <LinkContainer to={`/${match.params.id}/notes`}>
                <Panel.Footer>
                  <Panel.Title>Notes</Panel.Title>
                </Panel.Footer>
              </LinkContainer>
              <LinkContainer to={`/${match.params.id}/discussions`}>
                <Panel.Footer>
                  <Panel.Title>Discussions</Panel.Title>
                </Panel.Footer>
              </LinkContainer>
            </Panel>
            { userType === 'Educator'
              ? (
                <Panel>
                  <Panel.Heading>
                    <center>Add students to your course</center>
                    <MemberAdd />
                  </Panel.Heading>
                </Panel>
              ) : null }
          </Col>
          <Col sm={8}>
            <AssignmentDescription assignment={selectedAssignment} />
            { showGrades
              ? (
                <GradesTable
                  grades={grades}
                  userType={userType}
                />
              )
              : null }
            <Toast
              showing={toastVisible}
              onDismiss={this.dismissToast}
              bsStyle={toastType}
            >
              {toastMessage}
            </Toast>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
