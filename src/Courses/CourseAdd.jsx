import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, FormControl, FormGroup, ControlLabel, Button,
} from 'react-bootstrap';

export default class CourseAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.courseAdd;
    const course = {
      name: form.name.value,
      course: form.courseID.value,
      semester: form.semester.value,
    };
    const { createCourse } = this.props;
    createCourse(course);
    form.name.value = '';
    form.courseID.value = '';
    form.semester.value = '';
  }

  render() {
    return (
      <Form inline name="courseAdd" onSubmit={this.handleSubmit}>
        <FormGroup>
          <ControlLabel>Name:</ControlLabel>
          {' '}
          <FormControl type="text" name="name" />
        </FormGroup>
        {' '}
        <FormGroup>
          <ControlLabel>Course:</ControlLabel>
          {' '}
          <FormControl type="text" name="courseID" />
        </FormGroup>
        {' '}
        <FormGroup>
          <ControlLabel>Semester:</ControlLabel>
          {' '}
          <FormControl type="text" name="semester" />
        </FormGroup>
        {' '}
        <Button bsStyle="primary" type="submit">Add</Button>
      </Form>
    );
  }
}

CourseAdd.propTypes = {
  createCourse: PropTypes.func.isRequired,
};
