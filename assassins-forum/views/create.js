let app = new Vue({
	el: "#app",
	data: {
		rows: 1,
		title: '',
		gameInfo: ['', ],
		gameSrc: ['', ]
	},
	mounted() {
		this.fetchAllGames()
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
				headers: {'Content-Type' : 'application/json'},
				body: JSON.stringify({'gameObj' : gameObj})
			})
		},
		async fetchAllGames() {
			this.loaded = false
			let response = await fetch('/games', {
				method: "GET",
				headers: {'Content-Type': "application/json"},
			}).then(res => res.json()).then(data => this.allGames = data)

			for (let i = 0; i < this.allGames.length; i++) {
				this.allGames[i]['title'] = `/game/${this.allGames[i]['title']}`
			}
			this.loaded = true
		}
	}
})