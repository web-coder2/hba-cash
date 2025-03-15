const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')


const PORT = 5000


const app = express()


app.use(express.static(path.join(__dirname, 'views')))


app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.get('/about', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'about.html'))
})

app.get('/create', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'create.html'))
})


app.listen(PORT, () => {
	console.log(`AC forum started on ${PORT}`)
})