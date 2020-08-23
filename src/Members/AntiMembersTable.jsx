import React from 'react';
import {
  Panel, Tooltip, OverlayTrigger, Button, Glyphicon, Table,
} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';


const MemberRow = withRouter(({
  member,
  index,
  addMember,
}) => {
  if (member.type === 'Educator') return null;

  function onAdd(e) {
    e.preventDefault();
    addMember(member.id);
  }

  const tableRow = (
    <tr>
      <td>{member.firstName}</td>
      <td>{member.lastName}</td>
      <td>
        <Button bsSize="xsmall" onClick={onAdd}>
          <Glyphicon glyph="plus" />
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

export default function antiMembersTable({
  members,
  addMember,
}) {
  const memberRows = members.map((member, index) => (
    <MemberRow
      member={member}
      index={index}
      addMember={addMember}
    />
  ));

  return (
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

  );
}