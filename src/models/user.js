const mongoose = require("mongoose");

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
    },
    password:{
        type: String,
        required: true,
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
