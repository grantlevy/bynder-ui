import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  NavItem, Glyphicon, Modal, Form, FormGroup, FormControl, ControlLabel,
  Button, ButtonToolbar, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import graphQLFetch from '../graphQLFetch.js';
import Toast from '../Toast.jsx';

class CourseAddNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      toastVisible: false,
      toastMessage: '',
      toastType: 'success',
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
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
    e.preventDefault();
    this.hideModal();
    const form = document.forms.courseAdd;
    const course = {
      name: form.name.value,
      courseID: form.courseID.value,
      semester: form.semester.value,
    };
    const { user } = this.props;
    const educatorId = user.id;
    const query = `mutation courseAdd(
      $course: CourseInputs!
      $educatorId: Int
      ) {
      courseAdd(
        course: $course
        educatorId: $educatorId
        ) {
        id
      }
    }`;

    const data = await graphQLFetch(query, { course, educatorId }, this.showError);
    if (data) {
      const { history } = this.props;
      history.push(`/edit/${data.courseAdd.id}`);
    }
  }

  render() {
    const { showing } = this.state;
    const { toastVisible, toastMessage, toastType } = this.state;
    return (
      <React.Fragment>
        <NavItem onClick={this.showModal}>
          <OverlayTrigger
            placement="left"
            delayShow={1000}
            overlay={<Tooltip id="create-course">Create Course</Tooltip>}
          >
            <Glyphicon glyph="plus" />
          </OverlayTrigger>
          {' '}
          Create Course
        </NavItem>
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="courseAdd">
              <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl name="name" autoFocus />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Course</ControlLabel>
                <FormControl name="courseID" />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Semester</ControlLabel>
                <FormControl
                  componentClass="select"
                  name="semester"
                  onChange={this.onChange}
                >
                  <option value="Spring 2020">Spring 2020</option>
                  <option value="Summer 2020">Summer 2020</option>
                  <option value="Fall 2020">Fall 2020</option>
                </FormControl>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button
                type="button"
                bsStyle="primary"
                onClick={this.handleSubmit}
              >
                Submit
              </Button>
              <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
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

export default withRouter(CourseAddNavItem);
