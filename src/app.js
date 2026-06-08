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
        res.Status(400).send("error while registering user: " + err.message);
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
