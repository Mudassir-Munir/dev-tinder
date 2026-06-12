const jwt = require("jsonwebtoken");
const User = require("../models/user");

const UserAuth = async (req, res, next) => {
    try{
        const cookies = req.cookies;

        const {token} = cookies;
        if (!token) {
            throw new Error("token not exists");
        }
    
        const decodedMessage = await jwt.verify(token, "DEV@TINDER$790");
    
        const {_id} = decodedMessage;

            
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("user not exists");
        }
        req.user = user;
        next();
    } catch(err) {
        res.status(500).send("error: " + err.message);
    }
};

module.exports = {
    UserAuth,
};