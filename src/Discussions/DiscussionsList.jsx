import React from 'react';
import {
  Panel, Row, Col, Button,
} from 'react-bootstrap';
import jwtDecode from 'jwt-decode';
import { LinkContainer } from 'react-router-bootstrap';
import DiscussionsTable from './DiscussionsTable.jsx';
import graphQLFetch from '../graphQLFetch.js';
import store from '../store.js';
import DiscussionDescription from './DiscussionDescription.jsx';
import PostsTable from './Posts/PostsTable.jsx';
import PostAdd from './Posts/PostAdd.jsx';
import DiscussionAdd from './DiscussionAdd.jsx';
import Toast from '../Toast.jsx';
import MemberAdd from '../Members/MemberAdd.jsx';

export default class DiscussionsList extends React.Component {
  static async fetchData(match, showError) {
    const vars = { hasSelection: false, selectedId: 0 };

    const { params: { id, discussionid } } = match;
    const idInt = parseInt(id, 10);
    const discussionIdInt = parseInt(discussionid, 10);

    if (!Number.isNaN(idInt) && !Number.isNaN(discussionid)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
      vars.selectedDiscussionsId = discussionIdInt;
    }

    const query = `query discussionList(
      $selectedId: Int
      $selectedDiscussionsId: Int
      $hasSelection: Boolean!
      ){
            discussionList(
              id: $selectedId
              ) {
                id, title, postDate, course, user, author
            }
            discussion(
              id: $selectedDiscussionsId
              ) @include (if : $hasSelection){
              id, title, course, postDate, postBody, read, user, author
            }
            postList(
              discussion: $selectedDiscussionsId
              ) @include (if : $hasSelection){
                id, postDate, course, postBody, read, user, author
              }

           
          }`;

    const result = await graphQLFetch(query, vars, showError);
    return result;
  }

  constructor() {
    super();
    if (!localStorage.getItem('jwtToken')) return;
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
    const discussions = store.initialData ? store.initialData.DiscussionsList : null;
    const selectedDiscussions = store.initialData ? store.initialData.discussion : null;
    const selectedPosts = store.initialData ? store.initialData.DiscussionsList : null;
    delete store.initialData;
    this.state = {
      discussions,
      selectedDiscussions,
      selectedPosts,
      showAddPost: false,
      toastVisible: false,
      toastMessage: '',
      toastType: 'info',
      userId: decodedToken.id,
      userType: decodedToken.type,
    };
    this.deletePost = this.deletePost.bind(this);
    this.deleteDiscussion = this.deleteDiscussion.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
    this.showPostButton = this.showPostButton.bind(this);
    this.hidePostButton = this.hidePostButton.bind(this);
  }

  componentDidMount() {
    const { discussions } = this.state;
    if (discussions == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
      match: { params: { discussionid: prevId } },
    } = prevProps;
    const { location: { search }, match: { params: { discussionid } } } = this.props;
    if (prevSearch !== search || prevId !== discussionid) {
      this.loadData();
    }
  }

  async loadData() {
    const { match } = this.props;
    const data = await DiscussionsList.fetchData(match, this.showError);
    if (data) {
      this.setState({
        discussions: data.discussionList,
        selectedDiscussions: data.discussion,
        selectedPosts: data.postList,
      });
    }
    const { selectedDiscussions } = this.state;
    if (selectedDiscussions !== null) {
      this.showPostButton();
    } else {
      this.hidePostButton();
    }
  }

  async deletePost(index) {
    const query = `mutation postDelete($id: Int!
      $course: CourseInputs
      ) {
      postDelete(
        id: $id
        course: $course
        )
    }`;
    const { selectedPosts } = this.state;
    const { id } = selectedPosts[index];
    const data = await graphQLFetch(query, { id }, this.showError);
    if (data && data.postDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.selectedPosts];
        newList.splice(index, 1);
        return { selectedPosts: newList };
      });
      this.showSuccess(`Deleted Post ${id} successfully.`);
    } else {
      this.loadData();
    }
  }

  async deleteDiscussion(index) {
    const query = `mutation discussionDelete($id: Int!
      $course: CourseInputs
      ) {
      discussionDelete(
        id: $id
        course: $course
        )
    }`;
    const { discussions } = this.state;
    const { history } = this.props;
    const { id } = discussions[index];
    const data = await graphQLFetch(query, { id }, this.showError);
    if (data && data.discussionDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.discussions];
        newList.splice(index, 1);
        return { discussions: newList };
      });
      history.push({ pathname: './' });
      this.showSuccess(`Deleted Discussion ${id} successfully.`);
    } else {
      this.loadData();
    }
  }

  showPostButton() {
    this.setState({
      showAddPost: true,
    });
  }

  hidePostButton() {
    this.setState({
      showAddPost: false,
    });
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
    const { discussions, showAddPost } = this.state;
    const { match } = this.props;
    if (discussions == null) return null;
    const { toastVisible, toastType, toastMessage } = this.state;
    const {
      selectedDiscussions, selectedPosts, userId, userType,
    } = this.state;
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
              <LinkContainer to={`/${match.params.id}/lectures`}>
                <Panel.Heading>
                  <Panel.Title>Lectures</Panel.Title>
                </Panel.Heading>
              </LinkContainer>
              <LinkContainer to={`/${match.params.id}/notes`}>
                <Panel.Heading>
                  <Panel.Title>Notes</Panel.Title>
                </Panel.Heading>
              </LinkContainer>
              <Panel.Heading>
                <Panel.Title>
                  Discussions
                  <DiscussionAdd />
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <DiscussionsTable
                  discussions={discussions}
                  deleteDiscussion={this.deleteDiscussion}
                  userId={userId}
                  userType={userType}
                />
              </Panel.Body>
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
            <DiscussionDescription
              discussion={selectedDiscussions}
              userId={userId}
              userType={userType}
            />
            <PostsTable
              posts={selectedPosts}
              deletePost={this.deletePost}
              userId={userId}
              userType={userType}
            />
            { showAddPost
              ? (
                <PostAdd />
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
