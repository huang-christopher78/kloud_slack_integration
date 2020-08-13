// Imports
var express = require('express');
var request = require('request');
const bodyParser = require('body-parser');
const axios = require('axios');

// Store app's ID and Secret
var clientId = '1294333466193.1281718143938';
var clientSecret = '9369f52fe38452353471f33c9ef1f0c0';

// Instantiates Express and assigns our app variable to it
var app = express();

// Receive full payload
app.use(bodyParser.urlencoded({ extended: true }));

const PORT=4390;

// Start server
app.listen(PORT, function () {
    //Callback triggered when server is successfully listening
    console.log("Example app listening on port " + PORT);
});


// This route handles GET requests to our root ngrok address
app.get('/', function(req, res) {
    res.send('Ngrok is working! Path Hit: ' + req.url);
});

// This route handles get request to a /oauth endpoint
app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there we'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET', //Specify the method

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);

            }
        })
    }
});

// Indicate that ngrok is working
app.post('/command', function(req, res) {
    console.log(req)
    res.send('Your ngrok tunnel is up and running!');
});

// Receive shortcut requests
app.post('/events', function(req, res) {    
    const trigger_id = JSON.parse(req.body.payload).trigger_id;
    try {
        res.status(200);
        axios.post('https://slack.com/api/views.open', {
        trigger_id,
            "view" : JSON.stringify({
                "type": "modal",
                "callback_id" : "doc",
                "title": {
                    "type": "plain_text",
                    "text": "Documents",
                    "emoji": true
                },
                "submit": {
                    "type": "plain_text",
                    "text": "Submit",
                    "emoji": true
                },
                "close": {
                    "type": "plain_text",
                    "text": "Cancel",
                    "emoji": true
                },
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Doc 1"
                        },
                        "accessory": {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Click Me",
                                "emoji": true
                            },
                            "value": "click_me_123"
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Doc 2"
                        },
                        "accessory": {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Click Me",
                                "emoji": true
                            },
                            "value": "click_me_123"
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Doc 3"
                        },
                        "accessory": {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Click Me",
                                "emoji": true
                            },
                            "value": "click_me_123"
                        }
                    }
                ]
            })
        },
        {"Content-type": "application/json"
        });
    } catch (e) {
        console.log(e);
        return;
    }
});