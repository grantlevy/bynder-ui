import React from 'react';
import {
  Table, Button, Glyphicon, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

const AssignmentRow = withRouter(({
  assignment,
  location: { search },
  deleteAssignment,
  index,
  userType,
}) => {
  const selectLocation = { pathname: `/${assignment.course}/assignments/${assignment.id}`, search };
  const deleteTooltip = (
    <Tooltip id="delete-tooltip" placement="bottom,">Delete Assignment</Tooltip>
  );
  const assignmentUpdateTooltip = (
    <Tooltip id="editAssignment-tooltip" placement="right">Edit Assignment</Tooltip>
  );

  function onDelete(e) {
    e.preventDefault();
    deleteAssignment(index);
  }

  const tableRow = (
    <tr>
      <td>{assignment.title}</td>
      <td>{assignment.dueDate.toDateString()}</td>
      { userType === 'Educator'
        ? (
          <td>
            <LinkContainer to={`/assignmentupdate/${assignment.course}/${assignment.id}`}>
              <OverlayTrigger delayShow={1000} overlay={assignmentUpdateTooltip}>
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

export default function assignmentTable({
  assignments, updateGrade, updateAssignment, deleteAssignment, userType,
}) {
  const assignmentRows = assignments.map((assignment, index) => (
    <AssignmentRow
      assignment={assignment}
      updateAssignment={updateAssignment}
      updateGrade={updateGrade}
      deleteAssignment={deleteAssignment}
      index={index}
      userType={userType}
    />
  ));

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th>Due Date</th>
          { userType === 'Educator'
            ? (
              <th>Action</th>
            ) : null }
        </tr>
      </thead>
      <tbody>
        {assignmentRows}
      </tbody>
    </Table>
  );
}
