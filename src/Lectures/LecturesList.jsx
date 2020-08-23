/* eslint-disable react/no-unused-state */
import React from 'react';
import {
  Panel, Row, Col, Button,
} from 'react-bootstrap';
import jwtDecode from 'jwt-decode';
import { LinkContainer } from 'react-router-bootstrap';
import LecturesTable from './LecturesTable.jsx';
import graphQLFetch from '../graphQLFetch.js';
import store from '../store.js';
import LectureDescription from './LectureDescription.jsx';
import LectureAdd from './LectureAdd.jsx';
import MemberAdd from '../Members/MemberAdd.jsx';

export default class LecturesList extends React.Component {
  static async fetchData(match, showError) {
    const vars = { hasSelection: false, selectedId: 0 };

    const { params: { id, lectureid } } = match;
    const idInt = parseInt(id, 10);
    const lectureIdInt = parseInt(lectureid, 10);

    if (!Number.isNaN(idInt) && !Number.isNaN(lectureid)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
      vars.selectedLectureId = lectureIdInt;
    }

    const query = `query lecturesList(
      $selectedId: Int
      $selectedLectureId: Int
      $hasSelection: Boolean!
      ){
            lecturesList(
              id: $selectedId
              ) {
                id, title, lectureDate, course
            }
            lecture(
              id: $selectedLectureId
              ) @include (if : $hasSelection){
              id, title, course, lectureDate, notes
            }

           
          }`;

    const result = await graphQLFetch(query, vars, showError);
    return result;
  }

  constructor() {
    super();
    if (!localStorage.getItem('jwtToken')) return;
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
    const lectures = store.initialData ? store.initialData.LecturesList : null;
    const selectedLecture = store.initialData ? store.initialData.lecture : null;
    delete store.initialData;
    this.state = {
      lectures,
      selectedLecture,
      toastVisible: false,
      toastMessage: '',
      toastType: 'info',
      userType: decodedToken.type,
    };
    this.deleteLecture = this.deleteLecture.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  componentDidMount() {
    const { lectures } = this.state;
    if (lectures == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
      match: { params: { lectureid: prevId } },
    } = prevProps;
    const { location: { search }, match: { params: { lectureid } } } = this.props;
    if (prevSearch !== search || prevId !== lectureid) {
      this.loadData();
    }
  }

  async loadData() {
    const { match } = this.props;
    const data = await LecturesList.fetchData(match, this.showError);
    if (data) {
      this.setState({ lectures: data.lecturesList, selectedLecture: data.lecture });
    }
  }

  async deleteLecture(index) {
    const query = `mutation lectureDelete($id: Int!
      $course: CourseInputs
      ) {
      lectureDelete(
        id: $id
        course: $course
        )
    }`;
    const { lectures } = this.state;
    const { location: { pathname, search }, history } = this.props;
    const { id } = lectures[index];
    const data = await graphQLFetch(query, { id }, this.showError);
    if (data && data.lectureDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.lectures];
        if (pathname === `/./assignments/${id}`) {
          history.push({ pathname: '/assignments', search });
        }
        newList.splice(index, 1);
        return { lectures: newList };
      });
      this.showSuccess(`Deleted Lecture ${id} successfully.`);
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
    const { lectures } = this.state;
    const { match } = this.props;
    if (lectures == null) return null;
    const { selectedLecture, userType } = this.state;
    return (
      <React.Fragment>
        <LinkContainer to="/courses">
          <Button bsStyle="link">Back</Button>
        </LinkContainer>
        <Row className="main-body">
          <Col sm={4}>
            <Panel>
              <LinkContainer to={`/${match.params.id}/assignments`}>
                <Panel.Heading>
                  <Panel.Title>Assignments</Panel.Title>
                </Panel.Heading>
              </LinkContainer>
              <Panel.Heading>
                <Panel.Title>
                  Lectures
                  { userType === 'Educator'
                    ? (
                      <LectureAdd />
                    ) : null }
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <LecturesTable
                  lectures={lectures}
                  deleteLecture={this.deleteLecture}
                  userType={userType}
                />
              </Panel.Body>
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
            <LectureDescription lecture={selectedLecture} />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
