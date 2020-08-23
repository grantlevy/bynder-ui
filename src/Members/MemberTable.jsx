import React from 'react';
import {
  Panel, Tooltip, OverlayTrigger, Button, Glyphicon, Table,
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

const MemberRow = withRouter(({
  member,
  index,
  removeMember,
}) => {

  if (member.type === 'Educator') return null;

  function onRemove(e) {
    e.preventDefault();
    removeMember(member.id);
  }

  const tableRow = (
    <tr>
      <td>{member.firstName}</td>
      <td>{member.lastName}</td>
      <td>
        <Button bsSize="xsmall" onClick={onRemove}>
          <Glyphicon glyph="minus" />
        </Button>
      </td>
    </tr>
  );
  return (
    <React.Fragment>
      { tableRow }
    </React.Fragment>
  );
});

export default function membersTable({
  members,
  removeMember,
}) {
  const memberRows = members.map((member, index) => (
    <MemberRow
      member={member}
      index={index}
      removeMember={removeMember}
    />
  ));

  return (
    <React.Fragment>
      <Table responsive>
        <thead>
          <th>First name</th>
          <th>Last Name</th>
          <th>Action</th>
        </thead>
        <tbody>
          { memberRows }
        </tbody>
      </Table>

    </React.Fragment>
  );
}