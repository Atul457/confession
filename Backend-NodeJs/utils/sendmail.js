const AWS = require('aws-sdk');
const SES = new AWS.SES({ region: "eu-west-2" });

async function sendmail(receiver_mail, mailSubject, msgHTML)
{
    const showYear = new Date().getFullYear();
    const messageHtml = `<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="x-apple-disable-message-reformatting"><title>Active SC</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet"></head><body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #FFFFFF;font-family: \'Montserrat\', sans-serif;width:100%;"><table style="margin: 0 auto;background-color: #FFFFFF;"><tr><td style="max-width: 800px !important;margin: auto !important;margin-top:10px !important;margin-bottom:10px !important;padding:53px !important;border:1px solid #ffffff !important;"><table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style="margin:0 auto;text-align: center;"><img src="https://activitiesdata.s3.eu-west-2.amazonaws.com/activesclogo.png" width="118px" height="93x" alt=""></td></tr><tr><td>
      `+msgHTML+`</td></tr><tr><td><hr style="color:#d9dfe6;width: 100%;"></td></tr><tr><td><table style="font-size: 16px;color:#8c98a3;padding:20px 0px 0px 0px;"><tr><td><p style="line-height: 24px;font-family: \'Montserrat\', sans-serif;">This email is confidential and intended for the addressee only. Please delete if that is not you. This is a service message based on your request. Please do not reply to this email as the address is not monitored.</p><p style="line-height: 24px;font-family: \'Montserrat\', sans-serif;">© `+showYear+` Active Swindon Challenge</p></td></tr></table></td></tr></table></td></tr></table></body></html>`;
    const params = {
        Destination: {
            ToAddresses: [receiver_mail],
        },
        Message: {
            Body: {
                Html: { Data: messageHtml }
            },
            Subject: {
                Data: mailSubject
            },
        },
        Source: 'Active Swindon Challenge <noreply@swindontravelchoices.co.uk>'
    };

    try {
        await SES.sendEmail(params).promise();
        return {
            status: 'true',
            message: 'Email sent!'
        };
    } catch (e) {
        console.error(e);
        return {
            status: 'false',
            message: e
        };
    }
}
module.exports.sendmail = sendmail;