const express = require("express");

const app = express();

app.use("/", (req, res)=>{
    res.send("Hello Mudassir");
});

app.use("/test", (req, res) =>{
    res.send("hello from server");
});

app.use("/hello", (req, res) => {
    res.send("hello hello hello");
});

app.listen(7777, () => {
    console.log("server is listening on port 7777...");
});

