let app = new Vue({
	el: "#app",
	data: {
		rows: 1,
		title: '',
		gameInfo: ['', ],
		gameSrc: ['', ]
	},
	methods: {
		addRow() {
			this.rows += 1
		},
		removeRow() {
			this.rows -= 1
		},
		async addGame() {
			let gameObj = {
				"title" : this.title,
				"gameInfo" : this.gameInfo,
				"gameSrc" : this.gameSrc
			}

			console.log(gameObj)

			let response = await fetch('/api/create', {
				method: "POST",
				headers: {'Content-Type' : 'applications/json'},
				body: JSON.stringify({'gameObj' : gameObj})
			})
		}
	}
})