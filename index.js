const bodyParser = require('body-parser');
const express = require('express');
const Window = require('window');
//const mysql = require('mysql');
//const ejs = require('ejs');
const DB = require(__dirname + "/routes/db.js");
const port = 3000;

app = express();
const window = new Window();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//app.use(express.static("views/CSS"));
app.use(express.static("views/templates"));

//global variables
let verificationNum = 0;
let createAccountData;
let logedInUserData;
let LoginData;
let flag = 0;

//Routes for rendaring the file
app.get('/', function(req, res) {
    res.render("templates/home");
});

app.get('/upcomingevent', function(req, res) {
    res.render("templates/upcoming", { log: logedInUserData[0] });
});

app.get('/addevent', function(req, res) {
    res.render("templates/addevent", { log: logedInUserData[0] });
});

app.get('/collab', function(req, res) {
    res.render("templates/collab", { log: logedInUserData[0] });
});

app.get('/home', function(req, res) {
    res.render("templates/home");
});

app.get('/Login', function(req, res) {
    res.render("templates/Login", { flag: 0 });
});

app.post('/Login', async function(req, res) {
    LoginData = req.body;
    logedInUserData = await DB.isLogin(LoginData);
    if (logedInUserData.length != 0) {
        if (logedInUserData[0].password == LoginData.passwordLogin)
            res.render("templates/logedinhome", { log: logedInUserData[0] });
        else
            res.render("templates/login", { flag: 2 });
    } else {
        res.render("templates/login", { flag: 2 });
    }
});

app.get('/Createaccount', function(req, res) {
    res.render('templates/createaccount', { flag: 0 });
});

app.post('/Createaccount', async function(req, res) {
    createAccountData = req.body;
    if (createAccountData.passwordCA == createAccountData.passwordCAVerify) {
        verificationNum = await DB.isFound(createAccountData.emailCA);
        console.log(verificationNum);
        if (verificationNum == 0) {
            res.render("templates/createaccount", { flag: 2 });
        } else {
            const message = `<h4>Welcome to bookMyCelebration... <br> Here your verification code is </h4> <h1> ${verificationNum} </h1>`;
            await DB.sendEMail(createAccountData.emailCA, "Verify your self on bookMyCelebration...", message);
            res.render("templates/OTPVer");
        }
    } else {
        res.render("templates/createaccount", { flag: 1 });
    }
});

app.get('/OTPVer', function(req, res) {
    res.render("templates/OTPVer", { mail: createAccountData.emailCA });
});

app.post('/OTPVer', function(req, res) {
    if (verificationNum == req.body.OTPVerification) {
        DB.CreateAccount(createAccountData);
        res.render("templates/login", { flag: 1 });
    }
});

app.get('/logedinhome', function(req, res) {
    res.render('templates/logedinhome', { log: logedInUserData[0] })
});

app.get('/forgot', function(req, res) {
    res.render('templates/forgot');
});

app.post('/forgot', function(req, res) {

});

app.get('/Profile', function(req, res) {
    res.render('templates/profile', { log: logedInUserData[0] });
});

app.get('/Gallery', function(req, res) {
    res.render('templates/Gallery', { log: logedInUserData[0] })
});

app.get('/about', function(req, res) {
    res.render('templates/aboutusLog');
});

app.get('/aboutlog', function(req, res) {
    res.render('templates/aboutusLogedIn', { log: logedInUserData[0] });
});

//Activate website on specific port
app.listen(port, () => {
    console.log(`Port listing at http://localhost:${port}`);
})