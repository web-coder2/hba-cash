const fs = require('fs')
const path = require('path')
const salary = require(path.join(__dirname, 'salary.js'))

class Report {

    constructor(date, robot, summHold, diffHold, oklad, office) {

        this.date = date 
        this.robot = robot 
        this.summHold = summHold
        this.diffHold = diffHold
        this.oklad = oklad
        this.office = office

        this.nalog = Math.floor((this.summHold + this.diffHold) * 10 * 0.6 * 0.07)
        this.brokerSalary = Math.floor(0.37 * (this.summHold * 0.6) / 0.63 + this.summHold * 0.6)
        this.officeSpent = Math.floor(this.robot + this.oklad + this.office + this.nalog + this.brokerSalary)
        this.officeSalary = Math.floor((this.summHold + this.diffHold) * 0.6 * 10)
        this.total = Math.floor(this.officeSalary - this.officeSpent)
        
        this.trafixSalary = this.getSalary()['trafix']
        this.superxSalary = this.getSalary()['superx']

        this.totalAll = Math.floor(this.total - this.trafixSalary - this.superxSalary)
    }

    getSalary() {
        let salaryObj = new salary(this.total).identifySalary()
        return JSON.parse(salaryObj)
    }


    getData() {
        return {
            'date': this.date,
            'robot': this.robot,
            'summHold': this.summHold,
            'diffHold': this.diffHold,
            'oklad': this.oklad,
            'office': this.office,
            'nalog': this.nalog,
            'brokerSalary': this.brokerSalary,
            'officeSpent': this.officeSpent,
            'officeSalary': this.officeSalary,
            'trafixSalary': this.trafixSalary,
            'superxSalary': this.superxSalary,
            'total': this.total,
            'totalAll': this.totalAll
        }
    }

    saveData() {
        
        let filePath = path.join(__dirname, '..', 'data.json')
        let fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        fileData.push(this.getData())
        
        let newData = JSON.stringify(fileData, null, 2)
        fs.writeFileSync(filePath, newData)

    }

}


module.exports = Report