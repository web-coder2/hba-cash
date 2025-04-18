const fs = require('fs')
const path = require('path')

class GetToLadder {

	constructor (ladder) {
		this.ladder = ladder
	}

	GetSalary(total) {

		let superx = 0
		let trafix = 0

		let step = 0

		for (let i = 0; i < this.ladder.length; i++) {
			if (total <= 0) {
				step = 0
			} else if (total < this.ladder[i]['ladder']) {
				step = i - 1
			} else if (total > this.ladder[this.ladder.length - 1]['ladder']) {
				step = this.ladder.length - 1
			}
		}

		superx = this.ladder[step]['super']
		trafix = this.ladder[step]['trafic']

		let returnData = {
			"superx" : superx,
			"trafix" : trafix
		}

		return returnData

	}

	reWriteCopyFile() {
		let fileDataPath = path.join(__dirname, '..', 'data.json')
		let fileData = JSON.parse(fs.readFileSync(fileDataPath, 'utf-8'))
		
		for (let i = 0; i < fileData.length; i++) {

			let newSalaryObj = this.GetSalary(fileData[i]['total'])

			fileData[i]['trafixSalary'] = newSalaryObj['trafix']
			fileData[i]['superxSalary'] = newSalaryObj['superx']
			fileData[i]['total'] -= (newSalaryObj['trafix'] + newSalaryObj['superx'])
		}

		let fileNewDataPath = path.join(__dirname, '..', 'newData.json')
		let formatedDataFile = JSON.stringify(fileData, null, 2)
		fs.writeFileSync(fileNewDataPath, formatedDataFile)

	}
	

}

module.exports = GetToLadder