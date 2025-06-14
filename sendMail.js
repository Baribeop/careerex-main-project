const nodeMailer = require("nodemailer")


const sendForgotPasswordEmail = async (email, token) => {

try{

const mailTransport = nodeMailer.createTransport({

    service : "gmail", 
    auth : {
        user : `${process.env.EMAIL}`,
        pass : `${process.env.EMAIL_PASSWORD}`
    }
})


const emailDetails = {

    from :`${process.env.EMAIL}`,
    to : `${email}`,
    subject : "Reset Password Notification",

    html: `
        <h1> Here is the token to reset your password, click the button,

        <a class "" href='https://www.yourcareerex.com/reset-password/${token}'> Reset Password </a>

        If the button does not work for any reason, click the link below

        <a href='https://www.yourcareerex.com/reset-password/${token}'> Reset Password </a>
    
        ${token}

        </h1>
    `
}

await mailTransport.sendMail(emailDetails)

} catch (error) {

console.log(error)

}

}


const validateEmail = (email) => {

const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

return re.test(String(email).toLowerCase())
}


module.exports = {
    sendForgotPasswordEmail, 
    validateEmail
}

