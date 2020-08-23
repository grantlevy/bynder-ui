import CourseList from './Courses/CourseList.jsx';
import CourseEdit from './Courses/CourseEdit.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';
import AssignmentList from './Assignments/AssignmentList.jsx';
import AssignmentEdit from './Assignments/AssignmentEdit.jsx';
import GradeEdit from './Assignments/GradeEdit.jsx';
import NoteEdit from './Notes/NoteEdit.jsx';
import LecturesList from './Lectures/LecturesList.jsx';
import NotesList from './Notes/NotesList.jsx';
import DiscussionsList from './Discussions/DiscussionsList.jsx';
import LectureEdit from './Lectures/LectureEdit.jsx';
import PostEdit from './Discussions/Posts/PostEdit.jsx';
import DiscussionEdit from './Discussions/DiscussionEdit.jsx';
import Homepage from './Homepage.jsx';

const routes = [
  { path: '/login', component: Homepage },
  { path: '/courses/:id?', component: CourseList },
  { path: '/:id/assignments/:assignmentid?', component: AssignmentList },
  { path: '/:id/lectures/:lectureid?', component: LecturesList },
  { path: '/:id/notes/:noteid?', component: NotesList },
  { path: '/:id/discussions/:discussionid?', component: DiscussionsList },
  { path: '/edit/:id', component: CourseEdit },
  { path: '/update/:course/:id', component: AssignmentEdit },
  { path: '/assignmentupdate/:course/:id', component: AssignmentEdit },
  { path: '/gradeupdate/:course/:id', component: GradeEdit },
  { path: '/noteupdate/:course/:id', component: NoteEdit },
  { path: '/lectureupdate/:course/:id', component: LectureEdit },
  { path: '/about', component: About },
  { path: '/postupdate/:course/:id', component: PostEdit },
  { path: '/discussionupdate/:course/:id', component: DiscussionEdit },
  { path: '*', component: NotFound },
];

export default routes;
