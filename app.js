// stephan
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, my name is Stéphan, I am a chat bot')
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
        if (text === 'Cat') {
            sendCatMessage(sender)
            continue
        }
        if (text === 'Dog') {
            sendDogMessage(sender)
            continue
        }
        sendTextMessage(sender, "hmmmm, did you just say: " + text.substring(0, 200) + " ?")
      }
      if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
        continue
      }
    }
    res.sendStatus(200)
  })

const token = process.env.FB_PAGE_ACCESS_TOKEN
const food = process.env.FORK_COOK

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

//Playing with this function to get communicate with food2fork API
function sendCatMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "A cat",
                    "subtitle": "cozy",
                    "image_url": "http://i.imgur.com/Jvh1OQm.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://food2fork.com/api/search?key=" + food + "&q=shredded%20chicken",
                        "title": "See original"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "A cat picture, yeah...",
                    }],
                }, {
                    "title": "An other cat picture",
                    "subtitle": "meowww",
                    "image_url": "http://i.imgur.com/9l1A4OS.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Yet an other cat pic",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendDogMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "A dog!",
                    "subtitle": "Cute",
                    "image_url": "http://i.imgur.com/A8eQsll.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://i.imgur.com/A8eQsll.jpg",
                        "title": "See original"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "A dog picture...",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
