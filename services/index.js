const { User } = require("../models/eduModel")


const findAllUser = async () => {
    const allUser = await User.find()
    return allUser
}


// const findOneUser = async () =>{
//     const oneUser = await User.findOne({email})
//     return oneUser
// }

module.exports = {
    findAllUser
}