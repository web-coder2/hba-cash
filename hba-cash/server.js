const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')


const urlencoded = bodyParser.urlencoded({extended: false})
const app = express()
const port = 3000



app.use(express.static('public'))
app.use(urlencoded)
app.use(bodyParser.json())

function writerData(data) {
    let fileData = JSON.parse(fs.readFileSync('data.json'))
    fileData.push(data)
    let newData = JSON.stringify(fileData)
    fs.writeFileSync('data.json', newData)
}

function readData() {
    let data = fs.readFileSync("data.json", 'utf-8')
    return JSON.parse(data)
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})



app.post('/api/create', (req, res) => {
    res.sendStatus(200)
    writerData(req.body)
})

app.get('/api/data', (req, res) => {
    res.json(readData())
})


app.listen(port, () => {
    console.log(`app running on localhost:${port}`)
})