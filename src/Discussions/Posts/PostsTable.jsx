import React from 'react';
import {
  Panel, Tooltip, OverlayTrigger, Button, Glyphicon,
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

const PostRow = withRouter(({
  post,
  index,
  deletePost,
  userId,
  userType,
}) => {
  const postUpdateTooltip = (
    <Tooltip id="editNote-tooltip" placement="right">Edit Post</Tooltip>
  );
  const deleteTooltip = (
    <Tooltip id="delete-tooltip" placement="right">Delete Post</Tooltip>
  );

  function onDelete(e) {
    e.preventDefault();
    deletePost(index);
  }

  const individualPost = (
    <React.Fragment>
      <Panel.Heading className="panel-info">
        {`Reply from: ${post.author}`}
        { userType === 'Educator' || post.user === userId
          ? (
            <React.Fragment>
              <LinkContainer to={`/postupdate/${post.course}/${post.id}`}>
                <OverlayTrigger delayShow={1000} overlay={postUpdateTooltip}>
                  <Button bsSize="xsmall" className="edit-post">
                    <Glyphicon glyph="pencil" />
                  </Button>
                </OverlayTrigger>
              </LinkContainer>
              <OverlayTrigger delayShow={1000} overlay={deleteTooltip}>
                <Button bsSize="xsmall" onClick={onDelete} className="delete-post">
                  <Glyphicon glyph="trash" />
                </Button>
              </OverlayTrigger>
            </React.Fragment>
          )
          : null }
      </Panel.Heading>
      <Panel.Body>
        <p>
          {' '}
          {post.postBody}
          {' '}
        </p>
      </Panel.Body>
      <Panel.Footer>
        {post.postDate.toString()}
      </Panel.Footer>
    </React.Fragment>
  );

  return (
    <Panel>
      { individualPost }
    </Panel>
  );
});

export default function postTable({
  posts, deletePost, userId, userType,
}) {
  const postRows = posts.map((post, index) => (
    <PostRow
      post={post}
      deletePost={deletePost}
      index={index}
      userId={userId}
      userType={userType}
    />
  ));

  return (
    <React.Fragment>
      { postRows }
    </React.Fragment>
  );
}
