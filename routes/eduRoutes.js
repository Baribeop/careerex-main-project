const express = require('express')

const router = express.Router()

const { handleGetAllusers, handleRegisterUser, handleLogin, handleCourseRegistration, handleStudentEnrollment, handleGetAvailableCourses, handleGetEnrolledCourses, handleGetEnrolledStudents, handleGetStudentEnrolledCourses } = require("../controllers")


router.get("/all-user", handleGetAllusers)



// Register user(s)

router.post("/register", handleRegisterUser)


// login user
router.post("/login", handleLogin)


//  Create course for instructors
router.post("/create-course/:id", handleCourseRegistration)


// Enroll student for a course
router.post("/enroll", handleStudentEnrollment)


// Get details of all available courses 
router.get("/all-courses", handleGetAvailableCourses)



// Get all enrolled coursess - for testing
router.get("/enrolled-courses", handleGetEnrolledCourses)


// insrtuctor get students enrolled for their course(s)
router.get("/enrolled-students", handleGetEnrolledStudents);


// Courses enrolled by a student
router.get("/courses/:id/student", handleGetStudentEnrolledCourses)
  

module.exports = router
