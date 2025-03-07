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
        }
    },
    methods: {
        async created() {
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
            }).then(res => res.json()).then(data => console.log(data))
        }
    }
})