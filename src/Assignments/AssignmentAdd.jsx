import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Glyphicon, NavItem, Modal, Form, FormGroup, FormControl, ControlLabel,
  Button, ButtonToolbar, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import graphQLFetch from '../graphQLFetch.js';
import Toast from '../Toast.jsx';

class AssignmentAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      toastVisible: false,
      toastMessage: '',
      toastType: 'success',
      startDate: new Date(),
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showError = this.showError.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  handleChange(date) {
    this.setState({ startDate: date });
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
    const { startDate, showing } = this.state;
    const { toastVisible, toastMessage, toastType } = this.state;
    return (
      <React.Fragment>
        <NavItem onClick={this.showModal} className="subMenuNav">
          <OverlayTrigger
            placement="left"
            delayShow={1000}
            overlay={<Tooltip id="create-assignment">Create Assignment</Tooltip>}
          >
            <Button bsSize="xsmall">
              <Glyphicon glyph="plus" />
            </Button>
          </OverlayTrigger>
        </NavItem>
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Assignment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="assignmentAdd">
              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <FormControl name="title" autoFocus />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Due Date</ControlLabel>
                <DatePicker
                  name="dueDate"
                  selected={startDate}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Description</ControlLabel>
                <FormControl name="description" />
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

export default withRouter(AssignmentAdd);
