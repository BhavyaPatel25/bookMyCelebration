var mysql = require('mysql');
var nodemailer = require('nodemailer');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bookmycelebration',
    port: '3308'
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        //lavamwbdgvqvemup
        user: 'smart20072020@gmail.com',
        pass: 'lavamwbdgvqvemup'
    }
});

function isFound({ firstNameCA, lastNameCA, phNumberCA, emailCA, passwordCA }) {
    var min = 1000;
    var max = 9999;
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    connection.query(`select * from master where email="${emailCA}"`, function(err, result) {
        if (err) throw err;
        if (result.length != 0) {
            var mailOptions = {
                from: 'smart20072020@gmail.com',
                to: `${emailCA}`,
                subject: 'Verify your self...',
                html: `<h4>Welcome to bookMyCelebration... <br> Here your verification code is </h4> <h1> ${num} </h1>`
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) throw error;
                return;
            });
        }
    });
    return num;
}

function CreateAccount({ firstNameCA, lastNameCA, phNumberCA, emailCA, passwordCA }) {
    connection.query(`insert into master (firstname, lastname, contactno, email, password) values("${firstNameCA}", "${lastNameCA}", "${phNumberCA}", "${emailCA}", "${passwordCA}")`);
    return;
}

// async function isLogin({ emailLogin, passwordLogin }) {
//     await connection.query(`select * from master where email="${emailLogin}" AND password="${passwordLogin}"`, function(err, result) {
var flag;

async function isLogin({ emailLogin, passwordLogin }) {
    await connection.query(`select * from master where email="${emailLogin}" AND password="${passwordLogin}"`, function(err, result) {
        //var flag;
        if (err) throw err;
        if (result.length === 0) {
            console.log("Not Found");
            flag = 0;
        } else {
            console.log("Welcome");
            flag = 1;
        }
        //return flag;
    });
    await console.log("is login flag : " + flag)

}

module.exports = { isFound, CreateAccount, isLogin };