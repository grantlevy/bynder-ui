import React from 'react';
import {
  Table, Button, Glyphicon, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

const LectureRow = withRouter(({
  lecture,
  location: { search },
  deleteLecture,
  index,
  userType,
}) => {
  const selectLocation = { pathname: `/${lecture.course}/lectures/${lecture.id}`, search };

  const deleteTooltip = (
    <Tooltip id="delete-tooltip" placement="bottom,">Delete Lecture</Tooltip>
  );
  const editTooltip = (
    <Tooltip id="edit-tooltip" placement="right">Edit Lecture</Tooltip>
  );

  function onDelete(e) {
    e.preventDefault();
    deleteLecture(index);
  }

  const tableRow = (
    <tr>
      <td>{lecture.title}</td>
      <td>{lecture.lectureDate.toDateString()}</td>
      { userType === 'Educator'
        ? (
          <td>
            <LinkContainer to={`/lectureupdate/${lecture.course}/${lecture.id}`}>
              <OverlayTrigger delayShow={1000} overlay={editTooltip}>
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

export default function LectureTable({ lectures, deleteLecture, userType }) {
  const lectureRows = lectures.map((lecture, index) => (
    <LectureRow
      lecture={lecture}
      deleteLecture={deleteLecture}
      index={index}
      userType={userType}
    />
  ));

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Lecture</th>
          <th>Date</th>
          { userType === 'Educator'
            ? (
              <th>Action</th>
            ) : null }
        </tr>
      </thead>
      <tbody>
        {lectureRows}
      </tbody>
    </Table>
  );
}
