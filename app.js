const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const https = require('https')
const request = require('request')
require('colors')
const app = express()
app.use(express.static('./public'))

app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signUp.html'))
})



app.post('/', (req, res) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email

    const data = {
        members: [{
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }
    const jsonData = JSON.stringify(data)
    const listID = 'f185f904c4'
    const ApiKey = '89507e62d71f903337897b5c64d79592-us7'
    const options = {
        method: 'POST',
        auth: 'Dontex:89507e62d71f903337897b5c64d79592-us7'
    }
    const url = `https://us7.api.mailchimp.com/3.0/lists/${listID}`
    const request = https.request(url, options, (response) => {
        response.on('data', (data) => {
            console.log(JSON.parse(data));
        })
        if (response.statusCode === 200) {
            res.sendFile(path.join(__dirname, 'public', 'success.html'))
        } else {
            res.sendFile(path.join(__dirname, 'public', 'fail.html'))
        }
    })
    request.write(jsonData)
    request.end()
})

app.post('/fail', (req, res) => {
    res.redirect('/')
})


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`.yellow.bold);
})