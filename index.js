// import all itmes required
const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {User, Course, Enrollment} = require("./models/eduModel")

const routes = require("./routes")
const cors = require("cors")

dotenv.config()


//  Sever and database setup
app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 7000
const MONGODB_URL = process.env.MONGODB_URL

mongoose.connect(MONGODB_URL)

.then(()=> {
    console.log("Mongodb connected ....")
    app.listen(PORT, ()=> {
        console.log(`Server running on port ${PORT}`)
    })
})


// // Display welcome page - for testing

app.get("/", async (req, res) => {
    res.status(200).json({message : "Welcome to Educore",
        
    })
})

app.use("/api", routes)

