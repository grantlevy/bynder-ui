import React from 'react';
import {
  Panel,
} from 'react-bootstrap';

export default function noteDescription({ note }) {
  if (note) {
    return (
      <Panel>
        <Panel.Heading>
          {note.title}
        </Panel.Heading>
        <Panel.Body>
          <p>
            {' '}
            {note.noteBody}
            {' '}
          </p>
        </Panel.Body>
      </Panel>

    );
  }

  return (
    <Panel>
      <Panel.Heading>
        Notes
      </Panel.Heading>
      <Panel.Body>
        <p>
          {' '}
          No note selected
          {' '}
        </p>
      </Panel.Body>
    </Panel>

  );
}
