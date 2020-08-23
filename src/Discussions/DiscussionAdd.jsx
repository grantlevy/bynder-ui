import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Glyphicon, Modal, Form, FormGroup, FormControl, ControlLabel,
  Button, ButtonToolbar, Tooltip, OverlayTrigger, NavItem,
} from 'react-bootstrap';
import jwtDecode from 'jwt-decode';
import graphQLFetch from '../graphQLFetch.js';
import Toast from '../Toast.jsx';

class DiscussionAdd extends React.Component {
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
    const { match } = this.props;
    e.preventDefault();
    this.hideModal();
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
    const userInfo = {
      userId: decodedToken.id,
      firstName: decodedToken.firstName,
      lastName: decodedToken.lastName,
    };
    const form = document.forms.discussionAdd;
    const discussion = {
      title: form.title.value,
      postDate: new Date(),
      postBody: form.discussionBody.value,
      course: parseInt(match.params.id, 10),
      read: true,
      user: userInfo.userId,
      author: `${userInfo.firstName} ${userInfo.lastName}`,
    };
    const query = `mutation discussionAdd($discussion: DiscussionInputs) {
      discussionAdd(discussion: $discussion) {
        id course
      }
    }`;

    const data = await graphQLFetch(query, { discussion }, this.showError);
    if (data) {
      const { history } = this.props;
      history.go();
    }
  }

  render() {
    const { showing } = this.state;
    const { toastVisible, toastMessage, toastType } = this.state;

    return (
      <React.Fragment>
        <NavItem onClick={this.showModal} className="subMenuNav">
          <OverlayTrigger
            placement="left"
            delayShow={1000}
            overlay={<Tooltip id="create-discussion">Create Discussion</Tooltip>}
          >
            <Button bsSize="xsmall">
              <Glyphicon glyph="plus" />
            </Button>
          </OverlayTrigger>
        </NavItem>
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Discussion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="discussionAdd">
              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <FormControl name="title" autoFocus />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Body</ControlLabel>
                <FormControl name="discussionBody" />
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

export default withRouter(DiscussionAdd);
