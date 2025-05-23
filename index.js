// import all itmes required
const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {User, Course, Enrollment} = require("./eduModel")

dotenv.config()


//  Sever and database setup
app = express()
app.use(express.json())

const PORT = process.env.PORT || 7000
const MONGODB_URL = process.env.MONGODB_URL

mongoose.connect(MONGODB_URL)

.then(()=> {
    console.log("Mongodb connected ....")
    app.listen(PORT, ()=> {
        console.log(`Server running on port ${PORT}`)
    })
})


// Get all users - for testing

app.get("/all-user", async (req, res) => {

    const allUsers = await User.find()
    return res.status(200).json({
        message : "Success",
        allUsers
    })
})


// Register user(s)

app.post("/register", async (req, res) => {

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

})


// login user
app.post("/login", async (req, res) => {

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
    
})


//  Create course for instructors
app.post("/create-course/:id", async (req, res) =>{

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
} )



app.post("/enroll", async(req, res) =>{

    try {

        const {studentId, courseId, enrollmentDate} = req.body

        if (!studentId){return res.status(400).json({message: "Invalid user id"})}

        if (!courseId){return res.status(400).json({message: "Course is not available"})}

        const selectedCourse = await Course.findById(courseId)
        console.log(selectedCourse)

        let formatedDate = undefined

        if (enrollmentDate){formatedDate = new Date(enrollmentDate)}
    
    
        let existingEnrollment = await Enrollment.findOne({studentId: studentId})

        if (existingEnrollment){
            if (!existingEnrollment.enrolledCourseList.includes(courseId)){
                existingEnrollment.enrolledCourseList.push(courseId)
                await existingEnrollment.save()

            } else {
                 existingEnrollment = new Enrollment({
                    studentId: studentId,
                    enrolledCourseList: [courseId],
                    enrollmentDate : formatedDate
                 })
                 await existingEnrollment.save()
            }
        }
       console.log(existingEnrollment)

        return res.status(200).json({message : "Successfully enrolled", existingEnrollment})

    } catch (error) {
        res.status(400).json({message : error.message})

    }

})


// Get all available courses - for testing
app.get("/all-courses", async(req, res) =>{

    const availableCourses = await Course.find()
    return res.status(200).json({message: "success", availableCourses})
})


// insrtuctor get students enrolled for their course(s)
app.get("/enrolled-students", async(req, res) =>{

    const {instructorId} = req.body
    if (!instructorId) {
        return res.status(400).json({message: "Invalid id"})
    }

    const enrolledCourses = await Enrollment.find()

    const courseList = await Course.find()


    const  instructorCourses =  courseList.filter(course => {

        if (course.instructorId == instructorId){

            
            // const instructorEnrolledStudents = enrolledCourses.forEach(each => {
            //     if (each.enrolledCourseList.)
                
            // });


        }

        // res.status(200).json({message: "success", enrollment})

        // if (each.instructorId == instructorId){

        //     res.status(200).json({message: "success", each})
        // }

    }
    ) 
    // console.log(enrollmentlist)
    res.status(400).json({messge: "succes", instructorCourses})

})