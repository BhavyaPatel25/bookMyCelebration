var mysql = require('mysql');
var mysql2 = require('mysql2');
var nodemailer = require('nodemailer');

const connection = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bookmycelebration',
    port: '3308'
}).promise();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        //lavamwbdgvqvemup
        user: 'smart20072020@gmail.com',
        pass: 'lavamwbdgvqvemup'
    }
});

async function isFound(emailCA) {
    var min = 1000;
    var max = 9999;
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    const [result] = await connection.query(`select * from master where email="${emailCA}"`);
    if (result.length != 0) {
        num = 0;
    }
    return num;
}

function sendEMail(mailAddress, subject, arghtml) {
    var mailOptions = {
        from: 'smart20072020@gmail.com',
        to: `${mailAddress}`,
        subject: `${subject}`,
        html: `${arghtml}`
            //subject: 'Verify your self...',
            //html: `<h4>Welcome to bookMyCelebration... <br> Here your verification code is </h4> <h1> ${num} </h1>`
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) throw error;
        return;
    });
}

// connection.query(`select * from master where email="${emailCA}"`, function(err, result) {
//     if (err) throw err;
//     if (result.length != 0) {
//         var mailOptions = {
//             from: 'smart20072020@gmail.com',
//             to: `${emailCA}`,
//             subject: 'Verify your self...',
//             html: `<h4>Welcome to bookMyCelebration... <br> Here your verification code is </h4> <h1> ${num} </h1>`
//         };
//         transporter.sendMail(mailOptions, function(error, info) {
//             if (error) throw error;
//             return;
//         });
//     }
// });
//return num;
//}

function CreateAccount({ firstNameCA, lastNameCA, phNumberCA, emailCA, passwordCA }) {
    connection.query(`insert into master (firstname, lastname, contactno, email, password) values("${firstNameCA}", "${lastNameCA}", "${phNumberCA}", "${emailCA}", "${passwordCA}")`);
    return;
}

async function isLogin({ emailLogin, passwordLogin }) {
    const [result] = await connection.query(`select * from master where email="${emailLogin}" AND password="${passwordLogin}"`)
    return result;
}

module.exports = { isFound, CreateAccount, isLogin, sendEMail };