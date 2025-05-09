const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const { PassThrough } = require('stream')
const urlencoded = bodyParser.urlencoded({extended: false})
const dotenv = require('dotenv')
const dayjs = require('dayjs')
const axios = require('axios')

dotenv.config()

const resedenceRoute = process.env.baseURL
const residenceToken = process.env.residenceToken

const report = require(path.join(__dirname, 'models', 'report.js'))
const salary = require(path.join(__dirname, 'models', 'salary.js'))
const grouped = require(path.join(__dirname, 'models', 'grouped.js'))
const getByLadder = require(path.join(__dirname, 'models', 'getByLadder.js'))

const app = express()
const PORT = 5000


app.use(express.static('public'))
app.use(urlencoded)
app.use(bodyParser.json())


let testHuest = [
    {"ladder" : 0, "trafic" : 500, 'super' : 500},	
    {"ladder" : 10000, "trafic" : 1000, 'super' : 1000},	
	{"ladder" : 20000, "trafic" : 2000, 'super' : 2000},	
	{"ladder" : 30000, "trafic" : 3000, 'super' : 3000},	
	{"ladder" : 40000, "trafic" : 4000, 'super' : 4000},	
	{"ladder" : 50000, "trafic" : 5000, 'super' : 5000},	
	{"ladder" : 60000, "trafic" : 6000, 'super' : 6000},	
	{"ladder" : 70000, "trafic" : 7000, 'super' : 7000},	
	{"ladder" : 80000, "trafic" : 8000, 'super' : 8000},	
	{"ladder" : 90000, "trafic" : 9000, 'super' : 9000},	
	{"ladder" : 100000, "trafic" : 10000, 'super' : 10000},	
	{"ladder" : 130000, "trafic" : 13000, 'super' : 13000},	
	{"ladder" : 150000, "trafic" : 17000, 'super' : 17000},	
	{"ladder" : 180000, "trafic" : 19000, 'super' : 19000},	
	{"ladder" : 200000, "trafic" : 20000, 'super' : 20000},	   
]

function writerLadderData(ladder) {
    let ladderDataPath = path.join(__dirname, 'ladder.json')
    let ladderData = JSON.stringify(ladder, null, 2)
    fs.writeFileSync(ladderDataPath, ladderData)
}
if (fs.readFileSync(path.join(__dirname, 'ladder.json'))){
    console.log("ladder.json created just")
} else {
    writerLadderData(testHuest)
}

function dataReader(dataFile) {
    let filePath = path.join(__dirname, dataFile)
    let fileData = fs.readFileSync(filePath, 'utf-8')

    let groupers = new grouped(JSON.parse(fileData))

    return [JSON.parse(fileData), groupers.grouper()]
}


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/api/data', (req, res) => {
    res.json(dataReader('data.json')[0])
})

app.get('/api/newData/', (req, res) => {
    res.json(dataReader('newData.json')[0])
})

app.post('/api/create', (req, res) => {
    let newData = new report(req.body.date, parseInt(req.body.robot), parseInt(req.body.summHold), parseInt(req.body.diffHold), parseInt(req.body.oklad), parseInt(req.body.office))
    newData.saveData()
    res.sendStatus(200)
})

app.post('/api/createByFile', (req, res) => {
    for (let i = 0; i < req.body.fullData.length; i++) {
        let newData = new report(req.body.fullData[i]['date'], parseInt(req.body.fullData[i]['robot']), parseInt(req.body.fullData[i]['summHold']), parseInt(req.body.fullData[i]['diffHold']), parseInt(req.body.fullData[i]['oklad']), parseInt(req.body.fullData[i]['office']))
        newData.saveData()
    }
    res.sendStatus(200)
})

app.get('/api/groupedData', (req, res) => {
    res.json(dataReader('data.json')[1])
})

app.get('/api/groupedNewData', (req, res) => {
    res.json(dataReader('newData.json')[1])
})

app.get('/api/getLadder', (req, res) => {
    
    let ladderDatas = JSON.parse(fs.readFileSync(path.join(__dirname, 'ladder.json')))

    res.json(ladderDatas)
})


app.get('/table', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'table.html'))
})


app.post('/table/getHold', async (req, res) => {
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;

    async function getHolds(startDate, endDate) {
        try {
            const response = await axios.get(`${resedenceRoute}leads/`, {
                params: {
                    '_populate[]': ['userId', 'offerId'],
                    '_page': 1,
                    '_limit': 0,
                    'startedAt[]': ['gte:' + startDate, 'lte:' + endDate]
                },
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${residenceToken}`
                },
            });
            return response.data;
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
            res.status(500).json({ error: "Ошибка при получении данных : " + error }); 
            return null; 
        }
    }

    const resulter = await getHolds(startDate, endDate);

    if (resulter) {
        res.json(resulter);
    }
});


app.post('/tableSalaryBonuses', async (req, res) => {

    const startDate = req.body.startDate
    const endDate = req.body.endDate
    const apiQueryRoute = `${resedenceRoute}leads/salary/?_page=1&_limit=100000&startedAt[]=gte:${startDate}&startedAt[]=lte:${endDate}`

    async function getData() {
        try {
            const response = await axios.get(apiQueryRoute, {
                headers: {
                    'Authorization': `Bearer ${residenceToken}`
                }
            })
            return response.data
        } catch (e) {
            console.log(e)
        }
    }
    
    const response = await getData()
    res.send(response)
})


app.post('/tableGetBonuses', async (req, res) => {

    const startDate = req.body.startDate
    const endDate = req.body.endDate

    const apiQueryRoute = `https://residence.hbnetwork.ru/api/bonuses/?_page=1&_limit=100000&datedAt[]=gte:${startDate}&datedAt[]=lte:${endDate}`

    async function getBonuses() {
        try {
            const response = await axios.get(apiQueryRoute, {
                headers: {
                    'Authorization': `Bearer ${residenceToken}`
                }
            })
            return response
        } catch (e) {
            console.log(e)
        }
    }

    let responseBonusesData = await getBonuses()

    res.send(responseBonusesData.data.data)
})

app.post('/tableTraficInput', async (req, res) => {

    const startDay = req.body.startDate
    const endDay = req.body.endDate

    const apiQueryRoute = `${resedenceRoute}mailings/leads/?_populate[]=userId&_populate[]=pipelineId&_limit=9007199254740991&_page=1&_select=_updatedAt+datedAt+phone+new&_sort=datedAt:desc&datedAt[]=gte:${startDay}&datedAt[]=lte:${endDay}`

    async function getInputs() {
        try {   
            const response = await axios.get(apiQueryRoute, {
                headers: {
                    'Authorization': `Bearer ${residenceToken}`
                }
            })
            return response
        } catch (e) {
            console.log(e, '!!!!!!!!!!!!!!!  eror in mailings/leads')
        }
    }

    try {
        const responseData = await getInputs()
        const leadData = responseData.data.data
        let brokerPrice = 0

        leadData.forEach((e) => {
            let leadPrice = e.price
            brokerPrice += leadPrice
        })

        res.send({'brokerPrice' : brokerPrice, 'fullData' : leadData})
    } catch (e) {
        res.status(500).send('ошибка в Api')
    }
})


app.post('/api/changeLadder', (req, res) => {
    testHuest = req.body["ladder"]

    let tester = new getByLadder(testHuest)
    tester.reWriteCopyFile()

    writerLadderData(testHuest)
    res.sendStatus(200)
})


app.listen(PORT, async () => {
    console.log(`app running on localhost:${PORT}`)
})