import React from 'react';
import {
  Panel,
} from 'react-bootstrap';

export default function lectureDescription({ lecture }) {
  if (lecture) {
    return (
      <Panel>
        <Panel.Heading>
          {lecture.title}
        </Panel.Heading>
        <Panel.Body>
          <p>
            {' '}
            {lecture.notes}
            {' '}
          </p>
        </Panel.Body>
      </Panel>

    );
  }

  return (
    <Panel>
      <Panel.Heading>
        Lectures
      </Panel.Heading>
      <Panel.Body>
        <p>
          {' '}
          No lecture selected
          {' '}
        </p>
      </Panel.Body>
    </Panel>

  );
}
