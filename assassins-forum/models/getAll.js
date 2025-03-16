const path = require('path')
const fs = require('fs')

class GetAll {

	getByTitle(title) {
		const pathGames = path.join(__dirname, '..', 'games.json')
		const dataGames = JSON.parse(fs.readFileSync(pathGames))

		for (let i = 0; i < dataGames.length; i++) {
			if (dataGames[i]['title'] == title) {
				return dataGames[i]
			}
		}
	}
	getAllGames() {
		const pathGames = path.join(__dirname, '..', 'games.json')
		const dataGames = JSON.parse(fs.readFileSync(pathGames))

		return dataGames
	}

}

module.exports = GetAll