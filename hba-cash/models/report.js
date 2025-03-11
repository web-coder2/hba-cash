const fs = require('fs')
const path = require('path')
const salary = require(path.join(__dirname, 'salary.js'))

class Report {

    constructor(date, robot, summHold, diffHold, oklad, office) {

        this.date = date 
        this.robot = robot 
        this.summHold = summHold
        this.diffHold = diffHold
        this.oklad = oklad
        this.office = office

        this.nalog = Math.floor((this.summHold + this.diffHold) * 10 * 0.6 * 0.07)
        this.brokerSalary = Math.floor(0.37 * (this.summHold * 0.6) / 0.63 + this.summHold * 0.6)
        this.officeSpent = Math.floor(this.robot + this.oklad + this.office + this.nalog + this.brokerSalary)
        this.officeSalary = Math.floor((this.summHold + this.diffHold) * 0.6 * 10)
        this.total = Math.floor(this.officeSalary - this.officeSpent)
        
        this.trafixSalary = this.getSalary()['trafix']
        this.superxSalary = this.getSalary()['superx']

    }

    getSalary() {
        let salaryObj = new salary(this.total).identifySalary()
        return JSON.parse(salaryObj)
    }


    getData() {
        return {
            'date': this.date,
            'robot': this.robot,
            'summHold': this.summHold,
            'diffHold': this.diffHold,
            'oklad': this.oklad,
            'office': this.office,
            'nalog': this.nalog,
            'brokerSalary': this.brokerSalary,
            'officeSpent': this.officeSpent,
            'officeSalary': this.officeSalary,
            'trafixSalary': this.trafixSalary,
            'superxSalary': this.superxSalary,
            'total': this.total
        }
    }

    saveData() {
        let filePath = path.join(__dirname, '..', 'data.json')


        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                console.error("Ошибка чтения файла:", err);
                return; // Важно выйти из функции, если произошла ошибка
            }

            try {
                let fileData = [];
                if (content) { // Проверяем, что файл не пустой
                    fileData = JSON.parse(content);
                }

                // Добавляем новые данные в массив
                fileData.push(this.getData());

                // Преобразуем обратно в JSON строку
                const jsonData = JSON.stringify(fileData, null, 2); // null, 2 для красивого форматирования

                // Записываем данные обратно в файл
                fs.writeFile(filePath, jsonData, (err) => {
                    if (err) {
                        console.error("Ошибка записи в файл:", err);
                    } else {
                        console.log("Данные успешно сохранены в файл!");
                    }
                });

            } catch (parseError) {
                console.error("Ошибка парсинга JSON:", parseError);
            }
        });
    }

}


module.exports = Report