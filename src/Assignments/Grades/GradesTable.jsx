import React from 'react';
import {
  Table, Panel,
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

const GradeRow = withRouter(({
  grade,
  userType,
}) => {
  if (userType === 'Student') {
    const tableRow = (
      <tr>
        <td>{grade.grade}</td>
        <td>{grade.feedback}</td>
      </tr>
    );
    return (
      <React.Fragment>
        { tableRow }
      </React.Fragment>
    );
  }
  const tableRow = (
    <tr>
      <td>{grade.student}</td>
      <td>{grade.grade}</td>
      <td>{grade.feedback}</td>
    </tr>
  );

  return (
    <React.Fragment>
      { tableRow }
    </React.Fragment>
  );
});

export default function gradesTable({ grades, userType }) {
  if (grades.length === 0 && userType === 'Student') {
    return (
      <Panel>
        <Panel.Heading className="panel-info">
          Assignment Grade
        </Panel.Heading>
        <Panel.Body>
          <p>Assignment not yet graded</p>
        </Panel.Body>
      </Panel>
    );
  }
  if (grades.length === 0 && userType === 'Educator') {
    return (
      <Panel>
        <Panel.Heading className="panel-info">
          Assignment Grades
        </Panel.Heading>
        <Panel.Body>
          <p>No students available to grade</p>
        </Panel.Body>
      </Panel>
    );
  }
  const gradesRows = grades.map(grade => (
    <GradeRow grade={grade} userType={userType} />
  ));
  if (userType === 'Student') {
    return (
      <Panel>
        <Panel.Heading className="panel-info">
          Your grade
        </Panel.Heading>
        <Panel.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>Grade</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {gradesRows}
            </tbody>
          </Table>
        </Panel.Body>
      </Panel>
    );
  }
  return (
    <Panel>
      <Panel.Heading className="panel-info">
        Student Grades
      </Panel.Heading>
      <Panel.Body>
        <Table responsive>
          <thead>
            <tr>
              <th>Student</th>
              <th>Grade</th>
              <th>Feedback</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {gradesRows}
          </tbody>
        </Table>
      </Panel.Body>
    </Panel>

  );
}
