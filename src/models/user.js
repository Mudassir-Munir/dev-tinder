const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid email address: " + value);
            }
        },
    },
    password:{
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("provide strong password");
            }
        }
    },
    age:{
        type: Number,
        min: 18,
    },
    gender:{
        type: String,
        validate(value){
            if (!["male", "female", "others"].includes(value)){
                throw new Error("gender data is not valid");
            }
        },
    },
    about: {
        type: String,
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("photo url is not valid");
            }
        },
    },
    skills: {
        type: [String],
    }
},
{
    timestamps: true,
},
);


module.exports = mongoose.model("User", userSchema);
