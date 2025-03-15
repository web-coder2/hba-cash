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
		addGame() {
			let gameObj = {
				"title" : this.title,
				"gameInfo" : this.gameInfo,
				"gameSrc" : this.gameSrc
			}
			console.log(gameObj)
		}
	}
})