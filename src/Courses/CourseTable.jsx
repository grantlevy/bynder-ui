import React from 'react';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Glyphicon, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';

const CourseRow = withRouter(({
  course,
  closeCourse,
  deleteCourse,
  index,
  userType,
}) => {
  const editTooltip = (
    <Tooltip id="close-tooltip" placement="top">Edit Course</Tooltip>
  );
  const closeTooltip = (
    <Tooltip id="close-tooltip" placement="top">Close Course</Tooltip>
  );
  const deleteTooltip = (
    <Tooltip id="delete-tooltip" placement="top">Delete Course</Tooltip>
  );

  function onClose(e) {
    e.preventDefault();
    closeCourse(index);
  }

  function onDelete(e) {
    e.preventDefault();
    deleteCourse(index);
  }
  const tableRow = (
    <tr>
      <td>{course.name}</td>
      <td>{course.courseID}</td>
      <td>{course.semester}</td>
      <td>{course.status}</td>
      { userType === 'Educator'
        ? (
          <td>
            <LinkContainer to={`/edit/${course.id}`}>
              <OverlayTrigger delayShow={1000} overlay={editTooltip}>
                <Button bsSize="xsmall">
                  <Glyphicon glyph="edit" />
                </Button>
              </OverlayTrigger>
            </LinkContainer>
            {' '}
            <OverlayTrigger delayShow={1000} overlay={closeTooltip}>
              <Button bsSize="xsmall" onClick={onClose}>
                <Glyphicon glyph="remove" />
              </Button>
            </OverlayTrigger>
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
    <LinkContainer to={`/${course.id}/assignments`}>
      {tableRow}
    </LinkContainer>
  );
});

export default function CourseTable({
  courses, closeCourse, deleteCourse, userType,
}) {
  const courseRows = courses.map((course, index) => (
    <CourseRow
      course={course}
      closeCourse={closeCourse}
      deleteCourse={deleteCourse}
      index={index}
      userType={userType}
    />
  ));

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Course</th>
          <th>Semester</th>
          <th>Status</th>
          { userType === 'Educator'
            ? (
              <th>Action</th>
            ) : null }
        </tr>
      </thead>
      <tbody>
        {courseRows}
      </tbody>
    </Table>
  );
}
