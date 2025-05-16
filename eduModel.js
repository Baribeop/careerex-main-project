const mongoose = require("mongoose")




const userdetail = new mongoose.Schema({

    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password: {type: String, required: true}, 
    email: {type: String, required: true},
    role: {type: String, default: "user"}

}, {timestamps: true})


const course = new mongoose.Schema({

    courseTitle : {type: String, rquired: false},
    courseDiscription : {type: String, required: true},
    courseInstructor : {type: String, required: true},
    courseLevel : {type: [String, Number], required: false},

    
}, {timestamps: true})




const User = new mongoose.model("User", userdetail)
const Course = new mongoose.model("Course", course)



module.exports = {User, Course}
