const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

const Data = require(path.join(__dirname, 'models', 'data.js'))

const urlencoded = bodyParser.urlencoded({extended: false})
const app = express()
const PORT = 3000



app.use(express.static('public'))
app.use(urlencoded)
app.use(bodyParser.json())


function readData() {
    let data = fs.readFileSync("data.json", 'utf-8')
    return JSON.parse(data)
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})



app.post('/api/create', (req, res) => {
    res.sendStatus(200)
    const data = new Data(req.body.date, req.body.robot, req.body.summHold, req.body.diffHold, req.body.oklad, req.body.office)
    data.writeAll()
})

app.get('/api/data', (req, res) => {
    res.json(readData())
})


app.listen(PORT, () => {
    console.log(`app running on localhost:${PORT}`)
})