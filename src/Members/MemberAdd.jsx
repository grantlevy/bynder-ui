import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Glyphicon, NavItem, Modal, Col, Panel, Form, FormGroup, FormControl, ControlLabel,
  Button, ButtonToolbar, Tooltip, OverlayTrigger, Alert,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import { LinkContainer } from 'react-router-bootstrap';
import store from '../store.js';
import graphQLFetch from '../graphQLFetch.js';
import Toast from '../Toast.jsx';
import MemberTable from './MemberTable.jsx';
import AntiMemberTable from './AntiMembersTable.jsx';

class MemberAdd extends React.Component {
  static async fetchData(match, showError) {
    const vars = { courseSelection: 0 };
    const courseInt = parseInt(match.params.id, 10);
    vars.courseSelection = courseInt;

    const query = `query userList(
      $courseSelection: Int!
      ){
        userList(course: $courseSelection) {
          id firstName lastName type
        }
        antiUserList(course: $courseSelection) {
          id firstName lastName type
        }
      }`;

    const result = await graphQLFetch(query, vars, showError);
    return result;
  }

  constructor(props) {
    super(props);
    const classMembers = store.initialData ? store.initialData.userList : null;
    const antiClassMembers = store.initialData ? store.initialData.userList : null;
    this.state = {
      classMembers,
      antiClassMembers,
      showing: false,
      toastVisible: false,
      toastMessage: '',
      toastType: 'success',
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showError = this.showError.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
    this.addMember = this.addMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.loadData();
  }

  componentDidMount() {
    const { classMembers } = this.state;
    if (classMembers == null) this.loadData();
  }

  // componentDidUpdate(prevProps) {
  //   const {
  //     location: { search: prevSearch },
  //     match: { params: { assignmentid: prevId } },
  //   } = prevProps;
  //   const { location: { search }, match: { params: { assignmentid } } } = this.props;
  //   if (prevSearch !== search || prevId !== assignmentid) {
  //     this.loadData();
  //   }
  // }

  async loadData() {
    const { match } = this.props;

    const data = await MemberAdd.fetchData(match, this.showError);
    if (data) {
      this.setState({
        classMembers: data.userList,
        antiClassMembers: data.antiUserList,
      });
    }
  }

  async addMember(student) {
    const { match } = this.props;
    const course = parseInt(match.params.id, 10);
    const query = `mutation courseAddStudent(
      $course: Int!
      $student: Int!) {
      courseAddStudent(
        course: $course
        student: $student
      ){
        id courses
      }
    }`;
    await graphQLFetch(query, { course, student }, this.showError);
    this.loadData();
  }

  async removeMember(student) {
    const { match } = this.props;
    const course = parseInt(match.params.id, 10);
    const query = `mutation courseRemoveStudent(
      $course: Int!
      $student: Int!) {
        courseRemoveStudent(
        course: $course
        student: $student
      ){
        id courses
      }
    }`;
    await graphQLFetch(query, { course, student }, this.showError);
    this.loadData();
  }


  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  showError(message) {
    this.setState({
      toastVisible: true, toastMessage: message, toastType: 'danger',
    });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  async handleSubmit(e) {
    const { match } = this.props;
    e.preventDefault();
    this.hideModal();
    const form = document.forms.assignmentAdd;

    const assignment = {
      title: form.title.value,
      dueDate: form.dueDate.value,
      description: form.description.value,
      course: parseInt(match.params.id, 10),
    };

    const query = `mutation assignmentAdd($assignment: AssignmentInputs) {
      assignmentAdd(assignment: $assignment) {
        id course
      }
    }`;

    const data = await graphQLFetch(query, { assignment }, this.showError);

    if (data) {
      const { history } = this.props;
      history.push(`../assignmentupdate/${data.assignmentAdd.course}/${data.assignmentAdd.id}`);
    }
  }

  render() {
    const { showing, classMembers, antiClassMembers } = this.state;

    // const { assignment } = this.state;
    const { toastVisible, toastMessage, toastType } = this.state;
    return (
      <React.Fragment>
        <NavItem onClick={this.showModal} className="subMenuNav addStudent">
          <OverlayTrigger
            placement="left"
            delayShow={1000}
            overlay={<Tooltip id="create-assignment">Edit class members</Tooltip>}
          >
            <Button bsSize="xsmall">
              <Glyphicon glyph="plus" />
            </Button>
          </OverlayTrigger>
        </NavItem>
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Students enrolled</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MemberTable
              members={classMembers}
              removeMember={this.removeMember}
            />
          </Modal.Body>
          <Modal.Header>
            <Modal.Title>Students not enrolled</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AntiMemberTable
              members={antiClassMembers}
              addMember={this.addMember}
            />
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button bsStyle="link" onClick={this.hideModal}>Done</Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
        <Toast
          showing={toastVisible}
          onDismiss={this.dismissToast}
          bsStyle={toastType}
        >
          {toastMessage}
        </Toast>
      </React.Fragment>
    );
  }
}

export default withRouter(MemberAdd);