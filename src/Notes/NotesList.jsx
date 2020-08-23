/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Panel, Row, Col, Button,
} from 'react-bootstrap';
import jwtDecode from 'jwt-decode';
import { LinkContainer } from 'react-router-bootstrap';
import NotesTable from './NotesTable.jsx';
import graphQLFetch from '../graphQLFetch.js';
import store from '../store.js';
import NoteDescription from './NoteDescription.jsx';
import NoteAdd from './NoteAdd.jsx';
import MemberAdd from '../Members/MemberAdd.jsx';

export default class NotesList extends React.Component {
  static async fetchData(match, showError) {
    const vars = { hasSelection: false, selectedId: 0 };

    const { params: { id, noteid } } = match;
    const idInt = parseInt(id, 10);
    const noteIdInt = parseInt(noteid, 10);

    if (!Number.isNaN(idInt) && !Number.isNaN(noteid)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
      vars.selectedNoteId = noteIdInt;
    }

    const query = `query notesList(
      $selectedId: Int
      $selectedNoteId: Int
      $hasSelection: Boolean!
      ){
            notesList(
              id: $selectedId
              ) {
                id, title, noteDate, course
            }
            note(
              id: $selectedNoteId
              ) @include (if : $hasSelection){
              id, title, noteDate, noteBody, course
            } 
          }`;


    const result = await graphQLFetch(query, vars, showError);
    return result;
  }

  constructor() {
    super();
    if (!localStorage.getItem('jwtToken')) return;
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
    const notes = store.initialData ? store.initialData.notesList : null;
    const selectedNote = store.initialData ? store.initialData.note : null;
    delete store.initialData;
    this.state = {
      notes,
      selectedNote,
      toastVisible: false,
      toastMessage: '',
      toastType: 'info',
      userType: decodedToken.type,
    };
    this.deleteNote = this.deleteNote.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  componentDidMount() {
    const { notes } = this.state;
    if (notes == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
      match: { params: { noteid: prevId } },
    } = prevProps;
    const { location: { search }, match: { params: { noteid } } } = this.props;
    if (prevSearch !== search || prevId !== noteid) {
      this.loadData();
    }
  }

  async loadData() {
    const { match } = this.props;
    const data = await NotesList.fetchData(match, this.showError);
    if (data) {
      this.setState({ notes: data.notesList, selectedNote: data.note });
    }
  }

  async deleteNote(index) {
    const query = `mutation noteDelete($id: Int!
      $course: CourseInputs
      ) {
      noteDelete(
        id: $id
        course: $course
        )
    }`;
    const { notes } = this.state;
    const { location: { pathname, search }, history } = this.props;
    const { id } = notes[index];
    const data = await graphQLFetch(query, { id }, this.showError);
    if (data && data.noteDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.notes];
        if (pathname === `/./notes/${id}`) {
          history.push({ pathname: '/notes', search });
        }
        newList.splice(index, 1);
        return { notes: newList };
      });
      this.showSuccess(`Deleted Note ${id} successfully.`);
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
    const { notes } = this.state;
    const { match } = this.props;
    if (notes == null) return null;
    const { toastVisible, toastType, toastMessage } = this.state;
    const { selectedNote, userType } = this.state;

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
              <Panel.Heading>
                <Panel.Title>
                  Notes
                  { userType === 'Educator'
                    ? (
                      <NoteAdd />
                    ) : null }
                </Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <NotesTable
                  notes={notes}
                  deleteNote={this.deleteNote}
                  userType={userType}
                />
              </Panel.Body>
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
            <NoteDescription note={selectedNote} />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
