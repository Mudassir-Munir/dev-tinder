const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());


app.post("/signup", async (req, res) => {

    const user = new User(req.body);

    try{
        await user.save();
        res.send("registered successfully");
    }
    catch (err) {
        res.status(400).send("error while registering user: " + err.message);
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


connectDB()
.then(() => {
    app.listen(7777, () => {
        console.log("server is listening on port 7777...");
    });
})
.catch((err) => {
    console.error("database cannot be connected:" + err.message);
});
