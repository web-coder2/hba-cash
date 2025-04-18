const fs = require('fs')
const path = require('path')
const dayjs = require('dayjs')

class Grouped {

    constructor(fileData) {
        this.fileData = fileData
        this.groupedData = []
    }

    changeDateFormat(date) {
        return dayjs(date).format('MM-YYYY')
    }

    grouper() {
        for (let i = 0; i < this.fileData.length; i++) {
            let formatedDate = this.changeDateFormat(this.fileData[i]['date'])

            let indexMounth = this.fileData[i]["date"].split('-')[1]
            let mounths = ['January', 'February', 'March', "Aprel", "May", "June", "Jule", "Avgust", "September", "Octomber", "November", "December"]

            if (this.groupedData[formatedDate]) {
                this.groupedData[formatedDate]['robot'] += this.fileData[i]['robot']
                this.groupedData[formatedDate]['summHold'] += this.fileData[i]['summHold']
                this.groupedData[formatedDate]['diffHold'] += this.fileData[i]['diffHold']
                this.groupedData[formatedDate]['oklad'] += this.fileData[i]['oklad']
                this.groupedData[formatedDate]['office'] += this.fileData[i]['office']
                this.groupedData[formatedDate]['brokerSalary'] += this.fileData[i]['brokerSalary']
                this.groupedData[formatedDate]['officeSpent'] += this.fileData[i]['officeSpent']
                this.groupedData[formatedDate]['officeSalary'] += this.fileData[i]['officeSalary']
                this.groupedData[formatedDate]['trafixSalary'] += this.fileData[i]['trafixSalary']
                this.groupedData[formatedDate]['superxSalary'] += this.fileData[i]['superxSalary']
                this.groupedData[formatedDate]['total'] += this.fileData[i]['total']

            } else {
                this.groupedData[formatedDate] = {
                    "date" : formatedDate,
                    'mounthIDX': parseInt(indexMounth),
                    'mounth': mounths[indexMounth - 1],
                    'robot' : this.fileData[i]['robot'],
                    'summHold' : this.fileData[i]['summHold'],
                    'diffHold' : this.fileData[i]['diffHold'],
                    'oklad' : this.fileData[i]['oklad'],
                    'office' : this.fileData[i]['office'],
                    'nalog' : this.fileData[i]['nalog'],
                    'brokerSalary' : this.fileData[i]['brokerSalary'],
                    'officeSpent' : this.fileData[i]['officeSpent'],
                    'officeSalary' : this.fileData[i]['officeSalary'],
                    'trafixSalary' : this.fileData[i]['trafixSalary'],
                    'superxSalary' : this.fileData[i]['superxSalary'],
                    'total' : this.fileData[i]['total']
                }
            }

        }
        const groupedDataArray = Object.values(this.groupedData)
        return groupedDataArray
    }

}


module.exports = Grouped