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
    try {
        const [result] = await connection.query(`select * from master where email="${emailCA}"`);
    } catch (error) {
        const [result] = NULL;
    }
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
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) throw error;
        return;
    });
}

async function update({ firstNamePF, lastNamePF, emailPF, addressPF, phnoPF, passwordPF }, emailUpdate) {
    await connection.query(`update master SET firstname = "${firstNamePF}", lastname = "${lastNamePF}", email = "${emailPF}", Address = "${addressPF}", contactno = "${phnoPF}", password = "${passwordPF}" WHERE  email = "${emailUpdate}"`);
    const data = {
        emailLogin: emailPF,
        passwordLogin: passwordPF
    }
    const [result] = await isLogin(data);
    return result;
}

function CreateAccount({ firstNameCA, lastNameCA, phNumberCA, emailCA, passwordCA }) {
    connection.query(`insert into master (firstname, lastname, contactno, email, password) values("${firstNameCA}", "${lastNameCA}", "${phNumberCA}", "${emailCA}", "${passwordCA}")`);
    return;
}

async function isLogin({ emailLogin, passwordLogin }) {
    const [result] = await connection.query(`select * from master where email="${emailLogin}" AND password="${passwordLogin}"`)
    return result;
}

module.exports = { isFound, CreateAccount, isLogin, sendEMail, update };