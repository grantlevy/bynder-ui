import React from 'react';
import {
  Panel,
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

export default function assignmentDescription({ assignment }) {
  if (assignment) {
    const AssignmentContent = withRouter(() => (
      <Panel>
        <Panel.Heading>
          {assignment.title}
        </Panel.Heading>
        <Panel.Body>
          <p>
            {' '}
            {assignment.description}
            {' '}
          </p>
        </Panel.Body>
      </Panel>
    ));

    return (
      <AssignmentContent />
    );
  }

  return (
    <Panel>
      <Panel.Heading>
        Assignments
      </Panel.Heading>
      <Panel.Body>
        <p>
          {' '}
          No assignment selected.
          {' '}
        </p>
      </Panel.Body>
    </Panel>

  );
}
