// const {User} = require('../models/eduModel')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { User, Course, Enrollment } = require("../models/eduModel")

const { findAllUser } = require("../services")


const handleGetAllusers =  async (req, res) =>{

    const allUsers = await findAllUser()

    return res.status(200).json({
        message: "Success",
        allUsers
    })
}

const handleRegisterUser = async (req, res)=>{
     try{
    
            const {firstName, lastName, email, password, role } = req.body
    
            if (!firstName){
                return res.status(400).json({message: "Please enter your first name"})
            } 
    
            if (!lastName){
               return res.status(400).json({message: "Please enter your last name"})
            }
    
            if(!email) {
                return res.status(400).json({message: "Please enter your email address"})
            }
    
    
            if(!password){
               return res.status(400).json({message: "Please enter your password"})
            }
    
            if(!role){
                return res.status(400).json({message: "Please enter your role"})
             }

        
            const  existingUser = await User.findOne({ email })
           
    
            if(existingUser){
               return res.status(400).json({message: "User account already exist, please login"})
            }
    
            if (password.length < 6){
                return res.status(400).json({message: "Please enter password with minimum of 6 characters"})
            }
    
            const hashedPassword = await bcrypt.hash(password, 12)
    
            const newUser =  new User({
                firstName, 
                lastName, 
                email, 
                password : hashedPassword, 
                role })
    
            await newUser.save()
    
            res.status(201).json({
                message: "User account created successfully",
                newUser : {firstName, lastName, email, role }
    
            })
    
        }catch (error) {
            res.status(500).json({message: error.message})
        }   
}


const handleLogin = async (req, res) =>{
    
    try{

        const {email, password} = req.body

        const user  = await User.findOne({email})

        if (!user) {
            return res.status(404).json({message: "User does not exist, please register"})
        }

        const isMatch = await bcrypt.compare(password, user?.password)

        if (!isMatch) {
            return res.status(404).json({message: "Incorrect password "})
        }
        const access_token = jwt.sign(
            {id: user?._id},
            process.env.ACCESS_TOKEN,
            {expiresIn:"5m"}
        )
    
        const refresh_token = jwt.sign(
            {id: user?._id},
            process.env.REFRESH_TOKEN,
            {expiresIn: "5d"}
        )
    
        res.status(200).json({
            message: "Login successful",
            access_token,
            user: {
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
                role: user?.role
            },
            refresh_token
        })

    } catch (error) {
        res.status(400).json({message: error.message})
    }
}


const handleCourseRegistration = async (req, res) => {
    try{
    
            const {id} = req.params
    
            const {courseTitle , courseDescription, courseInstructor,  courseLevel } = req.body
    
            if (!courseTitle) {
                return res.status(400).json({message: "Please enter course title"})
            }
    
            if (!courseDescription) {
                return res.status(400).json({message: "Please enter course description"})
            }
    
            if (!courseInstructor) {
                return res.status(400).json({message: "Please enter your name"})
            }
    
            const registeredUser = await User.findById(id)
    
            if (!registeredUser){
                return res.status(400).json({
                    message: "User does not exist, please register"
                })
            }
    
            if (registeredUser.role !== "instructor") {
    
                res.status(400).json({
                    message: "Only instructors can create course"
                })
            }
           
            const newcourse = new Course({
                instructorId : id, 
                courseTitle,
                courseDescription, 
                 courseInstructor,  
                 courseLevel 
            })
            await newcourse.save()
    
            return res.status(200).json({
                message: "Course created succesfully", 
                newcourse
            })
    
        } catch (error) {
            res.status(400).json({message: error.message})
        }
}

const handleStudentEnrollment = async (req, res) =>{
    try {
    
            const {studentId, courseId, enrollmentDate} = req.body
    
            if (!studentId){return res.status(400).json({message: "user id is not provided"})}
    
            if (!courseId){return res.status(400).json({message: "Course is not provided"})}
    
            const selectedCourse = await Course.findById(courseId)
            // console.log(selectedCourse)
    
            let formatedDate = undefined
    
            if (enrollmentDate){formatedDate = new Date(enrollmentDate)}
        
        
            let existingEnrollment = await Enrollment.findOne({studentId})
    
            if (existingEnrollment){
                if (!existingEnrollment.enrolledCourseList.includes(courseId)){
                    existingEnrollment.enrolledCourseList.push(courseId)
                    await existingEnrollment.save()
    
                } else {
                    return res.status(200).json({ message: "Already enrolled in this course", existingEnrollment });
               
                }  
            } else {
                existingEnrollment = new Enrollment({
                   studentId: studentId,
                   enrolledCourseList: [courseId],
                   enrollmentDate : formatedDate
                })
                await existingEnrollment.save()
                console.log(existingEnrollment)
    
                return res.status(200).json({message : "Successfully enrolled", existingEnrollment})}
    
        } catch (error) {
            res.status(400).json({message : error.message})
    
        }
}

const handleGetAvailableCourses = async(req, res) =>{
    const availableCourses = await Course.find()
    return res.status(200).json({message: "success", availableCourses})

}

const handleGetEnrolledCourses = async(req, res) =>{

    const enrolledCourses = await Enrollment.find()
    return res.status(200).json({message: "success", enrolledCourses})
}


const handleGetEnrolledStudents = async (req, res) => {
    try {
      const { instructorId } = req.body;
  
      if (!instructorId) {
        return res.status(400).json({ message: "Invalid instructor ID" });
      }
  
      // Step 1: Find courses created by this instructor
      const instructorCourses = await Course.find({ instructorId: instructorId });
  
      const courseIds = instructorCourses.map(course => String(course._id));
  
      // Step 2: Get enrollments for those courses
      const enrolledStudents = await Enrollment.find({
        enrolledCourseList: { $in: courseIds }
      });
  
      let result = [];
  
      for (const enroll of enrolledStudents) {
        const student = await User.findById(enroll.studentId);
        const courses = await Course.find({
          _id: { $in: enroll.enrolledCourseList }
        });
  
        result.push({
          _id: enroll._id,
          student: {
            _id: student._id,
            name: `${student.firstName} ${student.lastName}`,
            email: student.email
          },
          courses: courses.map(course => ({
            _id: course._id,
            title: course.title,
            description: course.description
          })),
          courseStatus: enroll.courseStatus,
          enrollmentDate: enroll.enrollmentDate
        });
      }
  
      // Return final result
      return res.status(200).json({ message: "success", studentInfo: result });
  
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }





const handleGetStudentEnrolledCourses = async(req, res)=>{
     
    try {

        const {id} = req.params

        if (!id){
            return res.status(400).json({message: "Student id is not provided"})
        }

        const enrolledCourses = await Enrollment.find()

        const studentCourses = enrolledCourses.filter(course =>{
            return course.studentId == id
        })

        const courseIdList = enrolledCourses[0].enrolledCourseList

        const courseDetails = await Course.find({_id:{$in: courseIdList}})

        return res.status(200).json({
            message: "Success",
            courseDetails
        })

        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
    
  }
 








module.exports = {

    handleGetAllusers, 
    handleRegisterUser, 
    handleLogin,
    handleCourseRegistration,
    handleStudentEnrollment,
    handleGetAvailableCourses, 
    handleGetEnrolledCourses,
    handleGetEnrolledStudents,
    handleGetStudentEnrolledCourses
}