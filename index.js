const bodyParser = require('body-parser');
const express = require('express');
const Window = require('window');
const mysql = require('mysql');
const ejs = require('ejs');
const DB = require(__dirname + "/routes/db.js");
const { isLogin } = require('./routes/db');
const port = 3000;

app = express();
const window = new Window();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//global variables
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bookmycelebration',
    port: '3308'
});
let verificationNum = 0;
let createAccountData;
let logedInUserData;
let LoginData;
let flag = 0;

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

app.post('/Login', async function(req, res) {
    LoginData = req.body;
    logedInUserData = await DB.isLogin(LoginData);
    if (logedInUserData[0].password == LoginData.passwordLogin)
        res.render("logedinhome", { log: logedInUserData[0] });
    else
        res.render("login", { flag: 2 });
});

app.get('/Createaccount', function(req, res) {
    res.render('createaccount', { flag: 0 });
});

app.post('/Createaccount', async function(req, res) {
    createAccountData = req.body;
    if (createAccountData.passwordCA == createAccountData.passwordCAVerify) {
        verificationNum = await DB.isFound(createAccountData.emailCA);
        console.log(verificationNum);
        if (verificationNum == 0) {
            res.render("createaccount", { flag: 2 });
        } else {
            const message = `<h4>Welcome to bookMyCelebration... <br> Here your verification code is </h4> <h1> ${verificationNum} </h1>`;
            await DB.sendEMail(createAccountData.emailCA, "Verify your self on bookMyCelebration...", message);
            res.redirect("/OTPVer");
        }
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
    res.render('logedinhome', { log: logedInUserData[0] })
});

app.get('/forgot', function(req, res) {
    res.render('forgot');
});

app.post('/forgot', function(req, res) {

});

app.get('/Profile', function(req, res) {
    res.render('profile', { log: logedInUserData[0] });
});

app.get('/about', function(req, res) {
    res.render('aboutus');
});

//Activate website on specific port
app.listen(port, () => {
    console.log(`Port listing at http://localhost:${port}`);
})