const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://mudassir:6J9pCbEPwEp7Vo3d@node-js-course.xdqz3jy.mongodb.net/devTinder"
    );
};


module.exports = connectDB;