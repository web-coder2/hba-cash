// здесь у меня будет импорт библиотек

const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const urlencoded = bodyParser.urlencoded({extended: false})

// здесь я бууд импортировтаь модули свои прилоджения

const creater = require(path.join(__dirname, 'models', 'create.js'))
const getall = require(path.join(__dirname, 'models', 'getAll.js'))

const PORT = 5000


const app = express()


app.use(express.static(path.join(__dirname, 'views')))
app.use(express.urlencoded({extended: true}))
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

app.get('/games', (req, res) => {
	let games = new getall
	res.json(games.getAllGames())
})


// а вот тут у меня будут POST запросы


app.post('/api/create', (req, res) => {
	let newGame = new creater(req.body.gameObj)
	newGame.saveData()
	res.sendStatus(200)
})


app.listen(PORT, () => {
	console.log(`AC forum started on ${PORT}`)
})