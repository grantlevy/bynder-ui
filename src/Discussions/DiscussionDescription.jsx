import React from 'react';
import {
  Panel, Tooltip, OverlayTrigger, Button, Glyphicon,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function discussionDescription({ discussion, userType, userId }) {
  const discussionUpdateTooltip = (
    <Tooltip id="editNote-tooltip" placement="top">Edit Discussion</Tooltip>
  );
  if (discussion) {
    return (
      <Panel>
        <Panel.Heading>
          {`${discussion.title} posted by: ${discussion.author}`}
          { userType === 'Educator' || discussion.user === userId
            ? (
              <LinkContainer to={`/discussionupdate/${discussion.course}/${discussion.id}`}>
                <OverlayTrigger delayShow={1000} overlay={discussionUpdateTooltip}>
                  <Button bsSize="xsmall" className="delete-post">
                    <Glyphicon glyph="pencil" />
                  </Button>
                </OverlayTrigger>
              </LinkContainer>
            )
            : null }
        </Panel.Heading>
        <Panel.Body>
          {' '}
          {discussion.postBody}
          {' '}
        </Panel.Body>
        <Panel.Footer>
          {discussion.postDate.toString()}
        </Panel.Footer>
      </Panel>

    );
  }

  return (
    <Panel>
      <Panel.Heading>
        Discussions
      </Panel.Heading>
      <Panel.Body>
        <p>
          {' '}
          No discussion selected
          {' '}
        </p>
      </Panel.Body>
    </Panel>

  );
}
