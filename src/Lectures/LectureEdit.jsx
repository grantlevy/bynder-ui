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

export default class LectureEdit extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query lecture($id: Int!) {
      lecture(id: $id) {
        id course title lectureDate notes
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
    const lecture = store.initialData ? store.initialData.lecture : null;
    delete store.initialData;
    this.state = {
      lecture,
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
    const { lecture } = this.state;
    if (lecture == null) this.loadData();
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
      lecture: { ...prevState.lecture, [name]: value },
    }));
  }

  onDateChange(event, naturalValue) {
    const { lecture } = this.state;
    const { name, value: textValue } = event;
    const value = naturalValue === undefined ? textValue : naturalValue;

    this.setState(prevState => ({
      lecture: { ...prevState.lecture, [name]: value },
    }));
    lecture.lectureDate = event;
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
    const { lecture, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;

    const query = `mutation lectureUpdate(
      $id: Int!
      $changes: LectureUpdateInputs!
    ) {
      lectureUpdate(
        id: $id
        changes: $changes
      ) {
        id course title lectureDate notes
      }
    }`;

    const { id } = lecture;
    const changes = {
      course: lecture.couse,
      notes: lecture.notes,
      lectureDate: lecture.lectureDate,
      title: lecture.title,
    };

    const data = await graphQLFetch(query, { changes, id }, this.showError);
    if (data) {
      this.setState({ lecture: data.lectureUpdate });
      this.showSuccess('Updated lecture successfully');
    }
  }

  async loadData() {
    const { match } = this.props;
    const data = await LectureEdit.fetchData(match, null, this.showError);
    this.setState({ lecture: data ? data.lecture : {}, invalidFields: {} });
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
    const { lecture, userType } = this.state;
    if (userType !== 'Educator') {
      return <Redirect to="/" />;
    }
    if (lecture == null) return null;
    const { lecture: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Lecture with ID ${propsId} not found.`}</h3>;
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

    const { lecture: { course, title } } = this.state;
    const { lecture: { lectureDate, notes } } = this.state;
    const { toastVisible, toastMessage, toastType } = this.state;

    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>{`Editing Lecture ${id}`}</Panel.Title>
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
              <Col componentClass={ControlLabel} sm={3}>Lecture Date</Col>
              <Col sm={9}>
                <DatePicker
                  name="lectureDate"
                  selected={lectureDate}
                  onChange={this.onDateChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Notes</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="notes"
                  value={notes}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <Button bsStyle="primary" type="submit">Submit</Button>
                  <LinkContainer to={`/${course}/lectures`}>
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
