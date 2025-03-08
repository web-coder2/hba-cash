let app = new Vue({
    el: '#app',
    mounted() {
        this.fetchAllData()
    },
    data: {
        createData: {
            date: '',
            robot: 40000,
            summHold: 1000,
            diffHold: 1000,
            oklad: 35000,
            office: 35000
        },
        superOklad: 450,
        traficOklad: 500,
        data: [],
        ladder: [
            [0, 150, 200],
            [10000, 1000, 1000],
            [20000, 2000, 2000],
            [30000, 3000, 3000],
            [40000, 4000, 4000],
            [50000, 5000, 5000],
            [60000, 6000, 6000],
            [70000, 7000, 7000],
            [100000, 10000, 10000],
            [150000, 15000, 15000],
            [200000, 20000, 20000],
            [300000, 30000, 30000],
            [350000, 35000, 35000],
            [400000, 40000, 40000],
            [500000, 50000, 50000],
        ]
    },
    methods: {
        async created() {

            if (this.createData.summHold) {
                this.createData.summHold = parseInt(this.createData.summHold);
            }
            if (this.createData.diffHold) {
                this.createData.diffHold = parseInt(this.createData.diffHold);
            }
            if (this.createData.oklad) {
                this.createData.oklad = parseInt(this.createData.oklad);
            }
            if (this.createData.office) {
                this.createData.office = parseInt(this.createData.office);
            }

            let response = await fetch('/api/create', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.createData)
            })
        },
        async fetchAllData() {
            let response = await fetch('api/data', {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            }).then(res => res.json()).then(data => this.data = data)
        },
        getNumData(data) {
            let nalog = Math.floor((data.summHold + data.diffHold) * 10 * 0.6 * 0.07)
            let salary = Math.floor(0.37 * (data.summHold * 0.6) / 0.63 + data.summHold * 0.6)
            let officeSpent = Math.floor(data.robot + data.oklad + data.office + nalog + salary)
            let officeSalary = Math.floor((data.summHold + data.diffHold) * 0.6 * 10)
            let total = Math.floor( officeSalary - officeSpent - this.getSalary(data.summHold).super - this.getSalary(data.summHold).trafic )
            return [nalog, salary, officeSpent, officeSalary, total]
        },
        getSalary(num) {
            let idx = 0

            for (let i = 0; i < this.ladder.length; i++) {
                if (num >= this.ladder[i][0]) {
                    idx += 1
                } else if (num < this.ladder[i][0]) {
                    idx = i - 1 
                    break
                }
            }

            let salaryData = {
                "super" : this.ladder[idx][1],
                "trafic" : this.ladder[idx][2]
            }

            let salaryZero = {
                "super" : this.superOklad,
                "trafic" : this.traficOklad
            }

            if (num < 0) {
                return salaryZero
            } else {
                return salaryData
            }
        }
    }
})