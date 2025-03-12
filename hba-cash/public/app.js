let app = new Vue({
    el: '#app',
    async mounted() {
        await this.fetchAllData()
        await this.fetchGroupedData()

        this.allDataParams = this.getAllDataParams()

        console.log(this.groupedData)
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
        groupedData: [],
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
        ],
        allDataParams: [],
        paramName: '',
        chart: null,
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
        async fetchGroupedData() {
            let response = await fetch('/api/groupedData', {
                method: "GET",
                headers: {'Content-Type' : 'application/json'}
            }).then(res => res.json()).then(data => this.groupedData = data)
        },
        getAllValueParams(param) {
            let valuesArr = []

            for (let i = 0; i < this.groupedData.length; i++) {
                valuesArr.push(this.groupedData[i][param])
            }
            return valuesArr
        },
        getAllDataParams() {
            let someObject = this.groupedData[0];
            let keys = [];
            if (someObject) {
              keys = Object.keys(someObject);
            }
            return keys;
        },
        createChart(arrayDateValues, arrayValuesParams) {
            if (this.chart) {
              this.chart.destroy();
            }
      
            const chartData = {
              labels: arrayDateValues,
              datasets: [
                {
                    pointBackgroundColor: 'rgb(0, 0, 0)',
                    hoverOffset: 20,
                    fillColor: 'rgba(0, 0, 0, 1)',
                    fill: true,
                    borderColor: "rgba(0, 0, 0, 0.8)",
                    pointRadius: 5,
                    pointHoverRadius: 10,
                    tension: 0.5,
                    data: arrayValuesParams,
                    backgroundColor: "rgba(0, 0, 0, 0.6)"
                },
              ],
            };
      
            const options = {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                maintainAspectRatio: false,
                tooltips: {
                    mode: 'label',
                    intersect: false,
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
            };
      
            const ctx = this.$refs.chartDiv.getContext('2d');
            this.chart = new Chart(ctx, {
              type: 'line',
              data: chartData,
              options: options,
            });
        }
    }
})