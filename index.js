const express = require('express');
const AWS = require('aws-sdk');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const app = express();
const port = 7000;
require('dotenv').config()

app.use(express.json());


const cred = new AWS.SharedIniFileCredentials({ profile: 'default' });
const sns = new AWS.SNS({ cred, region: 'ap-south-1' });

// For checking the connection with your IAM crenderntial
app.get('/status', (req, res) => { res.send({ status: `ok`, sns }) });


//  For sending the mail   TECHNIQUE -1 (AWS subscribe)
app.get('/subscribe', (req, res) => {
    let params = {
        Protocol: 'EMAIL',
        TopicArn: process.env.TopicArn,
        Endpoint: req.body.email
    }


    sns.confirmSubscription(params, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })

})


//  For sending the mail   TECHNIQUE -2 (AWS publish)
app.get('/publish', (req, res) => {
    let params = {
        Subject: req.body.Subject,
        Message: req.body.Message,
        TopicArn: process.env.TopicArn,
    }


    sns.publish(params, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })

})


//  For sending the SMS on the Phone Number  (AWS PublishCommand)
app.get('/sendOTPSMS', async (req, res) => {

    try {
        const params = {
            Message: `Your OTP code is: ${Math.random().toString().substring(2, 6)}`,
            PhoneNumber: 'YOUR PHONE NUMBER WITH COUNRY CODE(+91)',
            MessageAttributes: {
                'AWS.SNS.SMS.SenderID': {
                    'DataType': 'String',
                    'StringValue': 'String'
                }
            }
        }


        const snsClient = new SNSClient({
            region: process.env.Region,
            credentials: {
                accessKeyId: process.env.AccesskeyID,
                secretAccessKey: process.env.SecretAccessKey
            }
        })

        await sendSMS(snsClient, params);
        res.send({ message: 'Process Completed' })
    } 
    catch (error) {
        res.send({ Error: error })
    }

})

async function sendSMS(sns, params) {
    const command = new PublishCommand(params);
    const message = await sns.send(command)
}






app.listen(port, () => {
    console.log(`App working on ${port}`);
})