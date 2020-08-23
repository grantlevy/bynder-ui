import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Col, Panel, Form, FormGroup, FormControl, ControlLabel,
  ButtonToolbar, Button, Alert,
} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import graphQLFetch from '../../graphQLFetch.js';
import TextInput from '../../TextInput.jsx';
import Toast from '../../Toast.jsx';
import store from '../../store.js';

export default class NoteEdit extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query post($id: Int!) {
      post(id: $id) {
        id postBody course discussion user read
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
    const post = store.initialData ? store.initialData.post : null;
    delete store.initialData;
    this.state = {
      post,
      invalidFields: {},
      showingValidation: false,
      toastVisible: false,
      toastMessage: '',
      toastType: 'success',
      userType: decodedToken.type,
      userId: decodedToken.id,
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.dismissValidation = this.dismissValidation.bind(this);
    this.showValidation = this.showValidation.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  componentDidMount() {
    const { post } = this.state;
    if (post == null) this.loadData();
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
      post: { ...prevState.post, [name]: value },
    }));
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
    const { post, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;

    const query = `mutation postUpdate(
      $id: Int!
      $changes: PostUpdateInputs!
    ) {
      postUpdate(
        id: $id
        changes: $changes
      ) {
        id postBody course discussion
      }
    }`;

    const { id } = post;
    const changes = {
      postBody: post.postBody,
    };

    const data = await graphQLFetch(query, { changes, id }, this.showError);
    if (data) {
      this.setState({ post: data.postUpdate });
      this.showSuccess('Updated post successfully');
    }
  }

  async loadData() {
    const { match } = this.props;
    const data = await NoteEdit.fetchData(match, null, this.showError);
    this.setState({ post: data ? data.post : {}, invalidFields: {} });
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
    const { post, userId, userType } = this.state;
    if (post == null) return null;
    if (userType !== 'Educator' && userId !== post.user) {
      return <Redirect to="/" />;
    }
    const { post: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Post with ID ${propsId} not found.`}</h3>;
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
    const { post: { postBody, course, discussion } } = this.state;
    const { toastVisible, toastMessage, toastType } = this.state;
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>{`Editing Post ${id}`}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Post Body</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  name="postBody"
                  value={postBody}
                  onChange={this.onChange}
                  key={id}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <Button bsStyle="primary" type="submit">Submit</Button>
                  <LinkContainer to={`/${course}/discussions/${discussion}`}>
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
