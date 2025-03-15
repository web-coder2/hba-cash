// здесь у меня будет импорт библиотек

const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const urlencoded = bodyParser.urlencoded({extended: false})

// здесь я бууд импортировтаь модули свои прилоджения

const creater = require(path.join(__dirname, 'models', 'create.js'))

const PORT = 5000


const app = express()


app.use(express.static(path.join(__dirname, 'views')))
app.use(urlencoded)
app.use(bodyParser.json())


// тут у меня будут GET запросы 

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/about', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'about.html'))
})

app.get('/create', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'create.html'))
})



// а вот тут у меня будут POST запросы


app.post('/api/create', (req, res) => {
	let gameObj = JSON.parse(req.body.gameObj)
	console.log(gameObj)
	res.sendStatus(200)
	//let newGame = new creater(gameObj)
	//newGame.saveData()
})


app.listen(PORT, () => {
	console.log(`AC forum started on ${PORT}`)
})