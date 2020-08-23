# GroupProject_Big-pAPI_UI

## Team Members
* Ankita Kunadia 
* Ryan Leys
* Grant Levy

## Relevant Links
* [UI Deployment](http://ui-bynder.herokuapp.com)
* [API Repository](https://github.ccs.neu.edu/NEU-CS5610-SU20/GroupProject_Big-pAPI_API)
* [API Deployment](http://api-bynder.herokuapp.com/graphql)


## Project Overview
Bynder intends to be an all-in-one course management web application. The overall goal is to allow for educators to sign up, create courses and all relevant course material (i.e. syllabus, assignments, lectures). Students are then able to view all courses they're signed up for and can easily navigate the content in a manner that is improved from currently used tools.

Upon delivery of the final project, the app functions as follows:
1. Educators register an account and login to their new account, seeing a message to start by creating courses.
2. Students register an account and login to their new account, **seeing empty courses as they have not been assigned to any**.
3. Educators can create a new course and see a list of Students who they can add to their course.
4. Once a student is added to a course, they have the ability to click into the course and see assignments, lectures, and notes attached to the course. They also have the ability to create discussion posts within the course.
5. Educators can add assignments, lectures, notes, and discussions that will be available to view from the student's perspective.
6. More courses can be added with different student designations to show how the app responds dynamically to the user who is logged in.
7. Clicking on the user name allows for easy log out and changing of user accounts.
8. Two test accounts have been created with the following email and passwords: `educator@test.com, educator` and `student@test.com, student`, but the app supports new user creation.

## Iteration 3
Iteration 3 was primarily focused on user authentication and fully developing both sides of our application. We wanted to give the ability to create both "Student" and "Educator" type accounts with key differences in the functionality they're allowed within the application.

We adapted the APIs built for user authentication and built a custom homepage that requires a user to be logged in to bypass. From this screen, users can create accounts or login, specfying their type of user account upon account creation. The login process stores a jwt token to local storage, allowing sessions to persist until log out.

The UI is fully dynamic based on the user logged in. They only see courses that they are linked to in Mongo, and based on their role, they have different levels of functionality and how they can interact with the application. It was critical for us to keep the UI simple, clean, and consistent throughout the application. From the main screen, everything is just a few clicks away, minimizing the need for deep menu navigation that can be confusing and hard to find.

We also wanted to make it easy for educators to create new courses and to assign students, so we built simple modals that allow for active manage of both of these functionalites.

## Iteration 2
With the framework of the app laid in Iteration 1, we spent the majority of Iteration 2 adding more functionality around courses, including lectures, notes and discussions by course. The idea is that a user will be signed up for/teaching a course and has the ability to click on a course and see all relevant aspects of the course. We now support assignments, grades, lectures, notes, and discussions, with the ability to fully create, read, update, and delete courses, assignments, lectures, and notes.

To include these changes in the UI, we've built out the screen layout when having selected a course. The layout builds on the concept of the two-panel interface, showing all available content for a course on the left side in a collapsable menu and the selected information on the right. Each menu option on the left provides the buttons to access the forms to create, update, or delete the option. This UI allows a simple view for a user to manage all details of a course without overloading the screen with too much information.

The code for iteration 2 will be tagged.

## Iteration 1
The main goal of this iteration was to implement functionality around courses and associated assignments. We figured if we could display a course list and navigate on click to an assignment list, it would be easy to duplicate this functionality for additional course information for future iterations.

For the UI portion of this project, we wanted to come up with the general theme our application and build out a minimalistic interface that allows users to easily access information on a course by course basis. The course list displayed on the main page will eventually filter by logged in user, but we wanted to ensure general functionality of the app before implementing OAuth. The layout allows for information/filters to be selected on the left side of the screen, which changes the state of the right, main panel of the screen. A constant header nav bar provides a sense of familiarity throughout the different rendered React components.

The code for iteration 1 has been tagged.

### Screenshots
<table>
   <tr>
    <td width="100%" valign="center"><img src="/readme_images/iter03_1.png" /></td>
  </tr> 
  <tr>
    <td width="100%" valign="center"><img src="/readme_images/iter02_1.png" /></td>
  </tr>
  <tr>
    <td width="100%" valign="center"><img src="/readme_images/iter02_2.png" /></td>
  </tr>
  <tr>
    <td width="100%" valign="center"><img src="/readme_images/iter02_3.png" /></td>
  </tr>
    <tr>
    <td width="100%" valign="center"><img src="/readme_images/iter02_4.png" /></td>
  </tr>     
   <tr>
    <td width="100%" valign="center"><img src="/readme_images/iter02_5.png" /></td>
  </tr>     
</table>


## Contributions
Ankita Kunadia
* Refactoring book code for project code
* Server-side rendering
* Semester filtering and assignment for courses
* Addition of UI and APIs for Assignments, Grades, and Notes CRUD operations
* Heroku deployment
* Logout functionality and UI
* Navigation between courses
* Lint corrections and general code cleanup
* General review of code prior to submission

Ryan Leys
* Refactoring book code for project code
* Theme and logo definition and implementation with bootstrap
* Calendar date picker implementation
* Course redirect to course page and accompanying layout
* Addition of UI and APIs for Courses, Grades, and Assignments CRUD operations
* Design of Login/Registration/Homepage
* Adding and removing users from courses
* Displaying grades
* Modifyng UI to restrict access based on account type with redirect
* Showing logged in user in Nav bar
* General review of code prior to submission

Grant Levy
* Refactoring book code for project code
* Setup of Atlas Mongo
* MongoDB database initialization and collection definition
* Addition of UI and APIs for Courses and Lectures CRUD operations
* Piazza postings and READMEs
* APIs for login, registering user, hashing password, authentication, and validating password
* APIs for complex queries to show information based on user, course, assignment, etc. and allow for course assignment to students and educators
* Passage of JWT token when logging in from front end
* Fix of filtering and other bugs from UI and API

