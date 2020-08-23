import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Col, Panel, Form, FormGroup, FormControl, ControlLabel,
  ButtonToolbar, Button, Alert,
} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import DatePicker from 'react-datepicker';
import graphQLFetch from '../graphQLFetch.js';
import TextInput from '../TextInput.jsx';
import Toast from '../Toast.jsx';
import store from '../store.js';

export default class AssignmentEdit extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query assignment($id: Int!) {
      assignment(id: $id) {
        id course title dueDate description
      }
    }`;
    const { params: { id } } = match;
    const result = await graphQLFetch(query, { id: parseInt(id, 10) }, showError);
    return result;
  }

  constructor() {
    super();
    if (!localStorage.getItem('jwtToken')) return;
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
    const assignment = store.initialData ? store.initialData.assignment : null;
    delete store.initialData;
    this.state = {
      assignment,
      invalidFields: {},
      showingValidation: false,
      toastVisible: false,
      toastMessage: '',
      toastType: 'success',
      userType: decodedToken.type,
    };
    this.onChange = this.onChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.dismissValidation = this.dismissValidation.bind(this);
    this.showValidation = this.showValidation.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  componentDidMount() {
    const { assignment } = this.state;
    if (assignment == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      assignment: { ...prevState.assignment, [name]: value },
    }));
  }

  onDateChange(event, naturalValue) {
    const { assignment } = this.state;
    const { name, value: textValue } = event;
    const value = naturalValue === undefined ? textValue : naturalValue;

    this.setState(prevState => ({
      assignment: { ...prevState.assignment, [name]: value },
    }));
    assignment.dueDate = event;
  }


  onValidityChange(event, valid) {
    const { name } = event;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.showValidation();
    const { assignment, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;

    const query = `mutation assignmentUpdate(
      $id: Int!
      $changes: AssignmentUpdateInputs!
    ) {
      assignmentUpdate(
        id: $id
        changes: $changes
      ) {
        id course title dueDate description
      }
    }`;

    const { id } = assignment;
    const changes = {
      course: assignment.course,
      description: assignment.description,
      dueDate: assignment.dueDate,
      title: assignment.title,
    };

    const data = await graphQLFetch(query, { changes, id }, this.showError);
    if (data) {
      this.setState({ assignment: data.assignmentUpdate });
      this.showSuccess('Updated assignment successfully');
    }
  }

  async loadData() {
    const { match } = this.props;
    const data = await AssignmentEdit.fetchData(match, null, this.showError);
    this.setState({ assignment: data ? data.assignment : {}, invalidFields: {} });
  }

  showValidation() {
    this.setState({ showingValidation: true });
  }

  dismissValidation() {
    this.setState({ showingValidation: false });
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
    const { assignment, userType } = this.state;
    if (userType !== 'Educator') {
      return <Redirect to="/" />;
    }
    if (assignment == null) return null;
    const { assignment: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Assignment with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }

    const { invalidFields, showingValidation } = this.state;
    let validationMessage;
    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationMessage = (
        <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
          Please correct invalid fields before submitting.
        </Alert>
      );
    }

    const { assignment: { course, title } } = this.state;
    const { assignment: { dueDate, description } } = this.state;
    const { toastVisible, toastMessage, toastType } = this.state;

    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>{`Editing Assignment ${id}`}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Title</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="title"
                  value={title}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Due Date</Col>
              <Col sm={9}>
                <DatePicker
                  name="dueDate"
                  selected={dueDate}
                  onChange={this.onDateChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Description</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="description"
                  value={description}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <Button bsStyle="primary" type="submit">Submit</Button>
                  <LinkContainer to={`/${course}/assignments`}>
                    <Button bsStyle="link">Back</Button>
                  </LinkContainer>
                </ButtonToolbar>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={9}>{validationMessage}</Col>
            </FormGroup>
          </Form>
        </Panel.Body>
        <Toast
          showing={toastVisible}
          onDismiss={this.dismissToast}
          bsStyle={toastType}
        >
          {toastMessage}
        </Toast>
      </Panel>
    );
  }
}
