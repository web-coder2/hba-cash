const path = require('path')
const fs = require('fs')


class Data {
    constructor(date, robot, summHold, diffHold, oklad, office) {
        this.date = date 
        this.robot = robot
        this.summHold = summHold
        this.diffHold = diffHold
        this.oklad = oklad 
        this.office = office
    }

    async writeAll() {
        let newData = JSON.stringify({
            date: this.date,
            robot: this.robot,
            summHold: this.summHold,
            diffHold: this.diffHold,
            oklad: this.oklad,
            office: this.office,

            nalog: Math.floor((this.summHold + this.diffHold) * 10 * 0.6 * 0.07),
            brokerSalary: Math.floor(0.37 * (this.summHold * 0.6) / 0.63 + this.summHold * 0.6),
            spent: Math.floor(this.robot + this.oklad + this.office + this.nalog + this.brokerSalary),
            salary: Math.floor((this.summHold + this.diffHold) * 10 * 0.6),
            total: Math.floor(this.salary - this.spent)
        })

        let filePath = path.join(__dirname, '..', 'data.json')
        let filer = fs.readFile(filePath, 'utf-8', (err) => {
            console.log(err)
        })
        let oldData = JSON.parse(filer)
        oldData.push(newData)
        console.log(oldData)
    }
}

module.exports = Data