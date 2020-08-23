import React from 'react';

export default function CourseDetail({ course }) {
  if (course) {
    return (
      <div>
        <h3>Description</h3>
        <pre>{course.description}</pre>
      </div>
    );
  }
  return null;
}
