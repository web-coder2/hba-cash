const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const urlencoded = bodyParser.urlencoded({extended: false})


const report = require(path.join(__dirname, 'models', 'report.js'))
const salary = require(path.join(__dirname, 'models', 'salary.js'))
const grouped = require(path.join(__dirname, 'models', 'grouped.js'))
const getByLadder = require(path.join(__dirname, 'models', 'getByLadder.js'))

const app = express()
const PORT = 3000



app.use(express.static('public'))
app.use(urlencoded)
app.use(bodyParser.json())


let testHuest = [
    {"ladder" : 0, "trafic" : 45345500, 'super' : 345345500},  
    {"ladder" : 10000, "trafic" : 103453400, 'super' : 1345345000},    
    {"ladder" : 20000, "trafic" : 2034534500, 'super' : 2034534500},    
    {"ladder" : 30000, "trafic" : 30034534350, 'super' : 303453450},    
]

let tester = new getByLadder(testHuest)
tester.reWriteCopyFile()


function dataReader() {
    let filePath = path.join(__dirname, 'data.json')
    let fileData = fs.readFileSync(filePath, 'utf-8')


    let groupers = new grouped(JSON.parse(fileData))

    return [JSON.parse(fileData), groupers.grouper()]
}


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/api/data', (req, res) => {
    res.json(dataReader()[0])
})

app.post('/api/create', (req, res) => {
    let newData = new report(req.body.date, parseInt(req.body.robot), parseInt(req.body.summHold), parseInt(req.body.diffHold), parseInt(req.body.oklad), parseInt(req.body.office))
    newData.saveData()
    res.sendStatus(200)
})

app.get('/api/groupedData', (req, res) => {
    res.json(dataReader()[1])
})


app.listen(PORT, () => {
    console.log(`app running on localhost:${PORT}`)
})