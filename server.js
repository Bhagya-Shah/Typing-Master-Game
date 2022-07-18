const express = require("express");
// const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();
const port = process.env.port || 3012;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/myLoginRegisterDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema)





app.get("/", (req, res, next) => {
  res.render("index");
  res.render("login");
});


app.get("/game", (req, res, next) => {
  res.render("game");
});

app.get("/login", (req, res, next) => {
  res.render("login");
});

app.get("/home", (req, res, next) => {
  res.render("home");
});

app.post("/home",(req,res,next) => {
  res.redirect('/login')
});

app.post("/login", (req, res, next) => {
  const email = req.body.email;
  const pass = req.body.password;
  User.findOne({ email: email}, (err, user) => {
    if(user){
      console.log(user.password)
        if(pass === user.password ) {
           res.redirect('/game')
            
        } else {
          res.send({message: "Incorrect details"})
        }
    } else {
        res.send({message: "User not registered"})
    }
})
});


app.post("/register", (req, res, next) => {
  const name = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  console.log(name,password);
  User.findOne({email: email}, (err, user) => {
    if(user){
        res.send({message: "User already registerd"})
    } else {
        const user = new User({
            name,
            email,
            password
        })
        user.save(err => {
            if(err) {
                res.send(err)
            } else {
              res.redirect('/login')
            }
        })
    }
})
  
});
app.listen(port, console.log(`Listening on port ${port}`));