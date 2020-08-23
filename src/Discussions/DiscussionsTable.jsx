import React from 'react';
import {
  Table, Tooltip, OverlayTrigger, Button, Glyphicon,
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

const DiscussionRow = withRouter(({
  discussion,
  location: { search },
  deleteDiscussion,
  index,
  userId,
  userType,
}) => {
  const selectLocation = { pathname: `/${discussion.course}/discussions/${discussion.id}`, search };
  const discussionUpdateTooltip = (
    <Tooltip id="editNote-tooltip" placement="top">Edit Discussion</Tooltip>
  );
  const deleteTooltip = (
    <Tooltip id="delete-tooltip" placement="bottom,">Delete Discussion</Tooltip>
  );
  function onDelete(e) {
    e.preventDefault();
    deleteDiscussion(index);
  }
  const tableRow = (
    <tr>
      <td>{`${discussion.title}`}</td>
      <td>{discussion.postDate.toDateString()}</td>
      { userType === 'Educator' || discussion.user === userId
        ? (
          <td>
            <LinkContainer to={`/discussionupdate/${discussion.course}/${discussion.id}`}>
              <OverlayTrigger delayShow={1000} overlay={discussionUpdateTooltip}>
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

export default function discussionTable({
  discussions, deleteDiscussion, userId, userType,
}) {
  const discussionRows = discussions.map((discussion, index) => (
    <DiscussionRow
      discussion={discussion}
      deleteDiscussion={deleteDiscussion}
      index={index}
      userId={userId}
      userType={userType}
    />
  ));

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Discussion</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {discussionRows}
      </tbody>
    </Table>
  );
}
