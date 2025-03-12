const fs = require('fs')
const path = require('path')
const dayjs = require('dayjs')

class Grouped {

    constructor(fileData) {
        this.fileData = fileData
        this.groupedData = []
    }

    changeDateFormat(date) {
        let newDate = dayjs(date).format('dd-mm-YYYY').split('-')
        let azaza = `${newDate[1]}-${newDate}[2]`
        return azaza
    }

    grouper() {
        for (let i = 0; i < this.fileData.length; i++) {
            this.fileData[i]['date'] = this.changeDateFormat(this.fileData[i]['date'])

            if (this.fileData[i]['date'] in this.groupedData) {
                this.groupedData['date']['summHold'] += this.fileData[i]['summHold']
                this.groupedData['date']['diffHold'] += this.fileData[i]['diffHold']
            } else {
                this.groupedData.push({
                    'date' : this.fileData[i]['date']
                })
            }

        }
        return this.groupedData
    }

}


module.exports = Grouped