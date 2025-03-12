const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const urlencoded = bodyParser.urlencoded({extended: false})


const report = require(path.join(__dirname, 'models', 'report.js'))
const salary = require(path.join(__dirname, 'models', 'salary.js'))
const grouped = require(path.join(__dirname, 'models', 'grouped.js'))

const app = express()
const PORT = 3000



app.use(express.static('public'))
app.use(urlencoded)
app.use(bodyParser.json())


function dataReader() {
    let filePath = path.join(__dirname, 'data.json')
    let fileData = fs.readFileSync(filePath, 'utf-8')


    let groupers = new Grouped(JSON.parse(fileData))
    console.log(groupers)


    return JSON.parse(fileData)
}


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/api/data', (req, res) => {
    res.json(dataReader())
})

app.post('/api/create', (req, res) => {
    let newData = new report(req.body.date, parseInt(req.body.robot), parseInt(req.body.summHold), parseInt(req.body.diffHold), parseInt(req.body.oklad), parseInt(req.body.office))
    newData.saveData()
    res.sendStatus(200)
})




app.listen(PORT, () => {
    console.log(`app running on localhost:${PORT}`)
})