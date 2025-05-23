
5/15/2025
Milestone 1: Project 4 - E-Learning Platform Backend (EduCore)
Assigned

Milestone 1: Authentication & Courses



1.Create user roles: instructor and student.



2.Instructors can create courses.



3.Setup schemas: User, Course.


MILESTONE 2 - PROJECT 4: E-Learning Platform Backend (EduCore)
Due Date: 23 May 202
Assignment Instructions
Assigned

Milestone 2: Enrollment Logic

1.Students can enroll in available courses.

2.Create Enrollment schema.

3.Instructors can view enrolled students.


Backend where instructors manage courses and students enroll. 
Main Features: 
- Role-based access 
- Course creation by instructors 
- Enrollment and progress tracking 

Schemas: 
1. User info + role 
2. Course title, description, instructor 
3. Enrollment user, course 

Endpoints: 
- POST /auth/register 
- POST /auth/login 
- POST /courses (instructor) 
- GET /courses 
- POST /enroll (student) 
- GET /enrollments 
- GET /courses/:id/students