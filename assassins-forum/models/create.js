const path = require('path')
const fs = require('fs')


class Creater {

	constructor(gameObj) {
		this.gameObj = gameObj
	}

	saveData() {

		//console.log(this.gameObj)

		let gameDataPath = path.join(__dirname, '..', 'games.json')
		let gameData = JSON.parse(fs.readFileSync(gameDataPath, 'utf-8'))
		gameData.push(this.gameObj)
		
		let pushedGames = JSON.stringify(gameData, null, 2)
		fs.writeFileSync(gameDataPath, pushedGames)
	}

}

module.exports = Creater