const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {UserAuth} = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());


app.post("/signup", async (req, res) => {

    

    try{
        // validate data
        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;
        // encrypt password
        const hashPassword = await bcrypt.hash(password, 10);

        // create new instance of user
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashPassword,
        });
        await user.save();
        res.send("user registered successfully");
    }
    catch (err) {
        res.status(400).send("error: " + err.message);
    }
    
});

app.get("/users", async (req, res) => {

    const userEmail = req.body.emailId;

    try {
        const users = await User.find({emailId: userEmail});
        if (users.length === 0) {
            res.status(404).send("user not found");
        } else {
            res.send(users);
        }
    }
    catch (err)
    {
        res.status(500).send("Someting went wrong: " + err.message);
    }

});

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);

    }
    catch (err)
    {
        res.status(500).send("Someting went wrong: " + err.message);
  
    }
});

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const user = await User.findOne({emailId: userEmail});
        if (!user) {
            res.status(404).send("user not found");
        } else {
            res.send(user);
        }
    }
    catch (err)
    {
        res.status(500).send("Someting went wrong: " + err.message);
    }
})

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        await User.findByIdAndDelete({_id:userId});
        // await User.findByIdAndDelete(userId);
        // use findOneAndDelete() to pass filter value other than _id
        res.send("user deleted successfully");
    }
    catch (err)
    {
        res.status(500).send("Someting went wrong: " + err.message);
    }
});

app.patch("/user/:userId", async (req, res) => {
   
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const allowedUpdates = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => {
            allowedUpdates.includes(k);
        });

        if (!isUpdateAllowed) {
            throw new Error("update not allowed");
        }
        if (data?.skills.length > 10){
            throw new Error("skills can not be greater than 10");
        }

        await User.findByIdAndUpdate({_id:userId}, data, {
            returnDocument: "after",
            runValidators: true,
        });
        // await User.findByIdAndUpdate(userId, req.body);
        // use findOneAndUpdate() to pass filter value other than _id
        res.send("user updated successfully");
    }
    catch (err)
    {
        res.status(500).send("failed to update user: " + err.message);
    }
});

app.post("/login", async (req, res) => {
    
    try {
      const {emailId, password} = req.body;
      const user = await User.findOne({emailId: emailId});
      if (!user) {
        throw new Error("user with given email not registered");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {

        const token = await jwt.sign({_id: user._id}, "DEV@TINDER$790");
        res.cookie("token", token);
        res.send("Login Successfull!");
      } else {
        throw new Error("password is not correct");
      }

    } catch(err) {
       res.status(500).send("error: " + err.message);
    }

});

app.get("/profile", UserAuth, async (req, res)=> {
    try{
       const user = req.user;
       res.send(user);
    } catch(err) {
        res.status(500).send("error: " + err.message);
    }
});

connectDB()
.then(() => {
    app.listen(7777, () => {
        console.log("server is listening on port 7777...");
    });
})
.catch((err) => {
    console.error("database cannot be connected:" + err.message);
});
