let app = new Vue({
    el: '#app',
    async mounted() {
        await this.fetchAllData()
        await this.fetchGroupedData()
        await this.fetchLadder()
        await this.fetchNewData()
        await this.fetchGroupedNewData()

        this.allDataParams = this.getAllDataParams()

        this.createChart(this.getAllValueParams('date'), this.getAllValueParams(this.paramName))
        this.createChartNew(this.getAllValueParamsNew('date'), this.getAllValueParamsNew(this.paramNameNew))

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
        newData: [],
        groupedNewData: [],
        ladder: [],
        allDataParams: [],
        paramName: 'office',
        paramNameNew: 'office',
        dataFileJSON: [],
        chart: null,
        chartNew: null,
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
        async fileDataCreate(dataObj) {
            let response = await fetch('/api/create', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataObj)
            })
        },
        handleFileChange(event) {
            const file = event.target.files[0];
      
            if (file) {
              const reader = new FileReader();
      
                reader.onload = (e) => {
                    const jsonString = e.target.result;
                    let jsonData = JSON.parse(jsonString);
                    let fullJsonData = []

                    //console.log(jsonData)

                    for (let i = 0; i < jsonData.length; i++) {
                        let dataArray = jsonData[i]['Дата'].split('.')

                        if (dataArray[2].length == 2) {
                            var formatDate = `20${dataArray[2]}-${dataArray[0]}-${dataArray[1]}`
                        } else if (dataArray[2].length == 4) {
                            var formatDate = `${dataArray[2]}-${dataArray[0]}-${dataArray[1]}`
                        }

                        let dataObj = {
                            'date' : formatDate,
                            'diffHold' : jsonData[i]['Сумма_HOLD_Разница'],
                            'summHold' : jsonData[i]['Сумма_HOLD_Итого'],
                            'office' : jsonData[i]['Офис'],
                            'robot' : jsonData[i]['Робот'],
                            'oklad' : jsonData[i]['Окладчики']
                        }

                        fullJsonData.push(dataObj)

                        //console.log(dataObj)

                    }

                    console.log(fullJsonData)

                    let response = fetch('/api/createByFile', {
                        method: "POST",
                        headers: {'Content-Type' : 'application/json'},
                        body: JSON.stringify({"fullData": fullJsonData})
                    })

                    //console.log(jsonData)
                };
      
              reader.readAsText(file);
            } else {
              console.log('huyaks')
            }
        },
        async fetchGroupedData() {
            let response = await fetch('/api/groupedData', {
                method: "GET",
                headers: {'Content-Type' : 'application/json'}
            }).then(res => res.json()).then(data => this.groupedData = data)
        },
        async fetchLadder() {
            let response = await fetch('/api/getLadder', {
                method: 'GET',
                headers: {'Content-Type' : 'application/json'},
            }).then(res => res.json()).then(data => this.ladder = data)

            console.log(this.ladder)

        },
        async testNahuy() {
            for (let row = 0; row < this.ladder.length; row++) {
                this.ladder[row]['ladder'] = parseInt(this.ladder[row]['ladder'])
                this.ladder[row]['super'] = parseInt(this.ladder[row]['super'])
                this.ladder[row]['trafic'] = parseInt(this.ladder[row]['trafic'])
            }
            let response = await fetch('/api/changeLadder', {
                method: "POST",
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({"ladder" : this.ladder})
            })
        },
        async fetchNewData() {
            let response = await fetch('/api/newData', {
                method: 'GET',
                headers: {'Content-Type' : 'application/json'}
            }).then(res => res.json()).then(data => this.newData = data)
        },
        async fetchGroupedNewData() {
            let response = await fetch('/api/groupedNewData', {
                method: 'GET',
                headers: {'Content-Type' : 'application/json'}
            }).then(res => res.json()).then(data => this.groupedNewData = data)
        },
        getAllValueParams(param) {
            let valuesArr = []

            for (let i = 0; i < this.groupedData.length; i++) {
                valuesArr.push(this.groupedData[i][param])
            }
            return valuesArr
        },
        getAllValueParamsNew(param) {
            let valuesArr = []

            for (let i = 0; i < this.groupedNewData.length; i++) {
                valuesArr.push(this.groupedNewData[i][param])
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
        },
        createChartNew(arrayDateValues, arrayValuesParams) {
            if (this.chartNew) {
              this.chartNew.destroy();
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
      
            const ctx = this.$refs.chartDivNew.getContext('2d');
            this.chartNew = new Chart(ctx, {
              type: 'line',
              data: chartData,
              options: options,
            });
        }
    }
})