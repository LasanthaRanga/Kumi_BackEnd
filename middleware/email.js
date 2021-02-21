var nodemailer = require('nodemailer');
const http = require('http');
const db = require('../util/conn');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";



var transporter = nodemailer.createTransport({
    host: 'mail.smartwin.lk',
    port: 26,
    secure: false, // use SSL
    auth: {
        user: 'info@smartwin.lk',
        pass: 'swinfo@2021'
    }
});

const message = "Welcome to MCK : ";


exports.emailSend = (param) => {
    try {
        let mailOptions = '';
        if (param.html) {
            mailOptions = {
                from: 'info@smartwin.lk',
                to: param.to,
                subject: param.subject,
                text: param.message,
                html: `${param.html}`
            }
        } else {
            mailOptions = {
                from: 'info@smartwin.lk',
                to: param.to,
                subject: param.subject,
                text: param.message
            }
        }



        // console.log(param);
        transporter.sendMail(
            mailOptions
            , function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            }
        );

        message.replace(" ", "+");
    } catch (error) {
        console.log(error);
    }


}




exports.smsSend = (param) => {
    var id = '';
    var pword = '';
    var link = '';

    db.execute('SELECT sms_getting_setting.sms_setting_id,sms_getting_setting.sms_gatway_id,sms_getting_setting.sms_gatway_pwd,sms_getting_setting.sms_gatway_link FROM sms_getting_setting', (er, ro, fd) => {
        if (!er) {
            id = ro[0].sms_gatway_id;
            pword = ro[0].sms_gatway_pwd;
            link = ro[0].sms_gatway_link;

            console.log("sms send call");

            console.log(param);

            let message = param.message;
            let mobile = param.mob;

            console.log(" ----------------------------------- mobile : " + mobile)

            http.get("" + link + "id=" + id + "&password=" + pword + "&text=" + message + "&to=" + mobile + "&from=SmartWin"
                , function (err, res, body) {
                    if (err) {
                        console.log("SMS  -------------- eroor on");
                        console.log(body);
                        // console.log(err);
                    } else {
                        console.log("SMS Sent ---------------");
                        console.log(body);
                        // console.log(res);
                    }
                }
            );

        }
    });
}