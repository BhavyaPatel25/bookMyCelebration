const express = require('express');
const bodyParser = require('body-parser');
const DB = require(__dirname + "/routes/db.js");
const Window = require('window');
const port = 3000;
const ejs = require('ejs');
const { isLogin } = require('./routes/db');

app = express();
const window = new Window();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//global variables
let verificationNum = 0;
let createAccountData;
let LoginData;
let flag;

//Routes for rendaring the file
app.get('/', function(req, res) {
    res.render("home");
});

app.get('/upcomingevent', function(req, res) {
    res.render("upcoming");
});

app.get('/addevent', function(req, res) {
    res.render("addevent");
});

app.get('/home', function(req, res) {
    res.render("home");
});

app.get('/Login', function(req, res) {
    res.render("Login", { flag: 0 });
});

app.post('/Login', function(req, res) {
    LoginData = req.body;
    console.log("Statement - 1");
    flag = DB.isLogin(LoginData);
    console.log("Testing...." + flag);
    console.log("Statement - 2");
    console.log("post method value : " + flag);
    //console.log("post method value : " + flag);
    res.render("logedinhome");
});

//flag = DB.isLogin(LoginData);
//setTimeout(function() { console.log(flag); }, 1000);

app.get('/Createaccount', function(req, res) {
    res.render('createaccount', { flag: 0 });
});

app.post('/Createaccount', function(req, res) {
    createAccountData = req.body;
    if (createAccountData.passwordCA == createAccountData.passwordCAVerify) {
        verificationNum = DB.isFound(req.body);
        console.log(verificationNum);
        res.redirect("/OTPVer");
    } else {
        res.render("createaccount", { flag: 1 });
    }
});

app.get('/OTPVer', function(req, res) {
    res.render("OTPVer", { mail: createAccountData.emailCA });
});

app.post('/OTPVer', function(req, res) {
    if (verificationNum == req.body.OTPVerification) {
        DB.CreateAccount(createAccountData);
        res.render("login", { flag: 1 });
    }
});

app.get('/logedinhome', function(req, res) {
    res.render('logedinhome')
});

//Activate website on specific port
app.listen(port, () => {
    console.log(`Port listing at http://localhost:${port}`);
})