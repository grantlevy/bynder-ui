import React from 'react';
import {
  Table, Button, Glyphicon, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

const NoteRow = withRouter(({
  note,
  location: { search },
  deleteNote,
  index,
  userType,
}) => {
  const selectLocation = { pathname: `/${note.course}/notes/${note.id}`, search };
  const deleteTooltip = (
    <Tooltip id="delete-tooltip" placement="bottom,">Delete Note</Tooltip>
  );
  const noteUpdateTooltip = (
    <Tooltip id="editNote-tooltip" placement="top">Edit Note</Tooltip>
  );

  function onDelete(e) {
    e.preventDefault();
    deleteNote(index);
  }

  const tableRow = (
    <tr>
      <td>{note.title}</td>
      <td>{note.noteDate.toDateString()}</td>
      <td>{note.noteBody}</td>
      { userType === 'Educator'
        ? (
          <td>
            <LinkContainer to={`/noteupdate/${note.course}/${note.id}`}>
              <OverlayTrigger delayShow={1000} overlay={noteUpdateTooltip}>
                <Button bsSize="xsmall">
                  <Glyphicon glyph="pencil" />
                </Button>
              </OverlayTrigger>
            </LinkContainer>
            {' '}
            <OverlayTrigger delayShow={1000} overlay={deleteTooltip}>
              <Button bsSize="xsmall" onClick={onDelete}>
                <Glyphicon glyph="trash" />
              </Button>
            </OverlayTrigger>
          </td>
        )
        : null }
    </tr>
  );

  return (
    <LinkContainer to={selectLocation}>
      {tableRow}
    </LinkContainer>
  );
});

export default function noteTable({
  notes, updateNote, deleteNote, userType,
}) {
  const noteRows = notes.map((note, index) => (
    <NoteRow
      note={note}
      updateNote={updateNote}
      deleteNote={deleteNote}
      index={index}
      userType={userType}
    />
  ));

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Note</th>
          <th>Date</th>
          { userType === 'Educator'
            ? (
              <th>Action</th>
            ) : null }
        </tr>
      </thead>
      <tbody>
        {noteRows}
      </tbody>
    </Table>
  );
}
