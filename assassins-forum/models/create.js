const path = require('path')
const fs = require('fs')


class Creater {

	constructor(title, info, src) {
		this.title = title  // string
		this.info = info    // array
		this.src = src      // array 
	}

	saveData() {

		let gameObj = {
			'title' : this.title,
			'info' : this.info,
			'src' : this.src
		}
		console.log(gameObj)
	}

}

module.exports = Creater