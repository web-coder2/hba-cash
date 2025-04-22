dayjs.locale('ru')

function aggregateData (data, dateParam, param) {
    return data.reduce((acc, curr) => {
        const existing = acc.find(item => item[dateParam] === curr[dateParam]);
        if (existing) {
            existing[param] += curr[param]
        } else {
            acc.push({ ...curr });
        }
        return acc;
    }, []);
}

function aggregateManyData (data, dateParam, param, param2) {
    return data.reduce((acc, curr) => {
        const existing = acc.find(item => item[dateParam] === curr[dateParam]);
        if (existing) {
            existing[param] += curr[param]
            existing[param2] += curr[param2]
        } else {
            acc.push({ ...curr });
        }
        return acc;
    }, []);
}


let app = new Vue ({
    el : "#app",
    data: {
        startDate: dayjs(new Date).format('YYYY-MM-DD'),
        endDate: dayjs(new Date).format('YYYY-MM-DD'),
        numToSalary: 4000,
        loading: false,

        totalBrokerSalary: null,
        totalBrokerBonuses: null,
        totalBrokerPrice: null,

        allSummHold: 0,
        allBrokerPrice: 0,
        allBrokerBonuses: 0,
        allBrokerSalary: 0,

        holdArray: [],
        brokersArray: [],
        editedMinusesArray: [],
        bonusesArray: [],

        tableDataArray: [],
        usersData: [],
        usersDataShow: false,
    },
    methods: {
        async getHoldData() {

            this.loading = true
            this.allSummHold = 0
            this.holdArray = []
            this.tableDataArray = []

            const response = await fetch('/table/getHold', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'startDate': this.startDate,
                    'endDate': this.endDate
                })
            }).then(resp => resp.json()).then(respData => this.holdArray = respData.data)

            console.log(this.holdArray)

            this.holdArray.forEach((e) => {

                let date = dayjs(e._createdAt).format('YYYY-MM-DD')
                let status = e.status
                let hold = e.price?.offer ? e.price.offer : 0
                let pay = e.price?.paid ? e.price.paid :  0

                if (status === 'hold') {
                    this.tableDataArray.push({
                        'date' : date,
                        'hold' : hold,
                        'pay' : pay,
                    })
                    this.allSummHold += hold
                }
                this.tableDataArray = aggregateManyData(this.tableDataArray, 'date', 'hold', 'pay')
            })  

            console.log(this.tableDataArray)
            this.loading = false
        },
        async getBrokerSalary() {
            const response = await fetch('/tableSalaryBonuses', {
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    "startDate" : this.startDate,
                    "endDate" : this.endDate
                })
            }).then(data => data.json()).then(resp => this.brokersArray = resp.data.total.total)

            this.allBrokerBonuses = this.brokersArray.bonuses

            let sumSalary = this.brokersArray.hold.sum

            this.allBrokerSalary = (sumSalary / 50 * 65) + (sumSalary * 0.2) + this.allBrokerBonuses + this.numToSalary - this.allBrokerPrice

        },
        async getMinuses() {
            const response = await fetch('/tableTraficInput', {
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    "startDate" : this.startDate,
                    "endDate" : this.endDate
                })
            }).then(data => data.json()).then(resp => {
                this.allBrokerPrice = resp.brokerPrice
                this.minusesArray = resp.fullData
            })

            this.editedMinusesArray = []
            
            this.minusesArray.forEach((e) => {
                let date = dayjs(e.datedAt).format('YYYY-MM-DD')

                this.editedMinusesArray.push({
                    'datedAt' : date,
                    'price' : e.price
                })
            })

            this.editedMinusesArray = aggregateData(this.editedMinusesArray, 'datedAt', 'price')
        },
        async getBonuses() {
            const response = await fetch('/tableGetBonuses', {
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    "startDate" : this.startDate,
                    "endDate" : this.endDate
                })
            }).then(data => data.json()).then(resp => this.bonusesArray = resp)

            console.log(this.bonusesArray)

            for (let i = 0; i < this.bonusesArray.length; i++) {
                this.bonusesArray[i].datedAt = dayjs(this.bonusesArray[i].datedAt).format('YYYY-MM-DD')
            }

            this.bonusesArray = aggregateData(this.bonusesArray, 'datedAt', 'value')
        },
        calculateSalary(hold, price, bonuses) {
            return ( (hold / 50 * 65) + (hold * 0.2) + parseInt(this.numToSalary) - price + bonuses )
        },
        returnDayWeek(itemDay){
            return dayjs(itemDay).format('dddd')
        },
        returnTotalValus(arr, param) {
            let paramValue = 0
            arr.forEach((asasa) => {
                paramValue += asasa[param]
            })
            return paramValue
        },
        async getUsersSkorozvon() {
            const result = await fetch('/skorozvon/get/users', {
                method: "GET",
                headers : {
                    'Content-Type' : 'application/json'
                }
            }).then(response => response.json()).then(data => this.usersData = data.usersData)
            console.log(this.usersData)
        },
        async getCallsSkorozvon() {
            const result = await fetch('/skorozvon/get/calls', {
                method: "GET",
                headers : {
                    'Content-Type' : 'application/json'
                }
            }).then(response => response.json()).then(data => this.callsData = data.callsData)
            console.log(this.callsData)
        },
        changeUserDataShow() {
            this.usersDataShow =! this.usersDataShow
        },
        async getAllData() {
            await this.getHoldData()
            await this.getBrokerSalary()
            await this.getMinuses()
            await this.getBonuses()
        }
    },
    async beforeMount() {
        await this.getUsersSkorozvon()
        await this.getCallsSkorozvon()
    }
})