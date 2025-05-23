const mongoose = require("mongoose")




const userdetail = new mongoose.Schema({

    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password: {type: String, required: true}, 
    email: {type: String, required: true},
    role: {type: String, default: "student"}

}, {timestamps: true})


const course = new mongoose.Schema({

    instructorId: {type: String, required : true},
    courseTitle : {type: String, required: false},
    courseDescription : {type: String, required: true},
    courseInstructor : {type: String, required: true},
    courseLevel : {type: [String, Number], required: false},

    
}, {timestamps: true})


const enrollmentSchema = new mongoose.Schema ({
    // email: {type: String, required: true},
    // studentFirstName: {type:String, required: true},
    // studentLasttName : {type: String, required: true},
     // courseId : {type: String, required: true},
    studentId : {type: String, required: true},
    courseStatus : {type: String, default: "in progress"},
    enrolledCourseList : {type: Array, default: []},
    enrollmentDate: {type: Date, default: Date.now}
})



const User = new mongoose.model("User", userdetail)
const Course = new mongoose.model("Course", course)
const Enrollment = new mongoose.model("Enrollment", enrollmentSchema)



module.exports = {User, Course, Enrollment}
