const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const report = require(path.join(__dirname, 'models', 'report.js'))

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

app.get('/api/data', (req, res) => {
    res.json(readData())
})

app.post('/api/create', (req, res) => {
    let newData = new report(req.body.date, req.body.robot, req.body.summHold, req.body.diffHold, req.body.oklad, req.body.office)
    newData.saveData()
    res.sendStatus(200)
})


app.listen(PORT, () => {
    console.log(`app running on localhost:${PORT}`)
})