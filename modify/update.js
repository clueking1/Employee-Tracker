const mysql = require('mysql')
const inquirer = require('inquirer')
const begin = require('../server')

function updateSomething () {
    inquirer.prompt({
        type: 'list',
        name: 'updateWhat',
        message: 'What will you like to update?',
        choices: ['Departments', 'Roles', 'Employees']
    })
    .then(ans => {
        lowerAns = ans.updateWhat.toLowerCase()
        setTimeout(eval(lowerAns), 1)
    })
}

//UPDATE DEPARTMENT
function departments () {
    begin.con.query(
        'SELECT * FROM departments', (err, res) => {
            if (err) {
                throw err
            }
            inquirer.prompt({
                type: 'list',
                name: 'updateDepart',
                message: 'What Department would you like to update',
                choices: res.map(t => t.name)
            })
            .then(ans => {
                let chosenDepart;

                res.find(t => {
                    if (t.name === ans.updateDepart) {
                        chosenDepart = t.id
                    }
                })
                updateDepart(chosenDepart)
            })
        }
    )
}

function updateDepart(departId) {
    begin.con.query(
        'SELECT * FROM departments', (err, res) => {
            if (err) {
                throw err
            }
            inquirer.prompt({
                type: 'input',
                name: 'updateDepart2',
                message: 'What is the new name of this Department?',
            })
            .then(ans => {
                begin.con.query(
                    'UPDATE departments SET ? WHERE ?',
                    [
                        {
                            name: ans.updateDepart2
                        },
                        {
                            id: departId
                        }
                    ],
                    err => {
                        if (err) {
                            throw err
                        }
                        console.log('Department Updated!!!!')
                        begin.start()
                    }
                )
            })
        }
    )
}
