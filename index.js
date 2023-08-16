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
let LoginData;

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
    connection.query(`select * from master where email="${LoginData.emailLogin}" AND password="${LoginData.passwordLogin}"`, function(err, result) {
        if (err) throw err;
        if (result.length === 0) {
            res.render("login", { flag: 2 });
        } else {
            res.render("logedinhome");
        }
    });
});

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

app.get('/forgot', function(req, res) {
    res.render('forgot');
});

app.post('/forgot', function(req, res) {
    connection.query(`select * from master where email="${req.body.emailLogin}"`, function(err, result) {
        if (err) throw err;
        if (result.length === 0) {
            res.render("forgot", { flag: 1 });
        } else {

            // res.render("login", { flag: 3 });
        }
    });
});

app.get('/about', function(req, res) {
    res.render('aboutus');
});

//Activate website on specific port
app.listen(port, () => {
    console.log(`Port listing at http://localhost:${port}`);
})