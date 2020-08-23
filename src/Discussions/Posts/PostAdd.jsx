import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Glyphicon, NavItem, Modal, Form, FormGroup, FormControl, ControlLabel,
  Button, ButtonToolbar, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import jwtDecode from 'jwt-decode';
import graphQLFetch from '../../graphQLFetch.js';
import Toast from '../../Toast.jsx';

class PostAdd extends React.Component {
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
    const form = document.forms.postAdd;
    const post = {
      postDate: new Date(),
      postBody: form.postBody.value,
      course: parseInt(match.params.id, 10),
      discussion: parseInt(match.params.discussionid, 10),
      read: true,
      user: userInfo.userId,
      author: `${userInfo.firstName} ${userInfo.lastName}`,
    };

    const query = `mutation postAdd($post: PostInputs) {
      postAdd(post: $post) {
        id course discussion
      }
    }`;

    const data = await graphQLFetch(query, { post }, this.showError);
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
        <NavItem onClick={this.showModal} className="addPostButton">
          <OverlayTrigger
            placement="left"
            delayShow={1000}
            overlay={<Tooltip id="create-post">Post response</Tooltip>}
          >
            <Button bsSize="xsmall">
              <Glyphicon glyph="plus" />
            </Button>
          </OverlayTrigger>
        </NavItem>
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Post response</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="postAdd">
              <FormGroup>
                <ControlLabel>Post</ControlLabel>
                <FormControl name="postBody" />
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

export default withRouter(PostAdd);
