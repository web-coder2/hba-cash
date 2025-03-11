class Salary {

	constructor(total) {
		this.total = total
	}

	initLadder() {
		const ladder = [
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

		return ladder

	}

	identifySalary() {
		let ladder = this.initLadder()

		let superx = 0
		let trafix = 0

		let step = 0

		for (let i = 0; i < ladder.length; i++) {
			if (this.total <= 0) {
				step = 0
			} else if (this.total < ladder[i]['ladder']) {
				step = i - 1
			} else if (this.total > ladder[ladder.length - 1]['ladder']) {
				step = ladder.length - 1
			}
		}

		superx = ladder[step]['super']
		trafix = ladder[step]['trafic']

		let returnData = {
			"superx" : superx,
			"trafix" : trafix
		}

		return JSON.stringify(returnData)

	}

}


module.exports = Salary